/* =========================
   STATE
========================= */
const state = {
  cars: [],
  filters: {
    search: '',
    categoria: '',
    combustivel: '',
    cambio: '',
    maxPrice: ''
  },
  selectedCar: null
};

/* =========================
   DADOS LOCAIS (ASSETS)
========================= */
const localCars = [
  {
    id: 1,
    nome: "Mini Cooper",
    categoria: "Urbano",
    combustivel: "Gasolina",
    cambio: "Automático",
    lugares: 4,
    preco_diaria: 180,
    destaque: "Popular",
    descricao: "Compacto, moderno e perfeito para a cidade.",
    imagem: "./assets/cars/car_card3.jpg"
  },
  {
    id: 2,
    nome: "Jeep Compass",
    categoria: "SUV",
    combustivel: "Gasolina",
    cambio: "Automático",
    lugares: 5,
    preco_diaria: 250,
    destaque: "Offroad",
    descricao: "Robusto, confortável e ideal para viagens.",
    imagem: "./assets/cars/car_card1.jpg"
  },
  {
    id: 3,
    nome: "BMW X6",
    categoria: "Luxo",
    combustivel: "Gasolina",
    cambio: "Automático",
    lugares: 5,
    preco_diaria: 420,
    destaque: "Luxo",
    descricao: "Alto desempenho e sofisticação premium.",
    imagem: "./assets/cars/car_card4.jpg"
  },
  {
  id: 4,
  nome: "Range Rover Evoque",
  categoria: "SUV",
  combustivel: "Gasolina",
  cambio: "Automático",
  lugares: 5,
  preco_diaria: 380,
  destaque: "Luxo",
  descricao: "SUV premium com design sofisticado, excelente conforto e desempenho urbano e off-road.",
  imagem: "./assets/cars/car_card6.png"
  },
  {
  id: 5,
  nome: "Maserati GranTurismo",
  categoria: "Luxo",
  combustivel: "Gasolina",
  cambio: "Automático",
  lugares: 4,
  preco_diaria: 650,
  destaque: "Exotico",
  descricao: "Esportivo italiano com design marcante, motor potente e luxo refinado.",
  imagem: "./assets/cars/car_card5.png"
  },
  {
  id: 6,
  nome: "McLaren 720S",
  categoria: "Luxo",
  combustivel: "Gasolina",
  cambio: "Automático",
  lugares: 2,
  preco_diaria: 800,
  destaque: "Premium",
  descricao: "Superesportivo britânico com performance extrema, aerodinâmica avançada e exclusividade total.",
  imagem: "./assets/cars/car_card2.jpg"
  }

];

/* =========================
   ELEMENTOS
========================= */
const elements = {
  carList: document.getElementById('car-list'),
  counter: document.getElementById('carsCounterValue'),
  emptyState: document.getElementById('car-empty-state'),
  emptyReset: document.getElementById('emptyReset'),
  toast: document.getElementById('toast'),
  reserveModal: document.getElementById('reserveModal'),
  detailsModal: document.getElementById('detailsModal'),
  filters: {
    search: document.getElementById('filter-search'),
    categoria: document.getElementById('filter-category'),
    combustivel: document.getElementById('filter-fuel'),
    cambio: document.getElementById('filter-transmission'),
    maxPrice: document.getElementById('filter-price')
  },
  clearFilters: document.getElementById('clearFilters'),
  reserveForm: document.getElementById('reserveForm'),
  reserveName: document.getElementById('reserveName'),
  reserveStart: document.getElementById('reserveStart'),
  reserveEnd: document.getElementById('reserveEnd'),
  reserveCarId: document.getElementById('reserveCarId'),
  reserveTitle: document.getElementById('reserveTitle'),
  detailsTitle: document.getElementById('detailsTitle'),
  detailsDescription: document.getElementById('detailsDescription'),
  detailsCategory: document.getElementById('detailsCategory'),
  detailsFuel: document.getElementById('detailsFuel'),
  detailsTransmission: document.getElementById('detailsTransmission'),
  detailsSeats: document.getElementById('detailsSeats')
};

/* =========================
   UTILIDADES
========================= */
const badgeMap = {
  Popular: 'badge-popular',
  Luxo: 'badge-oferta',
  Offroad: 'badge-offroad',
  Urbano: 'badge-urbano',
  Exotico: 'badge-exotico',
  Premium: 'badge-premium'

};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const formatCurrency = (v) => currencyFormatter.format(Number(v) || 0);

/* =========================
   RENDERIZAÇÃO
========================= */
function buildCarCard(car) {
  return `
    <article class="car-card" data-car-id="${car.id}">
      <div class="car-card__image">
        <img src="${car.imagem}" alt="${car.nome}">
        <span class="badge ${badgeMap[car.destaque] || ''}">
          ${car.destaque}
        </span>
      </div>

      <div class="car-card__content">
        <h3 class="car-card__title">${car.nome}</h3>

        <ul class="car-card__info">
          <li><i class="fa-solid fa-user"></i> ${car.lugares}</li>
          <li><i class="fa-solid fa-gas-pump"></i> ${car.combustivel}</li>
          <li><i class="fa-solid fa-car"></i> ${car.categoria}</li>
        </ul>

        <!-- PREÇO CORRIGIDO -->
        <div class="car-card__price">
          <strong>${formatCurrency(car.preco_diaria)}</strong>
          <span>/ dia</span>
        </div>

        <div class="car-card__actions">
          <button class="btn-link" data-action="details">Ver detalhes</button>
          <button class="btn-primary" data-action="reserve">Reservar</button>
        </div>
      </div>
    </article>
  `;
}

elements.reserveForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const userEmail = localStorage.getItem('userEmail');

  if (!userEmail) {
    alert('Faça login novamente.');
    window.location.href = 'login.html';
    return;
  }

  const carId = Number(elements.reserveCarId.value);
  const car = localCars.find(c => c.id === carId);

  if (!car) {
    alert('Carro não encontrado.');
    return;
  }

  const retirada = elements.reserveStart.value;
  const devolucao = elements.reserveEnd.value;

  if (!retirada || !devolucao) {
    alert('Selecione as datas de retirada e devolução.');
    return;
  }

  const STORAGE_KEY = `historico_${userEmail}`;
  const historicoAtual =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  historicoAtual.push({
    id: car.id,
    nome: car.nome,
    categoria: car.categoria,
    combustivel: car.combustivel,
    cambio: car.cambio,
    lugares: car.lugares,
    imagem: car.imagem,
    retirada,      // ✅ NOVO
    devolucao      // ✅ NOVO
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(historicoAtual)
  );

  elements.reserveModal.classList.remove('modal--open');
  alert('Reserva realizada com sucesso!');
});



function renderCars() {
  elements.counter.textContent = state.cars.length;

  if (!state.cars.length) {
    elements.carList.innerHTML = '';
    elements.emptyState.hidden = false;
    return;
  }

  elements.emptyState.hidden = true;
  elements.carList.innerHTML = state.cars.map(buildCarCard).join('');
}

/* =========================
   LOAD + FILTROS
========================= */
function loadCars() {
  let cars = [...localCars];

  if (state.filters.search) {
    const s = state.filters.search.toLowerCase();
    cars = cars.filter(c =>
      c.nome.toLowerCase().includes(s) ||
      c.categoria.toLowerCase().includes(s)
    );
  }

  if (state.filters.categoria)
    cars = cars.filter(c => c.categoria === state.filters.categoria);

  if (state.filters.combustivel)
    cars = cars.filter(c => c.combustivel === state.filters.combustivel);

  if (state.filters.cambio)
    cars = cars.filter(c => c.cambio === state.filters.cambio);

  if (state.filters.maxPrice)
    cars = cars.filter(c => c.preco_diaria <= state.filters.maxPrice);

  state.cars = cars;
  renderCars();
}

/* =========================
   EVENTOS
========================= */
function updateFilters() {
  Object.keys(elements.filters).forEach(key => {
    state.filters[key] = elements.filters[key].value;
  });
  loadCars();
}

function handleCardClick(e) {
  const action = e.target.dataset.action;
  if (!action) return;

  const card = e.target.closest('[data-car-id]');
  const car = state.cars.find(c => c.id == card.dataset.carId);

  if (action === 'details') {
    elements.detailsTitle.textContent = car.nome;
    elements.detailsDescription.textContent = car.descricao;
    elements.detailsCategory.textContent = car.categoria;
    elements.detailsFuel.textContent = car.combustivel;
    elements.detailsTransmission.textContent = car.cambio;
    elements.detailsSeats.textContent = car.lugares;
    elements.detailsModal.classList.add('modal--open');
  }

  if (action === 'reserve') {
    elements.reserveTitle.textContent = car.nome;
    elements.reserveCarId.value = car.id;
    elements.reserveModal.classList.add('modal--open');
  }
}

function wireEvents() {
  Object.values(elements.filters).forEach(el =>
    el.addEventListener('change', updateFilters)
  );

  elements.carList.addEventListener('click', handleCardClick);

  document
    .querySelectorAll('[data-modal-close]')
    .forEach(btn =>
      btn.addEventListener('click', () =>
        btn.closest('.modal').classList.remove('modal--open')
      )
    );
}

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded', () => {
  wireEvents();
  loadCars();
});
