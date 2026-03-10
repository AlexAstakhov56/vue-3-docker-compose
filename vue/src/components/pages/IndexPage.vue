<template>
  <div class="menu">
    <div class="menu__container">
      <h1 class="menu__title">Найди пару</h1>
      <p class="menu__message">Выполнил Астахов Алексей</p>

      <div class="menu__section">
        <h2 class="menu__section-title">Количество карт:</h2>
        <div class="menu__buttons">
          <button
            v-for="option in difficultyOptions"
            :key="option.value"
            class="menu__btn"
            :class="{
              'menu__btn--active': selectedDifficulty === option.value,
            }"
            @click="() => (selectedDifficulty = option.value)"
          >
            {{ option.label }} ({{ option.value }} карт)
          </button>
        </div>
      </div>

      <div class="menu__section">
        <h2 class="menu__section-title">Количество слоёв:</h2>
        <div class="menu__buttons">
          <button
            v-for="option in layersOptions"
            :key="option.value"
            class="menu__btn"
            :class="{
              'menu__btn--active': selectedLayers === option.value,
            }"
            @click="() => (selectedLayers = option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <button class="menu__start-btn" @click="() => handleStartGame()">
        Начать игру
      </button>

      <div class="menu__scores">
        <h2 class="menu__scores-title">Текущие рекорды:</h2>
        <div class="menu__scores-table">
          <div class="menu__scores-row menu__scores-row--header">
            <div class="menu__scores-cell">Сложность</div>
            <div
              v-for="layer in layersOptions"
              :key="layer.value"
              class="menu__scores-cell"
            >
              {{ layer.label }}
            </div>
          </div>

          <div
            v-for="difficulty in difficultyOptions"
            :key="difficulty.value"
            class="menu__scores-row"
          >
            <div class="menu__scores-cell menu__scores-cell--difficulty">
              {{ difficulty.label }}
            </div>
            <div
              v-for="layer in layersOptions"
              :key="layer.value"
              class="menu__scores-cell"
            >
              {{ getScore(difficulty.value, layer.value) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "IndexPage",

  data() {
    return {
      difficultyOptions: [
        { label: "Легкий", value: 10 },
        { label: "Средний", value: 14 },
        { label: "Сложный", value: 20 },
      ],
      layersOptions: [
        { label: "1 слой", value: 1 },
        { label: "3 слоя", value: 3 },
        { label: "5 слоёв", value: 5 },
      ],
      selectedDifficulty: 10,
      selectedLayers: 1,
    };
  },

  computed: {
    ...mapGetters("cards", ["getBestScores"]),
  },

  methods: {
    ...mapActions("cards", ["startGame"]),

    handleStartGame() {
      this.startGame({
        difficulty: this.selectedDifficulty,
        layers: this.selectedLayers,
      });
      this.$router.push("/game");
    },

    formatScores(seconds) {
      if (!seconds) return "--:--";
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    },

    getScore(difficulty, layer) {
      const score = this.getBestScores[difficulty]?.[layer];
      return this.formatScores(score);
    },
  },
};
</script>

<style lang="scss" scoped>
.menu {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    90deg,
    rgba(42, 123, 155, 1) 0%,
    rgba(87, 199, 133, 1) 50%,
    rgba(237, 221, 83, 1) 100%
  );

  &__container {
    max-width: 500px;
    width: 100%;
    padding: 25px 30px;
    margin: 20px 0;
    background-color: white;
    border-radius: 20px;
    text-align: center;
  }

  &__title {
    font-size: 48px;
    color: black;
    margin-bottom: 0;
  }

  &__message {
    font-size: 25px;
    color: #2e2d2d;
    margin-top: 15px;
    margin-bottom: 20px;
  }

  &__section {
    margin-bottom: 30px;
  }

  &__section-title {
    font-size: 22px;
    color: #4f4d4d;
    margin-bottom: 20px;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__btn {
    padding: 15px 20px;
    font-size: 16px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    background-color: white;
    color: #494545;
    cursor: pointer;

    &:hover {
      border-color: rgb(184, 13, 122);
    }
  }

  &__btn--active {
    border-color: rgb(184, 13, 122);
    background-color: rgb(184, 13, 122);
    color: white;
  }

  &__start-btn {
    width: 100%;
    padding: 18px;
    font-size: 20px;
    font-weight: bold;
    background-color: #3db828;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
  }

  &__scores {
    margin-top: 30px;
    padding: 15px;
    background: #bcbdbe;
    border-radius: 10px;
  }

  &__scores-title {
    margin-top: 0;
    font-size: 22px;
    color: black;
    font-weight: bold;
    margin-bottom: 10px;
  }

  &__scores-table {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__scores-row {
    display: grid;
    grid-template-columns: 1fr repeat(3, 1fr);
    gap: 10px;
    align-items: center;

    &--header {
      font-weight: bold;
      color: #666;
      border-bottom: 2px solid #ddd;
      padding-bottom: 10px;
    }
  }

  &__scores-cell {
    padding: 8px;
    text-align: center;
    font-size: 16px;

    &--difficulty {
      font-weight: 600;
      color: #444;
      text-align: left;
    }
  }
}
</style>
