/**
 * Função para carregar os dados dinâmicos do dashboard
 */
async function carregarDadosDashboard() {
    try {
        // REMOVIDO localhost:3001
        const response = await fetch('/api/clientes'); 
        const clientes = await response.json();

        const totalClientesEl = document.getElementById('totalClientes');
        if (totalClientesEl) totalClientesEl.textContent = clientes.length;
        
        // ... resto do seu código
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    carregarDadosDashboard();
    
    // Atualiza automaticamente a cada 10 segundos para você ver o contador subir
    setInterval(carregarDadosDashboard, 10000);
});
/**
 * Inicialização e Listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    // Carrega os dados da API
    carregarDadosDashboard();

    // Exibe o nome do usuário logado se existir
    const userName = localStorage.getItem('userName');
    if (userName) {
        const headerTitle = document.querySelector('.title-header');
        if (headerTitle) headerTitle.textContent = `Bem-vindo, ${userName}`;
    }

    // Configuração do botão de logout
    const btnDeslogar = document.querySelector('.botao_deslogar');
    if (btnDeslogar) {
        btnDeslogar.addEventListener('click', () => {
            localStorage.removeItem('userName');
            // localStorage.clear(); // Use clear se quiser limpar tudo
            window.location.href = 'login.html';
        });
    }

    // Efeitos de clique nos cards de métricas
    document.querySelectorAll('.card-metrica').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 150);
        });
    });
});