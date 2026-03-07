import { createCards, isGameComplete, getTopCards } from "../utils/cardsInit";

export const MUTATIONS = {
  SET_DIFFICULTY: "SET_DIFFICULTY",
  SET_LAYERS: "SET_LAYERS",
  START_GAME: "START_GAME",
  FLIP_CARD: "FLIP_CARD",
  SET_CARDS_FACE_UP: "SET_CARDS_FACE_UP",
  SET_PAIR_FOUND: "SET_PAIR_FOUND",
  CLEAR_OPENED_CARDS: "CLEAR_OPENED_CARDS",
  SET_CAN_FLIP: "SET_CAN_FLIP",
  SET_GAME_STATUS: "SET_GAME_STATUS",
  SET_ELAPSED_TIME: "SET_ELAPSED_TIME",
  SET_BEST_SCORES: "SET_BEST_SCORES",
  RESET_GAME: "RESET_GAME",
};

const loadBestScores = () => {
  const defaultScores = {
    10: { 1: null, 3: null, 5: null },
    14: { 1: null, 3: null, 5: null },
    20: { 1: null, 3: null, 5: null },
  };

  try {
    const saved = localStorage.getItem("bestScores");
    return saved ? { ...defaultScores, ...JSON.parse(saved) } : defaultScores;
  } catch {
    return defaultScores;
  }
};

export default {
  namespaced: true,

  state() {
    return {
      cards: [],
      difficulty: 10,
      layers: 1,
      gameStatus: "menu", //menu, playing, finished
      openedCards: [],
      canFlip: true,
      elapsedTime: 0,
      bestScores: loadBestScores(),
    };
  },

  getters: {
    getCards: (state) => state.cards,
    getDifficulty: (state) => state.difficulty,
    getLayers: (state) => state.layers,
    getGameStatus: (state) => state.gameStatus,
    getOpenedCards: (state) => state.openedCards,
    getCanFlip: (state) => state.canFlip,
    getElapsedTime: (state) => state.elapsedTime,
    getBestScores: (state) => state.bestScores,
    isGameFinished: (state) => state.gameStatus === "finished",
    getFormattedTime: (state) => {
      const minutes = Math.floor(state.elapsedTime / 60);
      const seconds = state.elapsedTime % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    },
    currentBestScore: (state) => {
      const difficultyScores = state.bestScores[state.difficulty];
      return difficultyScores ? difficultyScores[state.layers] : null;
    },
    getFormattedBestScore: (state, getters) => {
      const best = getters.currentBestScore;
      if (!best) return "--:--";
      const minutes = Math.floor(best / 60);
      const seconds = best % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    },
    getTopCards: (state) => {
      return getTopCards(state.cards);
    },
    getCardsByPosition: (state) => {
      const cardsByPosition = {};
      state.cards.forEach((card) => {
        if (!cardsByPosition[card.position]) {
          cardsByPosition[card.position] = [];
        }
        cardsByPosition[card.position].push(card);
      });

      Object.keys(cardsByPosition).forEach((position) => {
        cardsByPosition[position].sort((a, b) => a.layer - b.layer);
      });

      return cardsByPosition;
    },
  },

  mutations: {
    [MUTATIONS.SET_DIFFICULTY]: (state, payload) => {
      state.difficulty = payload;
    },

    [MUTATIONS.SET_LAYERS]: (state, payload) => {
      state.layers = payload;
    },

    [MUTATIONS.START_GAME]: (state) => {
      state.cards = createCards(state.difficulty, state.layers);
      state.gameStatus = "playing";
      state.openedCards = [];
      state.canFlip = true;
      state.elapsedTime = 0;
    },

    [MUTATIONS.FLIP_CARD]: (state, payload) => {
      const card = state.cards.find((c) => c.id === payload);
      const topCards = getTopCards(state.cards);
      const isTopCard = topCards.some((c) => c.id === payload);

      if (
        card &&
        !card.isFounded &&
        !card.isFaceUp &&
        state.canFlip &&
        state.openedCards.length < 2 &&
        isTopCard
      ) {
        card.isFaceUp = true;
        state.openedCards.push(card);

        if (state.openedCards.length === 2) {
          state.canFlip = false;
        }
      }
    },

    [MUTATIONS.SET_CARDS_FACE_UP]: (state, payload) => {
      state.cards = state.cards.map((card) => {
        if (payload.cardIds.includes(card.id)) {
          return { ...card, isFaceUp: payload.isFaceUp };
        }
        return card;
      });
    },

    [MUTATIONS.SET_PAIR_FOUND]: (state, payload) => {
      state.cards = state.cards.map((card) => {
        if (payload.includes(card.id)) {
          return { ...card, isFounded: true };
        }
        return card;
      });
    },

    [MUTATIONS.CLEAR_OPENED_CARDS]: (state) => {
      state.openedCards = [];
    },

    [MUTATIONS.SET_CAN_FLIP]: (state, payload) => {
      state.canFlip = payload;
    },

    [MUTATIONS.SET_GAME_STATUS]: (state, payload) => {
      state.gameStatus = payload;
    },

    [MUTATIONS.SET_ELAPSED_TIME]: (state, payload) => {
      state.elapsedTime = payload;
    },

    [MUTATIONS.SET_BEST_SCORES]: (state, payload) => {
      if (!state.bestScores[payload.difficulty]) {
        state.bestScores[payload.difficulty] = { 1: null, 3: null, 5: null };
      }

      const currentBest = state.bestScores[payload.difficulty][payload.layers];
      if (!currentBest || payload.time < currentBest) {
        state.bestScores[payload.difficulty][payload.layers] = payload.time;
        localStorage.setItem("bestScores", JSON.stringify(state.bestScores));
      }
    },

    [MUTATIONS.RESET_GAME]: (state) => {
      state.gameStatus = "menu";
      state.cards = [];
      state.openedCards = [];
      state.canFlip = true;
      state.elapsedTime = 0;
    },
  },

  actions: {
    startGame: (store, payload) => {
      store.commit(MUTATIONS.SET_DIFFICULTY, payload.difficulty);
      store.commit(MUTATIONS.SET_LAYERS, payload.layers);
      store.commit(MUTATIONS.START_GAME);
    },

    flipCard: (store, payload) => {
      return new Promise((resolve) => {
        if (!store.state.canFlip) {
          resolve();
          return;
        }

        const card = store.state.cards.find((c) => c.id === payload);
        const topCards = getTopCards(store.state.cards);
        const isTopCard = topCards.some((c) => c.id === payload);

        if (!card || card.isFounded || card.isFaceUp || !isTopCard) {
          resolve();
          return;
        }

        const flipCount = store.state.openedCards.length;
        store.commit(MUTATIONS.FLIP_CARD, payload);

        if (flipCount === 1 && store.state.openedCards.length === 2) {
          store.dispatch("checkPair").then(() => {
            resolve();
          });
        } else {
          resolve();
        }
      });
    },

    checkPair: (store) => {
      return new Promise((resolve) => {
        store.commit(MUTATIONS.SET_CAN_FLIP, false);

        const [card1, card2] = store.state.openedCards;

        if (card1.pairId === card2.pairId) {
          store.dispatch("handleFoundPair", [card1.id, card2.id]).then(() => {
            resolve();
          });
        } else {
          store
            .dispatch("handleMismatchedPair", [card1.id, card2.id])
            .then(() => {
              resolve();
            });
        }
      });
    },

    handleFoundPair: (store, payload) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          store.commit(MUTATIONS.SET_PAIR_FOUND, payload);
          store.commit(MUTATIONS.CLEAR_OPENED_CARDS);
          store.commit(MUTATIONS.SET_CAN_FLIP, true);

          if (isGameComplete(store.state.cards)) {
            store.commit(MUTATIONS.SET_BEST_SCORES, {
              difficulty: store.state.difficulty,
              layers: store.state.layers,
              time: store.state.elapsedTime,
            });
            store.commit(MUTATIONS.SET_GAME_STATUS, "finished");
          }
          resolve();
        }, 700);
      });
    },

    handleMismatchedPair: (store, payload) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          store.commit(MUTATIONS.SET_CARDS_FACE_UP, {
            cardIds: payload,
            isFaceUp: false,
          });
          store.commit(MUTATIONS.CLEAR_OPENED_CARDS);
          store.commit(MUTATIONS.SET_CAN_FLIP, true);
          resolve();
        }, 1000);
      });
    },

    updateTime: (store, payload) => {
      store.commit(MUTATIONS.SET_ELAPSED_TIME, payload);
    },

    resetGame: (store) => {
      store.commit(MUTATIONS.RESET_GAME);
    },
  },
};
