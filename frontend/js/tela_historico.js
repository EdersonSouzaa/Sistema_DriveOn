document.addEventListener('DOMContentLoaded', () => {
  const carList = document.getElementById('car-list');

  if (!carList) {
    console.error('❌ Container #car-list não encontrado');
    return;
  }

  // 🚗 DADOS MOCK (histórico)
  const cars = [
    {
      nome: "BMW X6",
      combustivel: "Gasolina",
      cambio: "Automático",
      lugares: 5,
      destaque: "Luxo",
      imagem:  "./assets/cars/car_card4.jpg"
    },
    {
      nome: "Mini Cooper",
      combustivel: "Gasolina",
      cambio: "Automático",
      lugares: 4,
      destaque: "Novo",
      imagem: "./assets/cars/car_card3.jpg"
    },
    {
      nome: "Range Rover Evoque",
      categoria: "SUV",
      combustivel: "Gasolina",
      cambio: "Automático",
      lugares: 5,
      destaque: "Novo",
      imagem: "./assets/cars/car_card6.png"
    },
    {
      nome: "Jeep Compass",
      categoria: "SUV",
      combustivel: "Gasolina",
      cambio: "Automático",
      lugares: 5,
      destaque: "Offroad",
      imagem: "./assets/cars/car_card1.jpg"
    },
    {
      nome: "Maserati GranTurismo",
      categoria: "Luxo",
      combustivel: "Gasolina",
      cambio: "Automático",
      lugares: 4,
      destaque: "Exotico",
      imagem: "./assets/cars/car_card5.png"
  
    },
    {
      nome: "McLaren 720S",
      categoria: "Luxo",
      combustivel: "Gasolina",
      cambio: "Automático",
      lugares: 2,
      destaque: "Premium",
      imagem: "./assets/cars/car_card2.jpg"
    }

  ];

  if (!cars.length) {
    carList.innerHTML = "<p>Nenhum carro encontrado.</p>";
    return;
  }

  carList.innerHTML = cars.map(car => `
    <div class="car-card">
      <div class="car-card__image">
        <img src="${car.imagem}" alt="${car.nome}">
      </div>

      <div class="car-card__content">
        <h3 class="car-card__title">${car.nome}</h3>
        <p class="car-card__description">${car.categoria}</p>

        <ul class="car-card__features">
          <li>⛽ ${car.combustivel}</li>
          <li>⚙ ${car.cambio}</li>
          <li>👥 ${car.lugares} lugares</li>
        </ul>

        <div class="car-card__footer">
          <div class="price">
          </div>

          <div class="card-actions1">
            <button class="btn-primary1">Cancelar</button>
          </div>

          <div class="card-actions">
            <button class="btn-primary">Reservar</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
});
