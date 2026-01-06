// ================= LOGOUT =================
document.querySelector('.botao_deslogar').addEventListener('click', () => {
  localStorage.removeItem('userName');
  window.location.href = 'login.html';
});

// ================= LOAD =================
document.addEventListener('DOMContentLoaded', () => {
  carregarClientes();
});

// ================= CARREGAR CLIENTES =================
async function carregarClientes() {
  const tbody = document.getElementById('clientesTableBody');
  tbody.innerHTML = '';

  try {
    const response = await fetch('http://localhost:3001/api/clientes');
    listaClientes = await response.json();
    renderizarClientes(listaClientes);

    if (!clientes.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;">
            Nenhum cliente cadastrado
          </td>
        </tr>`;
      return;
    }

    // 🔥 GARANTIR CLIENTES ÚNICOS (por ID)
    const clientesUnicos = new Map();
    clientes.forEach(cliente => {
      clientesUnicos.set(cliente.id, cliente);
    });

    clientesUnicos.forEach(cliente => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.email}</td>
        <td>${formatarTelefone(cliente.telefone)}</td>
        <td>
          <span class="status ativo">Ativo</span>
        </td>
        <td class="btns">
          <button onclick="deletarUsuario(${cliente.id})">
            <img src="./assets/delete.png" class="delete">
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
  }
}

// ================= DELETE MODAL =================
let clienteIdParaExcluir = null;

function deletarUsuario(id) {
  clienteIdParaExcluir = id;
  document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
  clienteIdParaExcluir = null;
  document.getElementById('deleteModal').classList.remove('active');
}

document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
  if (!clienteIdParaExcluir) return;

  try {
    const response = await fetch(
      `http://localhost:3001/api/clientes/${clienteIdParaExcluir}`,
      { method: 'DELETE' }
    );

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || 'Erro ao excluir cliente');
      return;
    }

    closeDeleteModal();
    carregarClientes();

  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    alert('Erro ao conectar com o servidor');
  }
});



function formatarTelefone(telefone) {
  if (!telefone) return 'Não informado';

  const t = telefone.replace(/\D/g, '');

  if (t.length === 11) {
    return `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}`;
  }

  if (t.length === 10) {
    return `(${t.slice(0, 2)}) ${t.slice(2, 6)}-${t.slice(6)}`;
  }

  return telefone;
}




function renderizarClientes(clientes) {
  const tbody = document.getElementById('clientesTableBody');
  tbody.innerHTML = '';

  if (!clientes.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">
          Nenhum cliente encontrado
        </td>
      </tr>
    `;
    return;
  }

  clientes.forEach(cliente => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${cliente.nome}</td>
      <td>${cliente.email}</td>
      <td>${cliente.telefone || 'Não informado'}</td>
      <td>
        <span class="status ativo">Ativo</span>
      </td>
      <td class="btns">
        <button onclick="deletarUsuario(${cliente.id})">
          <img src="./assets/delete.png" class="delete">
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}



function buscarClientes() {
  const termo = document
    .getElementById('searchInput')
    .value
    .toLowerCase()
    .trim();

  if (!termo) {
    renderizarClientes(listaClientes);
    return;
  }

  const filtrados = listaClientes.filter(cliente =>
    cliente.nome?.toLowerCase().includes(termo) ||
    cliente.email?.toLowerCase().includes(termo) ||
    cliente.telefone?.includes(termo)
  );

  renderizarClientes(filtrados);
}




