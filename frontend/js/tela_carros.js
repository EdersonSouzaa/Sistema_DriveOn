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

const badgeMap = {
  Popular: 'badge-popular',
  'Econômico': 'badge-novo',
  Luxo: 'badge-oferta',
  Offroad: 'badge-offroad',
  Urbano: 'badge-urbano',
  Exótico: 'badge-exotico'
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

function buildSkeletonCards() {
  return Array.from({ length: 4 })
    .map(
      () => `
        <article class="car-card car-card--skeleton">
          <div class="car-card__image shimmer"></div>
          <div class="car-card__content">
            <div class="skeleton-line skeleton-line--title"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line skeleton-line--short"></div>
          </div>
        </article>
      `
    )
    .join('');
}

function buildCarCard(car) {
  const badgeClass = badgeMap[car.destaque] ?? 'badge-default';
  const badgeLabel = car.destaque ?? 'Disponível';

  return `
    <article class="car-card" data-car-id="${car.id}">
      <div class="car-card__image">
        <img src="${car.imagem}" alt="${car.nome}" loading="lazy" />
        <span class="badge ${badgeClass}">${badgeLabel}</span>
      </div>
      <div class="car-card__content">
        <header>
          <p class="eyebrow">${car.categoria}</p>
          <h3>${car.nome}</h3>
          <p class="car-card__description">${car.descricao ?? ''}</p>
        </header>

        <ul class="car-card__features">
          <li><i class="fa-regular fa-user" aria-hidden="true"></i> ${car.lugares} lugares</li>
          <li><i class="fa-solid fa-gas-pump" aria-hidden="true"></i> ${car.combustivel}</li>
          <li><i class="fa-solid fa-gears" aria-hidden="true"></i> ${car.cambio}</li>
        </ul>

        <div class="car-card__footer">
          <div>
            <p class="eyebrow">Diária</p>
            <p class="price">${formatCurrency(car.preco_diaria)} <span>/ dia</span></p>
          </div>
          <div class="card-actions">
            <button class="btn-link" data-action="details">Ver detalhes</button>
            <button class="btn-primary" data-action="reserve">Reservar</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

async function loadCars() {
  if (!elements.carList) return;

  elements.carList.innerHTML = buildSkeletonCards();
  elements.emptyState.hidden = true;

  const params = new URLSearchParams();
  if (state.filters.search) params.append('q', state.filters.search);
  if (state.filters.categoria) params.append('categoria', state.filters.categoria);
  if (state.filters.combustivel) params.append('combustivel', state.filters.combustivel);
  if (state.filters.cambio) params.append('cambio', state.filters.cambio);
  if (state.filters.maxPrice) params.append('maxPrice', state.filters.maxPrice);

  const queryString = params.toString();
  const url = queryString ? `http://localhost:8080/api/cars?${queryString}` : 'http://localhost:8080/api/cars';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao consultar carros');
    }

    const cars = await response.json();
    state.cars = cars;
    renderCars();
  } catch (error) {
    console.error(error);
    elements.carList.innerHTML = '';
    showToast('Não foi possível carregar os carros. Tente novamente.', 'error');
  }
}

function renderCars() {
  if (elements.counter) {
    elements.counter.textContent = state.cars.length;
  }

  if (!state.cars.length) {
    elements.carList.innerHTML = '';
    elements.emptyState.hidden = false;
    return;
  }

  elements.emptyState.hidden = true;
  elements.carList.innerHTML = state.cars.map(buildCarCard).join('');
}

function updateFilters() {
  state.filters.search = elements.filters.search.value.trim();
  state.filters.categoria = elements.filters.categoria.value;
  state.filters.combustivel = elements.filters.combustivel.value;
  state.filters.cambio = elements.filters.cambio.value;
  state.filters.maxPrice = elements.filters.maxPrice.value;
  loadCars();
}

function resetFilters() {
  Object.values(elements.filters).forEach((input) => {
    if (input) input.value = '';
  });
  updateFilters();
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('modal--open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('modal--open');
  modal.setAttribute('aria-hidden', 'true');
}

function handleCardClick(event) {
  const action = event.target.dataset.action;
  if (!action) return;

  const card = event.target.closest('[data-car-id]');
  if (!card) return;

  const car = state.cars.find((item) => String(item.id) === card.dataset.carId);
  if (!car) return;

  if (action === 'details') {
    openDetails(car);
  }

  if (action === 'reserve') {
    openReserve(car);
  }
}

function openDetails(car) {
  elements.detailsTitle.textContent = car.nome;
  elements.detailsDescription.textContent = car.descricao ?? '';
  elements.detailsCategory.textContent = car.categoria;
  elements.detailsFuel.textContent = car.combustivel;
  elements.detailsTransmission.textContent = car.cambio;
  elements.detailsSeats.textContent = car.lugares;
  openModal(elements.detailsModal);
}

function openReserve(car) {
  state.selectedCar = car;
  const today = new Date().toISOString().split('T')[0];
  elements.reserveForm.reset();
  elements.reserveStart.min = today;
  elements.reserveEnd.min = today;
  elements.reserveCarId.value = car.id;
  elements.reserveTitle.textContent = car.nome;
  openModal(elements.reserveModal);
}

async function submitReserve(event) {
  event.preventDefault();
  const carId = elements.reserveCarId.value;
  if (!carId) return;

  const payload = {
    cliente_nome: elements.reserveName.value.trim(),
    data_inicio: elements.reserveStart.value,
    data_fim: elements.reserveEnd.value
  };

  if (!payload.cliente_nome) {
    showToast('Informe o nome completo para continuar.', 'error');
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/cars/${carId}/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Erro ao reservar');
    }

    showToast('Reserva realizada com sucesso!', 'success');
    closeModal(elements.reserveModal);
    await loadCars();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function wireModalClose() {
  document.querySelectorAll('[data-modal-close]').forEach((button) => {
    button.addEventListener('click', () => closeModal(button.closest('.modal')));
  });

  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });
}

function showToast(message, type = 'info') {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.className = `toast toast--${type}`;
  elements.toast.classList.add('toast--visible');

  setTimeout(() => {
    elements.toast.classList.remove('toast--visible');
  }, 3200);
}

function wireFilters() {
  Object.values(elements.filters).forEach((input) => {
    if (!input) return;
    input.addEventListener('change', updateFilters);
    if (input.tagName === 'INPUT') {
      input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
          updateFilters();
        }
      });
    }
  });

  elements.clearFilters?.addEventListener('click', resetFilters);
  elements.emptyReset?.addEventListener('click', resetFilters);
}

function wireCardEvents() {
  elements.carList?.addEventListener('click', handleCardClick);
}

function wireReserveForm() {
  elements.reserveForm?.addEventListener('submit', submitReserve);
}

function wireAuthButtons() {
  const logoutButton = document.querySelector('.botao_deslogar');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('userName');
      window.location.href = 'login.html';
    });
  }

  const carrosButton = document.getElementById('btn-carros');
  if (carrosButton) {
    carrosButton.classList.add('nav-active');
  }
}

function init() {
  wireFilters();
  wireCardEvents();
  wireReserveForm();
  wireModalClose();
  wireAuthButtons();
  loadCars();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
