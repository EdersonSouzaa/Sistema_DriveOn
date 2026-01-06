const carros = [
  {
    id: 1,
    nome: "Compacto Mercedes",
    placa: "ABC-1234",
    detalhes: "SUV, URBANO, 4 Portas",
    preco: 90,
    status: "Disponível",
    imagem: "./assets/cars/car_card1.jpg"
  },
  {
    id: 2,
    nome: "Sedan Mercedes",
    placa: "DEF-5678",
    detalhes: "Fique lato",
    preco: 150,
    status: "Alugado",
    imagem: "./assets/cars/car_card2.jpg"
  },
  {
    id: 3,
    nome: "SUV Audi Q5",
    placa: "GHI-9012",
    detalhes: "Fique lato",
    preco: 200,
    status: "Manutenção",
    imagem: "./assets/cars/car_card3.jpg"
  }
];

const tbody = document.getElementById("clientesTableBody");

function renderizarCarros(lista) {
  tbody.innerHTML = "";

  lista.forEach(carro => {
    const tr = document.createElement("tr");
    tr.classList.add("car-row");

    tr.innerHTML = `
      <td>
        <div class="car-card">
          <img src="${carro.imagem}" alt="${carro.nome}">

          <div class="car-info">
            <h4>${carro.nome}</h4>
            <span class="car-plate">${carro.placa}</span>
            <span class="car-location"> ${carro.detalhes}</span>
          </div>

          <div class="car-price">
            R$ ${carro.preco}<span>/dia</span>
          </div>

          <span class="car-status ${getStatusClass(carro.status)}">
            ${carro.status}
          </span>

          <div class="car-actions">
            <button class="btn-edit" onclick="editarCarro(${carro.id})">✏️</button>
            <button class="btn-delete" onclick="abrirModalExcluir(${carro.id})">🗑️</button>
          </div>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
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
