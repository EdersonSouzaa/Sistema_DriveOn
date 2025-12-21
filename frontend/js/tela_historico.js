document.addEventListener('DOMContentLoaded', () => {
  const carList = document.getElementById('car-list');

  if (!carList) {
    console.error('❌ Container #car-list não encontrado');
    return;
  }

  // ===== MODAL =====
  const cancelModal = document.getElementById('cancelModal');
  const cancelCarName = document.getElementById('cancelCarName');
  const cancelNo = document.getElementById('cancelNo');
  const cancelYes = document.getElementById('cancelYes');
  const emptyState = document.getElementById('car-empty-state');


  let selectedCard = null;

  // 🚗 DADOS MOCK (histórico)
  const cars = [
    {
      nome: "BMW X6",
      combustivel: "Gasolina",
      cambio: "Automático",
      lugares: 5,
      destaque: "Luxo",
      imagem: "./assets/cars/car_card4.jpg"
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

  // ===== RENDERIZA OS CARROS =====
  carList.innerHTML = cars.map(car => `
    <div class="car-card">
      <div class="car-card__image">
        <img src="${car.imagem}" alt="${car.nome}">
      </div>

      <div class="car-card__content">
        <h3 class="car-card__title">${car.nome}</h3>
        <p class="car-card__description">${car.categoria ?? ''}</p>

        <ul class="car-card__features">
          <li>⛽ ${car.combustivel}</li>
          <li>⚙ ${car.cambio}</li>
          <li>👥 ${car.lugares} lugares</li>
        </ul>

        <div class="car-card__footer">
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

  if (!cars.length) {
  carList.innerHTML = '';
  document.getElementById('car-empty-state').hidden = false;
} else {
  document.getElementById('car-empty-state').hidden = true;
}


  // ===== EVENTO CANCELAR (DELEGAÇÃO) =====
  carList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-primary1')) {
      const card = e.target.closest('.car-card');
      const carName = card.querySelector('.car-card__title').textContent;

      selectedCard = card;
      cancelCarName.textContent = carName;
      cancelModal.classList.add('active');
    }
  });

  cancelYes.addEventListener('click', () => {
  if (selectedCard) {
    selectedCard.remove();
  }

  cancelModal.classList.remove('active');
  selectedCard = null;

  // 🔥 Se não tiver mais cards, mostra empty state
  if (!carList.querySelector('.car-card')) {
    document.getElementById('car-empty-state').hidden = false;
  }
});


  // ===== FECHAR MODAL =====
  cancelNo.addEventListener('click', () => {
    cancelModal.classList.remove('active');
    selectedCard = null;
  });

  cancelYes.addEventListener('click', () => {
    if (selectedCard) {
      selectedCard.remove();
    }
    cancelModal.classList.remove('active');
    selectedCard = null;
  });

  cancelModal.addEventListener('click', (e) => {
    if (e.target === cancelModal) {
      cancelModal.classList.remove('active');
      selectedCard = null;
    }
  });
});
