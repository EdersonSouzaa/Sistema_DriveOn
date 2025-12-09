const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do MySQL
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'driveon_db',
  logging: console.log, // Mostra as queries SQL no console
  define: {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    underscored: true, // Usa snake_case para nomes de colunas
  },
});

// Testar conexão com o banco de dados
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com MySQL estabelecida com sucesso!');
    
    // Sincronizar modelos com o banco de dados
    // force: false - não recria as tabelas se já existirem
    // alter: true - atualiza as tabelas existentes se houver mudanças
    await sequelize.sync({ alter: false });
    console.log('✅ Sincronização com o banco de dados concluída!');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas básicas
app.get('/', (req, res) => {
  res.json({ message: 'Servidor DriveOn está rodando!' });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await testConnection();
});

// Exportar sequelize para uso em outros arquivos se necessário
module.exports = { app, sequelize };

