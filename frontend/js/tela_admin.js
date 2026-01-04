document.querySelector('.botao_deslogar').addEventListener('click', () => {
                localStorage.removeItem('userName');
                window.location.href = 'login.html';
});


async function carregarTotalClientes() {
    try {
        const response = await fetch('http://localhost:3001/api/clientes');
        const clientes = await response.json();

        const clientesUnicos = new Set(clientes.map(c => c.id));

        document.getElementById('totalClientes').textContent =
            clientesUnicos.size;

    } catch (error) {
        console.error('Erro ao carregar total de clientes:', error);
        document.getElementById('totalClientes').textContent = '0';
    }
}

document.addEventListener('DOMContentLoaded', carregarTotalClientes);



document.addEventListener('DOMContentLoaded', () => {
    carregarTotalClientes();
});
