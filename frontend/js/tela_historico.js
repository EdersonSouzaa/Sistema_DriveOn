document.addEventListener('DOMContentLoaded', () => {
  const carList = document.getElementById('car-list');
  const emptyState = document.getElementById('car-empty-state');

  const cancelModal = document.getElementById('cancelModal');
  const cancelCarName = document.getElementById('cancelCarName');
  const cancelNo = document.getElementById('cancelNo');
  const cancelYes = document.getElementById('cancelYes');

  let selectedCard = null;

  // 🔐 USUÁRIO LOGADO
  const userEmail = localStorage.getItem('userEmail');

  if (!userEmail) {
    alert('Faça login novamente.');
    window.location.href = 'login.html';
    return;
  }

  // 🔑 CHAVE DO HISTÓRICO
  const STORAGE_KEY = `historico_${userEmail}`;

  // 📦 BUSCA HISTÓRICO (OU ARRAY VAZIO)
  let cars = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}


 document.querySelector('.botao_deslogar').addEventListener('click', () => {
                localStorage.removeItem('userName');
                window.location.href = 'login.html';
 });


  // ===== RENDER =====
  function renderCars() {
    if (!cars.length) {
      carList.innerHTML = '';
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    carList.innerHTML = cars.map((car, index) => `
  <article class="car-card" data-index="${index}">
    <div class="car-card__image">
      <img src="${car.imagem}" alt="${car.nome}">
    </div>

    <div class="car-card__content">
      <h3 class="car-card__title">${car.nome}</h3>

      <!-- 📅 DATAS -->
      <p class="car-card__dates">
        <strong>Retirada:</strong> ${formatDate(car.retirada)} <br>
        <strong>Devolução:</strong> ${formatDate(car.devolucao)}
      </p>

      <ul class="car-card__info">
        <li><i class="fa-solid fa-user"></i> ${car.lugares}</li>
        <li><i class="fa-solid fa-gas-pump"></i> ${car.combustivel}</li>
        <li><i class="fa-solid fa-car"></i> ${car.categoria}</li>
      </ul>

      <div class="car-card__footer">
        <button class="btn-primary1">Cancelar</button>
      </div>
    </div>
  </article>
`).join('');

  }

  renderCars();

  // ===== CANCELAR =====
  carList.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn-primary1')) return;

    selectedCard = e.target.closest('.car-card');
    const index = selectedCard.dataset.index;

    cancelCarName.textContent =
      selectedCard.querySelector('.car-card__title').textContent;

    cancelModal.classList.add('active');

    cancelYes.onclick = () => {
  // remove o carro do histórico
  cars.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));

  // 🔥 ZERA O TOTAL GASTO
  localStorage.setItem('totalGasto', 0);

  cancelModal.classList.remove('active');
  renderCars();
};

function recalcularTotalGasto(cars) {
  let total = 0;

  cars.forEach(car => {
    // ⚠️ ajuste se o nome da propriedade for diferente
    total += Number(car.preco_diaria || 0);
  });

  localStorage.setItem('totalGasto', total);
}


  });

  cancelNo.addEventListener('click', () => {
    cancelModal.classList.remove('active');
    selectedCard = null;
  });
});
  