import colaImg from "../assets/cola_icon.png";
import coffeeImg from "../assets/coffee_icon.png";
import cupcakeImg from "../assets/cupcake_icon.png";
import friesImg from "../assets/fries_icon.png";
import icecreamImg from "../assets/icecream_icon.png";
import pizzaImg from "../assets/pizza_icon.png";
import pumpkinImg from "../assets/pumpkin_icon.png";
import steakImg from "../assets/steak_icon.png";
import sushiImg from "../assets/sushi_icon.png";
import tacoImg from "../assets/taco_icon.png";
import appleImg from "../assets/apple_icon.png";
import broccoliImg from "../assets/broccoli_icon.png";
import bubbleImg from "../assets/bubble_icon.png";
import cakeImg from "../assets/cake_icon.png";
import cake2Img from "../assets/cake2_icon.png";
import cherryImg from "../assets/cherry_icon.png";
import chickenImg from "../assets/chicken_icon.png";
import coffee2Img from "../assets/coffee2_icon.png";
import cookieImg from "../assets/cookie_icon.png";
import croissantImg from "../assets/croissant_icon.png";
import donutImg from "../assets/donut_icon.png";
import icecream2Img from "../assets/icecream2_icon.png";
import limeImg from "../assets/lime_icon.png";
import macaroonImg from "../assets/macaroon_icon.png";
import muffinImg from "../assets/muffin_icon.png";
import orangeImg from "../assets/orange_icon.png";
import pancakesImg from "../assets/pancakes_icon.png";
import sodaImg from "../assets/soda_icon.png";
import strawberryImg from "../assets/strawberry_icon.png";
import watermelonImg from "../assets/watermelon_icon.png";
import avocadoImg from "../assets/avocado_icon.png";
import breadImg from "../assets/bread_icon.png";
import candyImg from "../assets/candy_icon.png";
import cheeseImg from "../assets/cheese_icon.png";
import chocolateImg from "../assets/chocolate_icon.png";
import coconutImg from "../assets/coconut_icon.png";
import cornImg from "../assets/corn_icon.png";
import creamImg from "../assets/cream_icon.png";
import eggImg from "../assets/egg_icon.png";
import hotdogImg from "../assets/hotdog_icon.png";
import juiceImg from "../assets/juice_icon.png";
import ketchupImg from "../assets/ketchup_icon.png";
import lolipopImg from "../assets/lolipop_icon.png";
import milkImg from "../assets/milk_icon.png";
import nachosImg from "../assets/nachos_icon.png";
import octopusImg from "../assets/octopus_icon.png";
import pineappleImg from "../assets/pineapple_icon.png";
import popcornImg from "../assets/popcorn_icon.png";
import tomatoImg from "../assets/tomato_icon.png";
import wmIceCreamImg from "../assets/wmIceCream_icon.png";

export const TITLES = [
  "Cola",
  "Coffee",
  "Cupcake",
  "Fries",
  "Icecream",
  "Pizza",
  "Pumpkin",
  "Steak",
  "Sushi",
  "Taco",
  "Apple",
  "Broccoli",
  "Bubble",
  "Cake",
  "Cake2",
  "Cherry",
  "Chicken",
  "Coffee2",
  "Cookie",
  "Croissant",
  "Donut",
  "Icecream2",
  "Lime",
  "Macaroon",
  "Muffin",
  "Orange",
  "Pancakes",
  "Soda",
  "Strawberry",
  "Watermelon",
  "Avocado",
  "Bread",
  "Candy",
  "Cheese",
  "Chocolate",
  "Coconut",
  "Corn",
  "Cream",
  "Egg",
  "Hotdog",
  "Juice",
  "Ketchup",
  "Lolipop",
  "Milk",
  "Nachos",
  "Octopus",
  "Pineapple",
  "Popcorn",
  "Tomato",
  "Watermelon Icecream",
];

export const IMAGES = [
  colaImg,
  coffeeImg,
  cupcakeImg,
  friesImg,
  icecreamImg,
  pizzaImg,
  pumpkinImg,
  steakImg,
  sushiImg,
  tacoImg,
  appleImg,
  broccoliImg,
  bubbleImg,
  cakeImg,
  cake2Img,
  cherryImg,
  chickenImg,
  coffee2Img,
  cookieImg,
  croissantImg,
  donutImg,
  icecream2Img,
  limeImg,
  macaroonImg,
  muffinImg,
  orangeImg,
  pancakesImg,
  sodaImg,
  strawberryImg,
  watermelonImg,
  avocadoImg,
  breadImg,
  candyImg,
  cheeseImg,
  chocolateImg,
  coconutImg,
  cornImg,
  creamImg,
  eggImg,
  hotdogImg,
  juiceImg,
  ketchupImg,
  lolipopImg,
  milkImg,
  nachosImg,
  octopusImg,
  pineappleImg,
  popcornImg,
  tomatoImg,
  wmIceCreamImg,
];

export const createCards = (cardCount, layersCount) => {
  const allCards = [];
  const positionsCount = cardCount;
  const totalCards = positionsCount * layersCount;
  const pairsCount = totalCards / 2;

  const availablePairs = [];
  for (let i = 0; i < IMAGES.length; i++) {
    availablePairs.push({
      pairId: i,
      title: TITLES[i],
      image: IMAGES[i],
    });
  }

  const shuffledPairs = [...availablePairs].sort(() => Math.random() - 0.5);
  const selectedPairs = shuffledPairs.slice(0, pairsCount);

  const pairGroups = [];
  selectedPairs.forEach((pair, pairIndex) => {
    const pairGroup = [];
    for (let i = 0; i < 2; i++) {
      pairGroup.push({
        id: `${Date.now()}-${Math.random()}-pair${pairIndex}-card${i}`,
        title: pair.title,
        image: pair.image,
        isFaceUp: false,
        isFounded: false,
        pairId: pair.pairId,
      });
    }
    pairGroups.push(pairGroup);
  });

  for (let i = pairGroups.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairGroups[i], pairGroups[j]] = [pairGroups[j], pairGroups[i]];
  }

  const pairsPerLayer = positionsCount / 2;

  for (let layer = 0; layer < layersCount; layer++) {
    const startPairIndex = layer * pairsPerLayer;
    const layerPairs = pairGroups.slice(
      startPairIndex,
      startPairIndex + pairsPerLayer,
    );

    const layerCards = [];

    layerPairs.forEach((pairGroup, pairIndex) => {
      // Создаем две карточки пары
      pairGroup.forEach((card, cardIndex) => {
        layerCards.push({
          ...card,
          id: `${card.id}-layer${layer}-card${cardIndex}`,
          position: pairIndex * 2 + cardIndex,
          layer: layer,
        });
      });
    });

    for (let i = layerCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [layerCards[i], layerCards[j]] = [layerCards[j], layerCards[i]];
    }

    layerCards.forEach((card, index) => {
      card.position = index;
    });

    allCards.push(...layerCards);
  }

  for (let i = allCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
  }

  return allCards;
};

export const getTopCards = (cards) => {
  const cardsByPosition = {};

  cards.forEach((card) => {
    if (!cardsByPosition[card.position]) {
      cardsByPosition[card.position] = [];
    }
    cardsByPosition[card.position].push(card);
  });

  const topCards = [];

  Object.values(cardsByPosition).forEach((positionCards) => {
    const sortedByLayer = positionCards.sort((a, b) => b.layer - a.layer);
    const topCard = sortedByLayer.find((card) => !card.isFounded);
    if (topCard) {
      topCards.push(topCard);
    }
  });

  return topCards;
};

export const isGameComplete = (cards) => {
  return cards.every((card) => card.isFounded);
};
