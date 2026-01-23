document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Erro ao fazer login');
        return;
      }

      // Salva no LocalStorage
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userName', data.nome);
      localStorage.setItem('userType', data.tipo_usuario);
      localStorage.setItem('userEmail', data.email);

      // Redirecionamento por tipo
      if (data.tipo_usuario === 'Administrador') {
        window.location.href = '/tela_admin.html';
      } else {
        window.location.href = '/tela_usuario.html';
      }

    } catch (error) {
      console.error('❌ ERRO LOGIN:', error);
      alert('Erro ao fazer login. Verifique sua conexão.');
    }
  });
});
