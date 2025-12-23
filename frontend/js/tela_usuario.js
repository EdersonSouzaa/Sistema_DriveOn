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
