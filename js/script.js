// ---------- Busca + Filtros ----------
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const searchWrapper = document.getElementById('searchWrapper');
const filterButtons = Array.from(document.querySelectorAll('.filter-pill'));
const emptyState = document.getElementById('emptyState');

let activeFilter = 'all';

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function applyFilters() {
  const cards = Array.from(document.querySelectorAll('.card'))
  const term = normalizeText(searchInput.value || '');
  const hasTerm = term.length > 0;
  let visibleCount = 0;

  cards.forEach(card => {
    const title = normalizeText(card.dataset.title || '');
    const status = normalizeText(card.dataset.status || '');
    const matchesSearch = !hasTerm || title.includes(term);
    const matchesFilter = activeFilter === 'all' || status.split(' ').includes(activeFilter);

    if (matchesSearch && matchesFilter) {
      card.classList.remove('hidden-card');
      visibleCount++;
    } else {
      card.classList.add('hidden-card');
    }
  });

  emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
}

searchInput.addEventListener('input', () => {
  const hasText = searchInput.value.length > 0;
  searchWrapper.classList.toggle('has-text', hasText);
  applyFilters();
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchWrapper.classList.remove('has-text');
  searchInput.focus();
  applyFilters();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

function formatStatus(status) {
  const map = {
    "jogando": "Jogando",
    "adquirido": "Adquirido",
    "concluido": "Concluído",
    "nao-concluido": "Não Concluído",
    "nao-gostei": "Não Gostei"
  };
  return map[status] || status;
}

// ---------- Lógica do Modal ----------
const modal = document.getElementById('gameModal');
const closeModalBtn = document.getElementById('closeModal');
const modalElements = {
  img: document.getElementById('modalImage'),
  title: document.getElementById('modalTitle'),
  region: document.getElementById('modalRegion'),
  id: document.getElementById('modalId'),
  status: document.getElementById('modalStatusText')
};

// Função global para ser chamada pelo loadgames.js
window.openGameModal = function(game) {
  modalElements.img.src = game.image;
  modalElements.img.alt = game.alt;
  modalElements.title.textContent = game.title;
  modalElements.region.textContent = game.region;
  modalElements.id.textContent = game.id; // Mostrando o ID aqui!
  modalElements.status.innerHTML = `Status: ${formatStatus(game.status)}`; // Reusando função de formatação
  
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Evita rolar a página de trás
};

function closeGameModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Fechar ao clicar no X
closeModalBtn.addEventListener('click', closeGameModal);

// Fechar ao clicar fora (no overlay escuro)
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeGameModal();
});

// Fechar com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) {
    closeGameModal();
  }
});