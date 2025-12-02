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
