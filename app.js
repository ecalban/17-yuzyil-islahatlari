const SULTANS = [
  { id: "ahmet3", key: "1", name: "III. Ahmet", color: "#0f766e" },
  { id: "mahmut1", key: "2", name: "I. Mahmut", color: "#34549a" },
  { id: "mustafa3", key: "3", name: "III. Mustafa", color: "#b86f19" },
  { id: "abdulhamit1", key: "4", name: "I. Abdülhamit", color: "#b4233a" },
  { id: "selim3", key: "5", name: "III. Selim", color: "#177245" },
];

const REFORMS = [
  { id: 1, sultan: "ahmet3", text: "Lale Devri 1718 Pasarofça Antlaşması ile başlamış, 1730 Patrona Halil İsyanı ile sona ermiştir." },
  { id: 2, sultan: "ahmet3", text: "Bu devrin sadrazamı Nevşehirli Damat İbrahim Paşa’dır." },
  { id: 3, sultan: "ahmet3", text: "Minyatürcüsü Levni, şairi Nedim’dir." },
  { id: 4, sultan: "ahmet3", text: "Islahatlarda Avrupa ilk kez örnek alınmıştır." },
  { id: 5, sultan: "ahmet3", text: "Lale Devri’nde askerî ıslahat yapılmamıştır." },
  { id: 6, sultan: "ahmet3", text: "İbrahim Müteferrika ve Sait Efendi tarafından matbaa getirilmiştir." },
  { id: 7, sultan: "ahmet3", text: "Sait Efendi Avrupa’da “Türkoveri” akımını başlatmıştır." },
  { id: 8, sultan: "ahmet3", text: "İlk defa geçici elçilikler Paris, Moskova, Viyana ve Varşova’da açılmıştır." },
  { id: 9, sultan: "ahmet3", text: "28 Mehmet Çelebi, Paris Sefaretnamesi’ni yazmıştır." },
  { id: 10, sultan: "ahmet3", text: "İran’dan çiçek aşısı getirilmiştir." },
  { id: 11, sultan: "ahmet3", text: "Gerçek Davut Ağa’nın katkılarıyla Tulumbacılar Ocağı (İtfaiye) kurulmuştur." },
  { id: 12, sultan: "mahmut1", text: "Ülke içinde kütüphaneler açtırmış ve el yazması eserleri toplatmıştır." },
  { id: 13, sultan: "mahmut1", text: "İlk defa Batı tarzı askerî ıslahatlar yapmıştır." },
  { id: 14, sultan: "mahmut1", text: "İlk defa Batı’dan bir uzman getirmiştir. Bu uzman Comte de Bonneval’dir." },
  { id: 15, sultan: "mahmut1", text: "Batı tarzında ilk teknik okul olan Hendesehane açılmıştır." },
  { id: 16, sultan: "mustafa3", text: "Avrupa’dan Baron de Tott’u getirmiştir." },
  { id: 17, sultan: "mustafa3", text: "Cezayirli Gazi Hasan Paşa tarafından 1773 yılında Tersane Hendesehanesi açılmıştır." },
  { id: 18, sultan: "mustafa3", text: "Esham sistemi uygulamasını getirmiştir." },
  { id: 19, sultan: "abdulhamit1", text: "III. Mustafa Dönemi’nde Osmanlı ülkesine gelen Baron de Tott ıslahat çalışmalarına devam etmiştir." },
  { id: 20, sultan: "abdulhamit1", text: "1775’te Mühendishane-i Bahri Hümayun açılmıştır." },
  { id: 21, sultan: "selim3", text: "Yaptığı tüm ıslahatlara Nizam-ı Cedit adı verilmiştir." },
  { id: 22, sultan: "selim3", text: "Islahatlarında Fransa’yı örnek almıştır." },
  { id: 23, sultan: "selim3", text: "Radikal (sıradışı) yönde ıslahatlar yapan ilk Osmanlı padişahıdır." },
  { id: 24, sultan: "selim3", text: "Dönemi Kabakçı Mustafa İsyanı ile sona ermiştir." },
  { id: 25, sultan: "selim3", text: "İlk kalıcı elçilik açılmıştır." },
  { id: 26, sultan: "selim3", text: "Bilim insanlarından “Lahiya” (rapor) istemiştir." },
  { id: 27, sultan: "selim3", text: "Mühendishane-i Berri (Kara) Hümayun açılmıştır." },
  { id: 28, sultan: "selim3", text: "Fransızca, sadece askerî okullarda zorunlu ilk yabancı resmî dil ilan edilmiştir." },
  { id: 29, sultan: "selim3", text: "Nizam-ı Cedit adıyla yeni bir ordu kurulmuştur." },
  { id: 30, sultan: "selim3", text: "İrad-ı Cedit hazinesi kurulmuştur." },
  { id: 31, sultan: "selim3", text: "Nizam-ı Cedidin ilk ve son başarısı Fransa’ya karşı Akka Kalesi’ni savunmasıdır." },
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
  if (!["1", "2", "3", "4", "5"].includes(event.key)) {
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
