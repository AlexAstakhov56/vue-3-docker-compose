<template>
  <div
    class="card"
    :class="[
      `card--layer-${card.layer}`,
      {
        'card--founded': card.isFounded,
        'card--top': isTopCard,
        'card--hidden': !isTopCard && !card.isFounded && !card.isFaceUp,
      },
    ]"
    @click="() => handleClick()"
  >
    <div class="card__content">
      <div v-if="card.isFaceUp" class="card__front">
        <img :src="card.image" class="card__image" />
        <p class="card__title">{{ card.title }}</p>
      </div>

      <div v-else class="card__back">
        <span class="card__back-icon">?</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    card: Object,
    isTopCard: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["flip"],
  methods: {
    handleClick() {
      if (!this.card.isFounded && !this.card.isFaceUp && this.isTopCard) {
        this.$emit("flip", this.card.id);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 200px;
  cursor: pointer;
  margin-bottom: -180px;
  transition: all 0.3s;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  &--founded {
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
  }

  &--top {
    z-index: 10;
  }

  &--hidden {
    cursor: default;
    pointer-events: none;
    opacity: 0.9;
  }

  &__content {
    width: 100%;
    height: 100%;
  }

  &__front,
  &__back {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
  }

  &__front {
    background-color: white;
  }

  &__back {
    position: relative;
    background-color: rgb(184, 13, 122);
  }

  &__image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-bottom: 10px;
  }

  &__title {
    font-weight: bold;
    color: black;
    margin: 0;
    text-align: center;
  }

  &__back-icon {
    color: yellow;
    font-size: 80px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
}
</style>
