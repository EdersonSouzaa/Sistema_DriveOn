const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 3001;

// ================= MIDDLEWARES =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= BANCO =======================
const sequelize = new Sequelize('driveon_db', 'root', 'Eder12345678!@', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
  tipo_usuario: { type: DataTypes.STRING, allowNull: false },
  cpf: { type: DataTypes.STRING, allowNull: true },
  cnh: { type: DataTypes.STRING, allowNull: true },
  telefone: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'usuarios',
  timestamps: true
});

// ================= ROTAS API ===================
app.get('/api/test', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/api/signup', async (req, res) => {
  try {
    console.log("📦 BODY RECEBIDO:", req.body);

    const {
      nome,
      email,
      senha,
      tipoUsuario,
      cpf,
      cnh,
      telefone,
      cargo,
      codigoVerificacao
    } = req.body;

    if (!nome || !email || !senha || !tipoUsuario) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }

    await Usuario.create({
  nome,
  email,
  senha,
  tipo_usuario: tipoUsuario,

  cpf: tipoUsuario === 'Cliente' ? cpf : null,
  cnh: tipoUsuario === 'Cliente' ? cnh : null,
  telefone: tipoUsuario === 'Cliente' ? telefone : null,

  cargo: tipoUsuario === 'Administrador' ? cargo : null,
  codigoVerificacao: tipoUsuario === 'Administrador' ? codigoVerificacao : null
});


    res.status(201).json({ message: 'Cadastro realizado com sucesso' });

  } catch (err) {
    console.error("🔥 ERRO:", err);
    res.status(500).json({ error: err.message });
  }
});




// ================= FRONTEND ====================
app.use(express.static(path.join(__dirname, '../frontend')));

// ================= FALLBACK ====================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

// ================= START =======================
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`🚀 Sistema DriveOn rodando em http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Erro ao iniciar o servidor:', err.message);
  }
})();
