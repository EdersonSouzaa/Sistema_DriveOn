require('dotenv').config();

const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

/* ================= MIDDLEWARES ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= BANCO (CONFIGURADO PARA MYSQL) ======================= */
// O Sequelize usará as variáveis que o Railway fornece automaticamente
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE, // Nome do banco
  process.env.MYSQLUSER,     // Usuário
  process.env.MYSQLPASSWORD, // Senha
  {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT || 3306,
    dialect: 'mysql', // Mudamos de postgres para mysql
    logging: false,
  }
);

/* ================= MODEL ======================= */
const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo_usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: DataTypes.STRING,
  cnh: DataTypes.STRING,
  telefone: DataTypes.STRING,
  cargo: DataTypes.STRING,
  codigo_verificacao: DataTypes.STRING
}, {
  tableName: 'usuarios',
  timestamps: true
});

/* ================= ROTAS ======================= */

// Teste
app.get('/api/test', (req, res) => {
  res.json({ status: 'OK', banco: 'MySQL Conectado' });
});

// Cadastro
app.post('/api/signup', async (req, res) => {
  try {
    const {
      nome, email, senha, tipoUsuario, cpf, cnh, telefone, cargo, codigo_verificacao
    } = req.body;

    if (!nome || !email || !senha || !tipoUsuario) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ error: 'Este email já está cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      tipo_usuario: tipoUsuario,
      cpf: tipoUsuario === 'Cliente' ? cpf : null,
      cnh: tipoUsuario === 'Cliente' ? cnh : null,
      telefone: tipoUsuario === 'Cliente' ? telefone : null,
      cargo: tipoUsuario === 'Administrador' ? cargo : null,
      codigo_verificacao: tipoUsuario === 'Administrador' ? codigo_verificacao : null
    });

    return res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('❌ ERRO CADASTRO:', error);
    return res.status(500).json({ error: 'Erro interno ao cadastrar usuário' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    return res.status(200).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao fazer login' });
  }
});

// Perfil, Listagem e Delete (Mantidos conforme seu original...)
app.get('/api/user/profile', async (req, res) => {
    const { email } = req.query;
    try {
      const usuario = await Usuario.findOne({ where: { email }, attributes: ['nome', 'email', 'telefone', 'cpf', 'cnh', 'createdAt'] });
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(usuario);
    } catch (error) { res.status(500).json({ error: 'Erro interno' }); }
});

app.get('/api/clientes', async (req, res) => {
    try {
      const clientes = await Usuario.findAll({ where: { tipo_usuario: 'Cliente' }, attributes: ['id', 'nome', 'email', 'telefone'] });
      res.json(clientes);
    } catch (error) { res.status(500).json({ error: 'Erro ao buscar clientes' }); }
});

app.delete('/api/clientes/:id', async (req, res) => {
    try {
      await Usuario.destroy({ where: { id: req.params.id, tipo_usuario: 'Cliente' } });
      res.json({ message: 'Cliente excluído' });
    } catch (error) { res.status(500).json({ error: 'Erro ao excluir' }); }
});

/* ================= FRONTEND =================== */
// Ajuste o caminho conforme a pasta do seu projeto no Render
app.use(express.static(path.join(__dirname, '../frontend'))); 

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

/* ================= START ====================== */
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL conectado via Railway');

    // sync() cria as tabelas automaticamente se não existirem
    await sequelize.sync({ alter: true }); 
    console.log('📦 Tabelas sincronizadas');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erro ao iniciar:', err);
    process.exit(1);
  }
})();