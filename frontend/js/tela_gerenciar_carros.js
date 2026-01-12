let carroSelecionadoId = null;



const carros = [
  {
    id: 1,
    nome: "Jeep Compass",
    placa: "ABC-1234",
    detalhes: "SUV, URBANO, 4 Portas",
    preco: 90,
    status: "Disponível",
    imagem: "./assets/cars/car_card1.jpg"
  },
  {
    id: 2,
    nome: "Maserati GranTurismo",
    placa: "DEF-5678",
    detalhes: "Luxo, Esportivo, 2 Portas",
    preco: 150,
    status: "Alugado",
    imagem: "./assets/cars/car_card2.jpg"
  },
  {
    id: 3,
    nome: "Mini Cooper",
    placa: "GHI-9012",
    detalhes: "Popular econômico 4 portas",
    preco: 200,
    status: "Manutenção",
    imagem: "./assets/cars/car_card3.jpg"
  },
  {
    id: 4,
    nome: "BMW X6",
    placa: "JKL-3456",
    detalhes: "Luxo, Esportivo, 4 Portas",
    preco: 120,
    status: "Inativo",
    imagem: "./assets/cars/car_card4.jpg"
  },
  {
    id: 5,
    nome: "McLaren 720S",
    placa: "MNO-7890",
    detalhes: "Luxo, Esportivo, 2 Portas",
    preco: 180,
    status: "Disponível",
    imagem: "./assets/cars/car_card5.png"
  },
  {
    id: 6,
    nome: "Range Rover Evoque",
    placa: "PQR-1234",
    detalhes: "SUV, Urbano, 4 Portas",
    preco: 160,
    status: "Alugado",
    imagem: "./assets/cars/car_card6.png"
  }
];

const container = document.getElementById("carrosTableBody");

function renderizarCarros(lista) {
  container.innerHTML = "";

  const emptyState = document.getElementById("emptyState");

  if (lista.length === 0) {
    emptyState.style.display = "flex";
    return;
  }

  emptyState.style.display = "none";

  lista.forEach(carro => {
  const card = document.createElement("div");
  card.classList.add("car-row");

  card.innerHTML = `
    <div class="car-card">
      <img src="${carro.imagem}" alt="${carro.nome}">

      <div class="car-info">
        <h4>${carro.nome}</h4>
        <p class="car-plate">${carro.placa}</p>
      </div>

      <div class="car-price">
        R$ ${carro.preco}<span>/dia</span>
      </div>

      <span class="car-status ${getStatusClass(carro.status)}">
        ${carro.status}
      </span>

      <div class="car-actions">
        <button class="btn-delete" onclick="openDeleteModal(${carro.id})">
          <img src="./assets/delete.png" alt="Excluir">
        </button>
      </div>
    </div>
  `;

  container.appendChild(card);
});

}



function getStatusClass(status) {
  switch (status) {
    case "Disponível":
      return "status-available";
    case "Alugado":
      return "status-rented";
    case "Manutenção":
      return "status-maintenance";
    case "Inativo":
      return "status-inactive";
    default:
      return "";
  }
}

// Inicializa
renderizarCarros(carros);



function openDeleteModal(id) {
  const carro = carros.find(c => c.id === id);
  if (!carro) return;

  carroSelecionadoId = id;

  document.getElementById("modalCarImage").src = carro.imagem;
  document.getElementById("modalCarName").textContent = carro.nome;
  document.getElementById("modalCarPlate").textContent = carro.placa;

  document.getElementById("deleteModal").style.display = "flex";
}

function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
  carroSelecionadoId = null;
}



function confirmDelete() {
  if (carroSelecionadoId === null) return;

  const index = carros.findIndex(c => c.id === carroSelecionadoId);

  if (index !== -1) {
    carros.splice(index, 1);
    renderizarCarros(carros);
  }

  closeDeleteModal();
}


document.getElementById("deleteModal").style.display = "flex";


window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("deleteModal");
  if (modal) {
    modal.style.display = "none";
  }
});



function showSuccessToast() {
  const toast = document.getElementById("toastSuccess");
  if (!toast) return;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // 3 segundos
}


function confirmDelete() {
  if (carroSelecionadoId === null) return;

  const index = carros.findIndex(c => c.id === carroSelecionadoId);

  if (index !== -1) {
    carros.splice(index, 1);
    renderizarCarros(carros);
    showSuccessToast(); // 👈 AQUI
  }

  closeDeleteModal();
}



function handleNovoCarro() {
  alert("Abrir modal ou tela de cadastro de novo carro 🚗");
}



function openFilter() {
  document.getElementById("filterSidebar").classList.add("open");
  document.getElementById("filterOverlay").classList.add("open");
}

function closeFilter() {
  document.getElementById("filterSidebar").classList.remove("open");
  document.getElementById("filterOverlay").classList.remove("open");
}



function applyFilters() {
  const model = document.getElementById("filterModel").value.toLowerCase();
  const plate = document.getElementById("filterPlate").value.toLowerCase();
  const category = document.getElementById("filterCategory").value.toLowerCase();

  const filtrados = carros.filter(carro => {
    const matchModel = !model || carro.nome.toLowerCase().includes(model);
    const matchPlate = !plate || carro.placa.toLowerCase().includes(plate);
    const matchCategory = !category || carro.detalhes.toLowerCase().includes(category);

    return matchModel && matchPlate && matchCategory;
  });

  renderizarCarros(filtrados);
  closeFilter();
}



function clearFilters() {
  document.getElementById("filterModel").value = "";
  document.getElementById("filterPlate").value = "";
  document.getElementById("filterCategory").value = "";

  renderizarCarros(carros);
}



function openFilter() {
  const sidebar = document.getElementById("filterSidebar");
  const overlay = document.getElementById("filterOverlay");

  if (!sidebar || !overlay) {
    console.error("Filtro não encontrado no DOM");
    return;
  }

  sidebar.classList.add("open");
  overlay.classList.add("active");
}

function closeFilter() {
  document.getElementById("filterSidebar").classList.remove("open");
  document.getElementById("filterOverlay").classList.remove("active");
}

function openFilter() {
  document.getElementById("filterSidebar").classList.add("open");
}
