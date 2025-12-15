const { spawn } = require("child_process");
const net = require("net");

function isPortOpen(port, callback) {
  const socket = new net.Socket();

  socket.setTimeout(500);
  socket.once("connect", () => {
    socket.destroy();
    callback(true);
  });

  socket.once("error", () => {
    callback(false);
  });

  socket.once("timeout", () => {
    callback(false);
  });

  socket.connect(port, "127.0.0.1");
}

// Inicia o backend
spawn("node", ["server.js"], {
  cwd: "backend",
  stdio: "ignore",
  shell: true
});

// Aguarda o backend subir de verdade
const interval = setInterval(() => {
  isPortOpen(3001, (open) => {
    if (open) {
      clearInterval(interval);
      console.clear();
      console.log("✅ Servidor rodando com sucesso!");
      console.log("🌐 Acesse: http://localhost:3001");
    }
  });
}, 300);
