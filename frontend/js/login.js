document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtém a referência do formulário
    const loginForm = document.getElementById('loginForm');

    // 2. Adiciona o event listener para a submissão do formulário
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 3. Obtém os valores dos campos
        const emailInput = document.getElementById('email');
        const senhaInput = document.getElementById('senha');
        const email = emailInput.value;
        const senha = senhaInput.value;

        try {
            // 4. Faz a requisição POST para /login
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            // 5. Processa a resposta
            const data = await response.json();

            if (response.ok) {
                // 6. Login bem-sucedido: Salva dados no LocalStorage
                localStorage.setItem('userName', data.nome);
                localStorage.setItem('userType', data.tipo_usuario);
                localStorage.setItem('userEmail', email);

                // 7. Redireciona com base no tipo de usuário (Lógica replicada do React)
                if (data.tipo_usuario === 'Administrador') {
                    window.location.href = '/admin';
                } else {
                    // Usando a barra inicial (/) para garantir que a rota funcione
                    window.location.href = '/tela_usuario.html'; 
                }
            } else {
                // 8. Login falhou (erro do servidor)
                alert(data.error || 'Erro desconhecido ao fazer login.');
            }
        } catch (error) {
            // 9. Erro de rede ou erro na execução do código
            console.error('Erro:', error);
            alert('Erro ao fazer login. Verifique sua conexão.');
        }
    });
});