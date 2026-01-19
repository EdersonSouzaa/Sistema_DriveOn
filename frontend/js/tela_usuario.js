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





// Função para avisar o servidor que este usuário tem reservas
async function sincronizarReservaComServidor(email, totalReservas) {
    try {
        // Primeiro buscamos o cliente pelo email para saber o ID dele no servidor
        const res = await fetch(`http://localhost:3001/api/clientes`);
        const clientes = await res.json();
        const cliente = clientes.find(c => c.email === email);

        if (cliente) {
            // Se achou o cliente, atualizamos o status de reserva dele no servidor
            await fetch(`http://localhost:3001/api/clientes/${cliente.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    reservaAtiva: totalReservas > 0,
                    quantidadeReservas: totalReservas 
                })
            });
        }
    } catch (error) {
        console.error("Erro ao sincronizar com Admin:", error);
    }
}

// Chame essa função dentro do seu DOMContentLoaded original:
document.addEventListener('DOMContentLoaded', () => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return;

  const STORAGE_KEY = `historico_${userEmail}`;
  const historico = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const locacoesAtivasEl = document.getElementById('locacoesAtivas');
  if (locacoesAtivasEl) {
    locacoesAtivasEl.textContent = historico.length;
    // SINCRONIZAÇÃO: Envia para a API para o Admin ver
    sincronizarReservaComServidor(userEmail, historico.length);
  }
});


/**
 * Função para avisar o servidor sobre o status das locações do usuário
 * Isso permite que o Admin veja as "Reservas Ativas"
 */
async function sincronizarStatusComServidor(email, temReserva) {
    try {
        const response = await fetch('http://localhost:3001/api/clientes');
        const clientes = await response.json();
        const cliente = clientes.find(c => c.email === email);

        if (cliente) {
            await fetch(`http://localhost:3001/api/clientes/${cliente.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    reservaAtiva: temReserva 
                })
            });
        }
    } catch (error) {
        console.error('Erro ao sincronizar com servidor:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Gerenciar Nome e Saudação
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (userName) {
        const greetingEl = document.getElementById('userGreeting');
        if (greetingEl) greetingEl.textContent = `Olá, ${userName}`;
    } else {
        window.location.href = 'login.html';
    }

    // 2. Gerenciar Histórico e Locações Ativas
    if (userEmail) {
        const STORAGE_KEY = `historico_${userEmail}`;
        const historico = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        const locacoesAtivasEl = document.getElementById('locacoesAtivas');
        if (locacoesAtivasEl) {
            locacoesAtivasEl.textContent = historico.length;
        }

        // Sincroniza com a API para o Admin ler
        const temReserva = historico.length > 0;
        sincronizarStatusComServidor(userEmail, temReserva);
    }

    // 3. Exibir Total de Carros Disponíveis (vindo da tela de gerência)
    const carrosDisponiveisEl = document.getElementById('carrosDisponiveis');
    const totalCarros = localStorage.getItem('totalCarrosDisponiveis');
    if (carrosDisponiveisEl && totalCarros !== null) {
        carrosDisponiveisEl.textContent = totalCarros;
    }

    // 4. Configuração de Logout
    const btnSair = document.querySelector('.botao_deslogar');
    if (btnSair) {
        btnSair.addEventListener('click', () => {
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            window.location.href = 'login.html';
        });
    }
});





async function sincronizarComAdmin() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    // Pega o histórico do localStorage
    const STORAGE_KEY = `historico_${userEmail}`;
    const historico = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const temReserva = historico.length > 0;

    try {
        // 1. Busca todos os clientes para achar o ID do usuário logado
        const response = await fetch('http://localhost:3001/api/clientes');
        const clientes = await response.json();
        const clienteNoServidor = clientes.find(c => c.email === userEmail);

        if (clienteNoServidor) {
            // 2. Atualiza o servidor. O Admin vai ler esse campo 'reservaAtiva'
            await fetch(`http://localhost:3001/api/clientes/${clienteNoServidor.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    reservaAtiva: temReserva,
                    totalLocacoes: historico.length 
                })
            });
            console.log("Sincronizado com o Admin: ", temReserva);
        }
    } catch (error) {
        console.error("Erro na sincronização:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Executa a sincronização assim que a página carrega
    sincronizarComAdmin();

    // Atualiza o número na tela do usuário (o que ele vê)
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        const historico = JSON.parse(localStorage.getItem(`historico_${userEmail}`)) || [];
        const el = document.getElementById('locacoesAtivas');
        if (el) el.textContent = historico.length;
    }
    
    // ... resto do seu código de saudação e logout
});