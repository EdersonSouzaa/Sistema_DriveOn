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
