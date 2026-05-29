const SULTANS = [
  { id: "tarhuncu", key: "1", name: "Tarhuncu Ahmet Paşa", color: "#0f766e" },
  { id: "genc-osman", key: "2", name: "Genç Osman", color: "#34549a" },
  { id: "kuyucu", key: "3", name: "Kuyucu Murat Paşa", color: "#b86f19" },
  { id: "murat4", key: "4", name: "IV. Murat", color: "#b4233a" },
  { id: "ahmet1", key: "5", name: "I. Ahmet", color: "#177245" },
  { id: "koprululer", key: "6", name: "Köprülüler Dönemi", color: "#6f3f94" },
];

const REFORMS = [
  { id: 1, sultan: "tarhuncu", text: "“Tarhuncu Bütçesi” adında modern ve denk bütçe hazırlamıştır." },
  { id: 2, sultan: "tarhuncu", text: "İsrafı önleyip maliyeyi düzeltmiştir." },
  { id: 3, sultan: "genc-osman", text: "Osmanlı tarihinde ilk ıslahat yapan padişahtır." },
  { id: 4, sultan: "genc-osman", text: "Yeniçeri Ocağını kaldırmayı ve başkenti İstanbul’dan Anadolu’ya taşımayı düşünmüştür." },
  { id: 5, sultan: "genc-osman", text: "Çıkar çevreleri ve yeniçeriler tarafından Yedikule zindanlarında idam edilmiştir." },
  { id: 6, sultan: "kuyucu", text: "Celâli İsyanlarını şiddetle bastırmıştır." },
  { id: 7, sultan: "murat4", text: "Lakabı Bağdat Fatihi’dir. Saray kadınlarını devlet yönetiminden uzaklaştırmıştır." },
  { id: 8, sultan: "murat4", text: "İlk defa gece sokağa çıkma yasağı, içki ve tütün yasağı getirmiştir." },
  { id: 9, sultan: "murat4", text: "Kanuni Sultan Süleyman zamanında açılan kahveleri ve meyhaneleri kapatmıştır." },
  { id: 10, sultan: "murat4", text: "Yasakların temel sebebi İstanbul’da ortaya çıkan yangınların önüne geçmektir." },
  { id: 11, sultan: "murat4", text: "IV. Murat döneminde Evliya Çelebi, Kâtip Çelebi, Nefi, Şeyhülislam Yahya, Veysi, Koçi Bey ve Azmizade Haleti gibi önemli şahsiyetler yaşamıştır." },
  { id: 12, sultan: "ahmet1", text: "Ekber ve Erşed Sistemi’ni getirmiştir." },
  { id: 13, sultan: "ahmet1", text: "III. Mehmet sancağa çıkma uygulamasını kaldırmıştır." },
  { id: 14, sultan: "koprululer", text: "Köprülü Mehmet Paşa, saraya şartlar öne sürerek sadrazam olmuştur." },
  { id: 15, sultan: "koprululer", text: "Merzifonlu Kara Mustafa Paşa, II. Viyana Kuşatması’ndaki başarısızlığından dolayı idam edilmiştir." },
];

const state = {
  remaining: [],
  currentId: null,
  selectedId: null,
  placed: new Map(),
  checked: false,
};

const els = {
  columns: document.querySelector("#columns"),
  choiceBar: document.querySelector("#choiceBar"),
  currentCardSlot: document.querySelector("#currentCardSlot"),
  drawButton: document.querySelector("#drawButton"),
  finishButton: document.querySelector("#finishButton"),
  resetButton: document.querySelector("#resetButton"),
  placedCount: document.querySelector("#placedCount"),
  totalCount: document.querySelector("#totalCount"),
  statusText: document.querySelector("#statusText"),
  resultsPanel: document.querySelector("#resultsPanel"),
};

const reformById = new Map(REFORMS.map((reform) => [reform.id, reform]));
const sultanById = new Map(SULTANS.map((sultan) => [sultan.id, sultan]));

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function getExpectedCount(sultanId) {
  return REFORMS.filter((reform) => reform.sultan === sultanId).length;
}

function createColumn(sultan) {
  const column = document.createElement("article");
  column.className = "sultan-column";
  column.style.setProperty("--column-color", sultan.color);

  const title = document.createElement("div");
  title.className = "column-title";

  const heading = document.createElement("div");
  heading.className = "sultan-heading";

  const key = document.createElement("span");
  key.className = "key-badge";
  key.textContent = sultan.key;

  const name = document.createElement("h2");
  name.textContent = sultan.name;

  const count = document.createElement("span");
  count.className = "column-count";
  count.textContent = "0";
  count.dataset.countFor = sultan.id;

  heading.append(key, name);
  title.append(heading, count);

  const zone = document.createElement("div");
  zone.className = "drop-zone";
  zone.dataset.sultan = sultan.id;

  column.addEventListener("click", (event) => {
    if (event.target.closest(".reform-card")) {
      return;
    }
    assignSelectedToSultan(sultan.id);
  });

  column.append(title, zone);
  return column;
}

function createChoiceButton(sultan) {
  const button = document.createElement("button");
  button.className = "choice-button";
  button.type = "button";
  button.dataset.sultan = sultan.id;
  button.style.setProperty("--choice-color", sultan.color);

  const key = document.createElement("span");
  key.className = "choice-key";
  key.textContent = sultan.key;

  const label = document.createElement("span");
  label.textContent = sultan.name;

  button.append(key, label);
  button.addEventListener("click", () => assignSelectedToSultan(sultan.id));
  return button;
}

function createCard(reform) {
  const card = document.createElement("div");
  card.className = "reform-card";
  card.dataset.id = String(reform.id);
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", reform.text);
  card.setAttribute("aria-pressed", "false");

  const text = document.createElement("p");
  text.className = "reform-text";
  text.textContent = reform.text;

  card.append(text);
  card.addEventListener("click", (event) => {
    event.stopPropagation();
    selectCard(card);
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectCard(card);
    }
  });
  return card;
}

function renderColumns() {
  els.columns.innerHTML = "";
  SULTANS.forEach((sultan) => els.columns.append(createColumn(sultan)));
}

function renderChoices() {
  els.choiceBar.innerHTML = "";
  SULTANS.forEach((sultan) => els.choiceBar.append(createChoiceButton(sultan)));
}

function setCurrentEmpty() {
  els.currentCardSlot.innerHTML = '<p class="empty-state">Kart bekliyor</p>';
}

function drawReform() {
  if (state.currentId !== null || state.remaining.length === 0 || state.checked) {
    return;
  }

  const nextId = state.remaining.pop();
  state.currentId = nextId;
  els.currentCardSlot.innerHTML = "";
  const card = createCard(reformById.get(nextId));
  els.currentCardSlot.append(card);
  selectCard(card, { preventScroll: true });
  updateUi();
}

function selectCard(card, options = {}) {
  if (state.checked) {
    return;
  }

  document.querySelectorAll(".reform-card.is-selected").forEach((selectedCard) => {
    selectedCard.classList.remove("is-selected");
    selectedCard.setAttribute("aria-pressed", "false");
  });

  card.classList.add("is-selected");
  card.setAttribute("aria-pressed", "true");
  state.selectedId = Number(card.dataset.id);
  card.focus({ preventScroll: Boolean(options.preventScroll) });
  updateUi();
}

function getSelectedCard() {
  const selectedId = state.selectedId ?? state.currentId;
  if (selectedId === null) {
    return null;
  }
  return document.querySelector(`.reform-card[data-id="${selectedId}"]`);
}

function assignSelectedToSultan(sultanId) {
  if (state.checked) {
    return;
  }

  const card = getSelectedCard();
  const zone = document.querySelector(`.drop-zone[data-sultan="${sultanId}"]`);
  if (!card || !zone) {
    return;
  }

  moveCard(card, zone);
}

function moveCard(card, zone) {
  const id = Number(card.dataset.id);
  const previousZone = card.closest(".drop-zone");
  const wasCurrentCard = state.currentId === id;

  removeResultNote(card);
  card.classList.remove("correct", "wrong", "is-selected");
  card.setAttribute("aria-pressed", "false");
  zone.append(card);
  state.placed.set(id, zone.dataset.sultan);
  state.selectedId = null;

  if (wasCurrentCard) {
    state.currentId = null;
    setCurrentEmpty();
  }

  if (wasCurrentCard && state.remaining.length > 0 && !state.checked) {
    drawReform();
    return;
  }

  if (previousZone !== zone) {
    updateUi();
  }
}

function updateColumnCounts() {
  SULTANS.forEach((sultan) => {
    const count = document.querySelector(`[data-count-for="${sultan.id}"]`);
    if (!count) {
      return;
    }

    const placedCount = document.querySelectorAll(`.drop-zone[data-sultan="${sultan.id}"] .reform-card`).length;
    count.textContent = String(placedCount);
    count.title = `${placedCount} / ${getExpectedCount(sultan.id)}`;
  });
}

function updateUi() {
  const placedCount = state.placed.size;
  const totalCount = REFORMS.length;
  const allPlaced = placedCount === totalCount && state.currentId === null;

  els.placedCount.textContent = String(placedCount);
  els.totalCount.textContent = String(totalCount);
  els.drawButton.disabled = state.currentId !== null || state.remaining.length === 0 || state.checked;
  els.finishButton.disabled = !allPlaced || state.checked;

  const hasAssignableCard = (state.selectedId !== null || state.currentId !== null) && !state.checked;
  els.choiceBar.querySelectorAll(".choice-button").forEach((button) => {
    button.disabled = !hasAssignableCard;
  });

  updateColumnCounts();

  if (state.checked) {
    els.statusText.textContent = "Sonuçlar işaretlendi.";
  } else if (allPlaced) {
    els.statusText.textContent = "Tüm ıslahatlar yerleştirildi.";
  } else if (state.selectedId !== null) {
    els.statusText.textContent = "Kart seçili.";
  } else if (state.currentId !== null) {
    els.statusText.textContent = "Kart hazır.";
  } else {
    els.statusText.textContent = `${state.remaining.length} ıslahat kaldı.`;
  }
}

function removeResultNote(card) {
  card.querySelector(".result-note")?.remove();
}

function finishRound() {
  if (state.placed.size !== REFORMS.length || state.currentId !== null) {
    updateUi();
    return;
  }

  let correctCount = 0;
  const perSultan = new Map(SULTANS.map((sultan) => [sultan.id, { correct: 0, total: 0 }]));
  state.selectedId = null;

  document.querySelectorAll(".drop-zone .reform-card").forEach((card) => {
    const reform = reformById.get(Number(card.dataset.id));
    const chosenSultan = card.closest(".drop-zone").dataset.sultan;
    const expectedSultan = reform.sultan;
    const stat = perSultan.get(expectedSultan);
    const isCorrect = chosenSultan === expectedSultan;

    stat.total += 1;
    card.classList.remove("is-selected");
    card.setAttribute("aria-pressed", "false");
    card.classList.add(isCorrect ? "correct" : "wrong");
    removeResultNote(card);

    const note = document.createElement("div");
    note.className = "result-note";
    note.textContent = isCorrect ? "Doğru" : `Cevap: ${sultanById.get(expectedSultan).name}`;
    card.append(note);

    if (isCorrect) {
      correctCount += 1;
      stat.correct += 1;
    }
  });

  state.checked = true;
  renderResults(correctCount, perSultan);
  updateUi();
}

function renderResults(correctCount, perSultan) {
  const totalCount = REFORMS.length;
  const stats = SULTANS.map((sultan) => {
    const stat = perSultan.get(sultan.id);
    return `
      <div class="result-stat">
        <strong>${sultan.name}</strong>
        <span>${stat.correct} / ${stat.total}</span>
      </div>
    `;
  }).join("");

  els.resultsPanel.hidden = false;
  els.resultsPanel.innerHTML = `
    <h2>Sonuç: ${correctCount} / ${totalCount}</h2>
    <div class="results-grid">${stats}</div>
  `;
}

function resetRound() {
  state.remaining = shuffle(REFORMS.map((reform) => reform.id));
  state.currentId = null;
  state.selectedId = null;
  state.placed.clear();
  state.checked = false;
  els.resultsPanel.hidden = true;
  els.resultsPanel.innerHTML = "";
  renderColumns();
  renderChoices();
  setCurrentEmpty();
  updateUi();
}

function handleKeyboardAssign(event) {
  if (!["1", "2", "3", "4", "5", "6"].includes(event.key)) {
    return;
  }

  const sultan = SULTANS.find((item) => item.key === event.key);
  if (!sultan) {
    return;
  }

  event.preventDefault();
  assignSelectedToSultan(sultan.id);
}

els.drawButton.addEventListener("click", drawReform);
els.finishButton.addEventListener("click", finishRound);
els.resetButton.addEventListener("click", resetRound);
document.addEventListener("keydown", handleKeyboardAssign);

resetRound();
