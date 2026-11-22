const CONCEPTS = [
  {
    id: 1,
    component: "CPU",
    clue: "Cérebro do computador que busca, decodifica e executa instruções de programas."
  },
  {
    id: 2,
    component: "ULA",
    clue: "Circuito interno do processador que realiza cálculos matemáticos e comparações lógicas."
  },
  {
    id: 3,
    component: "UC",
    clue: "Coordena o fluxo de dados e gera sinais que orquestram o processador."
  },
  {
    id: 4,
    component: "REGISTRADORES",
    clue: "Memórias ultrarrápidas dentro do processador que guardam dados e instruções em execução."
  },
  {
    id: 5,
    component: "RAM",
    clue: "Memória principal volátil usada para armazenar programas e dados ativos temporariamente."
  },
  {
    id: 6,
    component: "ROM",
    clue: "Memória somente de leitura que mantém instruções permanentes mesmo sem energia."
  },
  {
    id: 7,
    component: "EEPROM",
    clue: "Memória não volátil que pode ser apagada e regravada por sinais elétricos."
  },
  {
    id: 8,
    component: "FLASH",
    clue: "Armazenamento não volátil rápido usado em pendrives, cartões e SSDs modernos."
  },
  {
    id: 9,
    component: "CACHE",
    clue: "Memória intermediária veloz que guarda dados frequentes para acelerar o acesso do processador."
  },
  {
    id: 10,
    component: "MEMORIADEMASSA",
    clue: "Armazenamento secundário de alta capacidade para guardar arquivos de forma permanente."
  },
  {
    id: 11,
    component: "DMA",
    clue: "Permite que periféricos transfiram dados direto com a memória sem ocupar o processador."
  },
  {
    id: 12,
    component: "ADDRESSBUS",
    clue: "Via unidirecional que transporta a localização exata da memória a ser acessada."
  },
  {
    id: 13,
    component: "DATABUS",
    clue: "Via bidirecional responsável por transportar informações entre processador, memória e periféricos."
  },
  {
    id: 14,
    component: "MICROCONTROLADOR",
    clue: "Chip único que integra processador, memória e periféricos para sistemas embarcados."
  },
  {
    id: 15,
    component: "DUALCORE",
    clue: "Arquitetura de processador equipada com dois núcleos físicos independentes de execução."
  },
  {
    id: 16,
    component: "QUADCORE",
    clue: "Arquitetura de processador equipada com quatro núcleos físicos independentes de execução."
  }
];

const SHORTCUT_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G"];

const state = {
  deck: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  answeredCurrent: false,
  mistakes: []
};

const els = {
  packetCounter: document.getElementById("packet-counter"),
  scoreCounter: document.getElementById("score-counter"),
  streakCounter: document.getElementById("streak-counter"),
  packetId: document.getElementById("packet-id"),
  clueText: document.getElementById("clue-text"),
  statusBox: document.getElementById("status-box"),
  chipsGrid: document.getElementById("chips-grid"),
  nextBtn: document.getElementById("next-btn"),
  restartBtn: document.getElementById("restart-btn"),
  playAgainBtn: document.getElementById("play-again-btn"),
  gameView: document.getElementById("game-view"),
  summaryView: document.getElementById("summary-view"),
  finalScore: document.getElementById("final-score"),
  finalAccuracy: document.getElementById("final-accuracy"),
  finalStreak: document.getElementById("final-streak"),
  reviewList: document.getElementById("review-list"),
  glossaryBtn: document.getElementById("glossary-btn"),
  glossaryModal: document.getElementById("glossary-modal"),
  closeModalBtn: document.getElementById("close-modal-btn"),
  glossaryList: document.getElementById("glossary-list")
};

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTwoDigits(num) {
  return String(num).padStart(2, "0");
}

function renderChips() {
  els.chipsGrid.innerHTML = "";
  const orderedComponents = CONCEPTS.map((item) => item.component);

  orderedComponents.forEach((componentName, index) => {
    const keyLabel = SHORTCUT_KEYS[index] || "";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip-btn";
    button.dataset.component = componentName;
    button.dataset.shortcut = keyLabel.toLowerCase();

    button.innerHTML = `
      <span class="chip-name">${componentName}</span>
      <span class="chip-key">[${keyLabel}]</span>
    `;

    button.addEventListener("click", () => handleRouteChoice(componentName));
    els.chipsGrid.appendChild(button);
  });
}

function updateTelemetry() {
  const total = state.deck.length;
  const shownStep = Math.min(state.currentIndex + 1, total);
  els.packetCounter.textContent = `${formatTwoDigits(shownStep)}/${formatTwoDigits(total)}`;
  els.scoreCounter.textContent = String(state.score);
  els.streakCounter.textContent = String(state.streak);
}

function renderCurrentPacket() {
  state.answeredCurrent = false;
  els.nextBtn.classList.add("hidden");

  if (state.currentIndex >= state.deck.length) {
    showSummary();
    return;
  }

  const currentItem = state.deck[state.currentIndex];
  updateTelemetry();

  els.packetId.textContent = `SIG-${formatTwoDigits(currentItem.id)}`;
  els.clueText.textContent = currentItem.clue;
  els.statusBox.className = "status-box status-idle";
  els.statusBox.textContent = "AGUARDANDO ROTEAMENTO PARA UM COMPONENTE DA PLACA...";

  const chipButtons = els.chipsGrid.querySelectorAll(".chip-btn");
  chipButtons.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("chip-correct", "chip-wrong");
  });
}

function handleRouteChoice(selectedComponent) {
  if (state.answeredCurrent) return;

  state.answeredCurrent = true;
  const currentItem = state.deck[state.currentIndex];
  const isCorrect = selectedComponent === currentItem.component;
  const chipButtons = els.chipsGrid.querySelectorAll(".chip-btn");

  chipButtons.forEach((btn) => {
    btn.disabled = true;
    const comp = btn.dataset.component;
    if (comp === currentItem.component) {
      btn.classList.add("chip-correct");
    } else if (comp === selectedComponent && !isCorrect) {
      btn.classList.add("chip-wrong");
    }
  });

  if (isCorrect) {
    state.score += 1;
    state.streak += 1;
    if (state.streak > state.bestStreak) {
      state.bestStreak = state.streak;
    }
    els.statusBox.className = "status-box status-correct";
    els.statusBox.textContent = `SINAL ROTEADO COM SUCESSO -> ${currentItem.component}: ${currentItem.clue} Clique em PRÓXIMO SINAL >> para continuar.`;
  } else {
    state.streak = 0;
    state.mistakes.push({
      component: currentItem.component,
      chosen: selectedComponent,
      clue: currentItem.clue
    });
    els.statusBox.className = "status-box status-wrong";
    els.statusBox.textContent = `FALHA DE ROTEAMENTO (você enviou para ${selectedComponent}). Destino correto: ${currentItem.component} — ${currentItem.clue} Clique em PRÓXIMO SINAL >> para continuar.`;
  }

  updateTelemetry();
  els.nextBtn.classList.remove("hidden");
}

function advancePacket() {
  state.currentIndex += 1;
  renderCurrentPacket();
}

function showSummary() {
  els.gameView.classList.add("hidden");
  els.summaryView.classList.remove("hidden");

  const total = state.deck.length;
  const accuracy = total > 0 ? Math.round((state.score / total) * 100) : 0;

  els.finalScore.textContent = `${state.score} / ${total}`;
  els.finalAccuracy.textContent = `${accuracy}%`;
  els.finalStreak.textContent = String(state.bestStreak);

  els.reviewList.innerHTML = "";
  if (state.mistakes.length === 0) {
    els.reviewList.innerHTML = `
      <div class="glossary-item">
        <strong>DIAGNÓSTICO PERFEITO:</strong> Todos os 16 conceitos foram roteados sem falhas neste ciclo.
      </div>
    `;
  } else {
    state.mistakes.forEach((item) => {
      const card = document.createElement("div");
      card.className = "review-item";
      card.innerHTML = `
        <strong>${item.component}</strong> (escolhido: ${item.chosen})<br />
        <span>${item.clue}</span>
      `;
      els.reviewList.appendChild(card);
    });
  }
}

function startNewGame() {
  state.deck = shuffleArray(CONCEPTS);
  state.currentIndex = 0;
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.answeredCurrent = false;
  state.mistakes = [];

  els.summaryView.classList.add("hidden");
  els.gameView.classList.remove("hidden");
  renderCurrentPacket();
}

function renderGlossary() {
  els.glossaryList.innerHTML = "";
  CONCEPTS.forEach((item) => {
    const entry = document.createElement("div");
    entry.className = "glossary-item";
    entry.innerHTML = `<strong>${item.component}:</strong> ${item.clue}`;
    els.glossaryList.appendChild(entry);
  });
}

function handleKeyboardShortcuts(event) {
  if (els.glossaryModal.open) return;
  if (els.summaryView && !els.summaryView.classList.contains("hidden")) return;

  const pressed = event.key.toLowerCase();
  if (pressed === "enter" && state.answeredCurrent) {
    advancePacket();
    return;
  }

  if (state.answeredCurrent) return;

  const targetButton = els.chipsGrid.querySelector(`.chip-btn[data-shortcut="${pressed}"]`);
  if (targetButton && !targetButton.disabled) {
    handleRouteChoice(targetButton.dataset.component);
  }
}

els.nextBtn.addEventListener("click", advancePacket);
els.restartBtn.addEventListener("click", startNewGame);
els.playAgainBtn.addEventListener("click", startNewGame);

els.glossaryBtn.addEventListener("click", () => {
  renderGlossary();
  if (typeof els.glossaryModal.showModal === "function") {
    els.glossaryModal.showModal();
  }
});

els.closeModalBtn.addEventListener("click", () => {
  els.glossaryModal.close();
});

document.addEventListener("keydown", handleKeyboardShortcuts);

renderChips();
startNewGame();