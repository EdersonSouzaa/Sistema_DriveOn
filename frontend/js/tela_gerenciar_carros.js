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

  lista.forEach(carro => {
    const card = document.createElement("div");
    card.classList.add("car-row");

    card.innerHTML = `
      <div class="car-card">
        <img src="${carro.imagem}">

        <div class="car-info">
          <h4>${carro.nome}</h4>
          <p class="car-plate">${carro.placa}</p>
        </div>

        <div class="car-price">R$ ${carro.preco}<span>/dia</span></div>
        <span class="car-status ${getStatusClass(carro.status)}">${carro.status}</span>

        <div class="car-actions">
          <button class="btn-delete">
            <img src="./assets/delete.png">
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
