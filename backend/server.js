const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 3001;

/* ================= MIDDLEWARES ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= BANCO ======================= */
const sequelize = new Sequelize('driveon_db', 'root', 'Eder12345678!@', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

/* ================= MODEL ======================= */
const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
  tipo_usuario: { type: DataTypes.STRING, allowNull: false },

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
  res.json({ status: 'OK' });
});

// Cadastro
app.post('/api/signup', async (req, res) => {
  try {
    // ✅ PRIMEIRO extrair dados
    const {
      nome,
      email,
      senha,
      tipoUsuario,
      cpf,
      cnh,
      telefone,
      cargo,
      codigo_verificacao
    } = req.body;

    // ✅ Validação básica
    if (!nome || !email || !senha || !tipoUsuario) {
      return res.status(400).json({
        error: 'Campos obrigatórios não preenchidos'
      });
    }

    // ✅ Validar tipo de usuário
    if (!['Cliente', 'Administrador'].includes(tipoUsuario)) {
      return res.status(400).json({
        error: 'Tipo de usuário inválido'
      });
    }

    // ✅ Verificar email duplicado
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({
        error: 'Este email já está cadastrado'
      });
    }

    // ✅ Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // ✅ Criar usuário
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      tipo_usuario: tipoUsuario,

      // CLIENTE
      cpf: tipoUsuario === 'Cliente' ? cpf : null,
      cnh: tipoUsuario === 'Cliente' ? cnh : null,
      telefone: tipoUsuario === 'Cliente' ? telefone : null,

      // ADMIN
      cargo: tipoUsuario === 'Administrador' ? cargo : null,
      codigo_verificacao:
        tipoUsuario === 'Administrador' ? codigo_verificacao : null
    });

    return res.status(201).json(novoUsuario);

  } catch (error) {
  console.error('❌ ERRO CADASTRO COMPLETO:', error);
  console.error(error.original); // 👈 MOSTRA ERRO DO MYSQL

  return res.status(500).json({
    error: error.original?.sqlMessage || 'Erro interno ao cadastrar usuário'
  });
}

});

// Login
// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios'
      });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({
        error: 'Usuário não encontrado'
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({
        error: 'Senha inválida'
      });
    }

    // Login OK
    return res.status(200).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario
    });

  } catch (error) {
    console.error('❌ ERRO LOGIN:', error);
    return res.status(500).json({
      error: 'Erro interno ao fazer login'
    });
  }
});


// ================= PERFIL DO USUÁRIO =================
app.get('/api/user/profile', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email não informado' });
  }

  try {
    const usuario = await Usuario.findOne({
      where: { email },
      attributes: [
        'nome',
        'email',
        'telefone',
        'cpf',
        'cnh',
        'createdAt'
      ]
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cpf: usuario.cpf,
      cnh: usuario.cnh,
      criado_em: usuario.createdAt
    });

  } catch (error) {
    console.error('❌ ERRO PERFIL:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// ================= ROTAS API =======================

app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await Usuario.findAll({
      where: { tipo_usuario: 'Cliente' },
      attributes: ['id', 'nome', 'email', 'telefone']
    });

    res.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});


app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Usuario.findOne({
      where: { id, tipo_usuario: 'Cliente' }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    await cliente.destroy();

    res.json({ message: 'Cliente excluído com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ error: 'Erro interno ao excluir cliente' });
  }
});


/* ================= FRONTEND =================== */
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

/* ================= START ====================== */
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL conectado');

    await sequelize.sync();
    console.log('📦 Models sincronizados');

    app.listen(PORT, () => {
      console.log(`🚀 Sistema DriveOn rodando em http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Erro ao iniciar o servidor:', err.message);
  }
})();







