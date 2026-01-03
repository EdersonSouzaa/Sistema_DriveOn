document.addEventListener('DOMContentLoaded', () => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return;

  const STORAGE_KEY = `historico_${userEmail}`;
  const historico =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const locacoesAtivasEl =
    document.getElementById('locacoesAtivas');

  if (locacoesAtivasEl) {
    locacoesAtivasEl.textContent = historico.length;
  }
});

 document.querySelector('.botao_deslogar').addEventListener('click', () => {
                localStorage.removeItem('userName');
                window.location.href = 'login.html';
 });


document.addEventListener('DOMContentLoaded', () => {
  const carrosDisponiveisEl =
    document.getElementById('carrosDisponiveis');

  const totalCarros =
    localStorage.getItem('totalCarrosDisponiveis');

  if (carrosDisponiveisEl && totalCarros !== null) {
    carrosDisponiveisEl.textContent = totalCarros;
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName');

  if (userName) {
    const greetingEl = document.getElementById('userGreeting');
    greetingEl.textContent = `Olá, ${userName}`;
  }
});

if (!localStorage.getItem('userName')) {
  window.location.href = '/login.html';
}