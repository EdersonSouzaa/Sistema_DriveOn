// ================= VARIÁVEIS GLOBAIS =================
// Declarar aqui para que carregarClientes e buscarClientes usem a mesma lista
let listaClientes = []; 
let clienteIdParaExcluir = null;

// ================= LOAD =================
document.addEventListener('DOMContentLoaded', () => {
    carregarClientes();

    // Configurar busca (Opcional: busca automática enquanto digita)
    const inputBusca = document.getElementById('searchInput');
    if (inputBusca) {
        inputBusca.addEventListener('input', buscarClientes);
    }
});

// ================= LOGOUT =================
document.querySelector('.botao_deslogar').addEventListener('click', () => {
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
});

// ================= CARREGAR CLIENTES =================
async function carregarClientes() {
    const tbody = document.getElementById('clientesTableBody');
    if (!tbody) return;

    try {
        // Usar rota relativa para funcionar tanto local quanto online
        const response = await fetch('/api/clientes'); 
        listaClientes = await response.json();
        renderizarClientes(listaClientes);
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Erro ao conectar com o servidor.</td></tr>';
    }
}

// ================= DELETE =================
function deletarUsuario(id) {
    clienteIdParaExcluir = id;
    const modal = document.getElementById('deleteModal');
    if (modal) modal.classList.add('active');
}

function closeDeleteModal() {
    clienteIdParaExcluir = null;
    const modal = document.getElementById('deleteModal');
    if (modal) modal.classList.remove('active');
}

document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    if (!clienteIdParaExcluir) return;

    try {
        // CORREÇÃO: Removido localhost para manter consistência com o resto do código
        const response = await fetch(`/api/clientes/${clienteIdParaExcluir}`, { 
            method: 'DELETE' 
        });

        if (response.ok) {
            closeDeleteModal();
            carregarClientes(); // Recarrega a lista após excluir
        } else {
            const result = await response.json();
            alert(result.error || 'Erro ao excluir cliente');
        }
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao conectar com o servidor');
    }
});

// ================= RENDERIZAÇÃO E BUSCA =================
function renderizarClientes(clientes) {
    const tbody = document.getElementById('clientesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (!clientes || clientes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum cliente encontrado</td></tr>`;
        return;
    }

    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${formatarTelefone(cliente.telefone)}</td>
            <td><span class="status ativo">Ativo</span></td>
            <td class="btns">
                <button onclick="deletarUsuario(${cliente.id})">
                    <img src="./assets/delete.png" class="delete" alt="Excluir">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function buscarClientes() {
    const termo = document.getElementById('searchInput').value.toLowerCase().trim();

    if (!termo) {
        renderizarClientes(listaClientes);
        return;
    }

    const filtrados = listaClientes.filter(cliente =>
        (cliente.nome && cliente.nome.toLowerCase().includes(termo)) ||
        (cliente.email && cliente.email.toLowerCase().includes(termo)) ||
        (cliente.telefone && cliente.telefone.includes(termo))
    );

    renderizarClientes(filtrados);
}

function formatarTelefone(telefone) {
    if (!telefone) return 'Não informado';
    const t = telefone.replace(/\D/g, '');
    if (t.length === 11) return `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}`;
    if (t.length === 10) return `(${t.slice(0, 2)}) ${t.slice(2, 6)}-${t.slice(6)}`;
    return telefone;
}