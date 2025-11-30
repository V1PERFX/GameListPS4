document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("grid");

  fetch("data/games.json")
    .then(response => response.json())
    .then(games => {
      games.sort((a, b) => a.id.localeCompare(b.id));
      games.forEach(game => {
        const card = document.createElement("article");
        card.classList.add("card", "fade-in");
        card.dataset.title = game.alt;
        card.dataset.status = game.status;

        const statusText = formatStatus(game.status);

        card.innerHTML = `
          <div class="card-image">
            <img src="${game.image}" alt="${game.alt}" loading="lazy" />
          </div>
          <div class="card-body">
            <div class="card-title">${game.title}</div>
            <div class="card-meta">
              <span class="status-label">
                <span class="status-dot-${game.status}"></span>
                ${statusText}
              </span>
              <span class="card-tag">${game.region}</span>
            </div>
          </div>
        `;

        container.appendChild(card);
      });
      if (typeof applyFilters === "function") {
        applyFilters();
      }
    })
    .catch(err => console.error("Erro ao carregar JSON:", err));
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