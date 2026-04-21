import monstera from "@/assets/product-monstera.jpg";
import pothos from "@/assets/product-pothos.jpg";
import zz from "@/assets/product-zz.jpg";
import peacelily from "@/assets/product-peacelily.jpg";
import succulent from "@/assets/product-succulent.jpg";
import calathea from "@/assets/product-calathea.jpg";
import fiddle from "@/assets/product-fiddle.jpg";
import snake from "@/assets/product-snake.jpg";
import fern from "@/assets/product-fern.jpg";
import jade from "@/assets/product-jade.jpg";
import anthurium from "@/assets/product-anthurium.jpg";
import rubber from "@/assets/product-rubber.jpg";

export type Category = "Indoor" | "Succulent" | "Flowering" | "Trailing";

export interface Product {
  id: string;
  name: string;
  tag: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: string;
  gallery?: string[];
  badge?: "new" | "sale" | "bestseller";
  category: Category;
  description: string;
  care: { light: string; water: string; petSafe: string };
}

export const products: Product[] = [
  {
    id: "550e8400-e29b-41d4-a716-000000000001",
    name: "Monstera Deliciosa",
    tag: "Easy care · Indoor",
    price: 1299,
    oldPrice: 1799,
    rating: 4.9,
    image: monstera,
    badge: "bestseller",
    category: "Indoor",
    description:
      "The iconic Swiss Cheese Plant brings a lush, tropical statement to any room. Famous for its dramatic split leaves, the Monstera grows quickly and rewards minimal care with bold, sculptural greenery.",
    care: { light: "Bright indirect", water: "Weekly", petSafe: "Toxic to pets" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000002",
    name: "Golden Pothos",
    tag: "Trailing · Pet-safe-ish",
    price: 549,
    rating: 4.8,
    image: pothos,
    badge: "new",
    category: "Trailing",
    description:
      "A trailing classic with heart-shaped leaves splashed in gold. Pothos thrives almost anywhere — perfect for shelves, hanging baskets, or letting it climb a moss pole.",
    care: { light: "Low to bright", water: "Every 1-2 weeks", petSafe: "Mildly toxic" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000003",
    name: "ZZ Plant",
    tag: "Low light · Hardy",
    price: 899,
    rating: 4.7,
    image: zz,
    category: "Indoor",
    description:
      "Glossy, deep-green leaves on architectural stems. The ZZ tolerates low light and infrequent watering — the ultimate plant for busy people and dim corners.",
    care: { light: "Low to medium", water: "Every 2-3 weeks", petSafe: "Toxic to pets" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000004",
    name: "Peace Lily",
    tag: "Air purifying · Flowering",
    price: 749,
    oldPrice: 999,
    rating: 4.6,
    image: peacelily,
    badge: "sale",
    category: "Flowering",
    description:
      "Elegant white blooms above lush green foliage. The Peace Lily filters indoor air and tells you when it's thirsty by gently drooping its leaves.",
    care: { light: "Medium indirect", water: "Weekly", petSafe: "Toxic to pets" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000005",
    name: "Pink Echeveria",
    tag: "Succulent · Mini",
    price: 249,
    rating: 4.9,
    image: succulent,
    category: "Succulent",
    description:
      "A compact rosette succulent with blush-pink tips. Perfect for sunny windowsills, terrariums, and desk gardens. Practically thrives on neglect.",
    care: { light: "Bright direct", water: "Every 2-3 weeks", petSafe: "Pet safe" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000006",
    name: "Calathea Orbifolia",
    tag: "Statement · Shade lover",
    price: 1149,
    rating: 4.8,
    image: calathea,
    badge: "new",
    category: "Indoor",
    description:
      "Show-stopping silver-striped round leaves. The Orbifolia loves humidity and shaded spots — a true statement plant for bathrooms and shaded living rooms.",
    care: { light: "Medium indirect", water: "Keep moist", petSafe: "Pet safe" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000007",
    name: "Fiddle Leaf Fig",
    tag: "Statement · Indoor",
    price: 1499,
    oldPrice: 1899,
    rating: 4.7,
    image: fiddle,
    badge: "bestseller",
    category: "Indoor",
    description:
      "A bold statement tree with large violin-shaped leaves. The Fiddle Leaf Fig brings height and drama to bright living spaces.",
    care: { light: "Bright indirect", water: "Weekly", petSafe: "Toxic to pets" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000008",
    name: "Snake Plant",
    tag: "Air purifying · Hardy",
    price: 699,
    rating: 4.9,
    image: snake,
    category: "Indoor",
    description:
      "Tall, sculptural striped leaves that thrive on neglect. Snake Plants purify air and tolerate almost any light condition.",
    care: { light: "Low to bright", water: "Every 2-3 weeks", petSafe: "Toxic to pets" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000009",
    name: "Boston Fern",
    tag: "Hanging · Lush",
    price: 599,
    oldPrice: 799,
    rating: 4.5,
    image: fern,
    badge: "sale",
    category: "Trailing",
    description:
      "Cascading bright-green fronds perfect for hanging baskets. Boston Ferns love humidity and add a soft, lush feel to any room.",
    care: { light: "Medium indirect", water: "Keep moist", petSafe: "Pet safe" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000010",
    name: "Jade Plant",
    tag: "Succulent · Lucky",
    price: 349,
    rating: 4.8,
    image: jade,
    category: "Succulent",
    description:
      "A classic lucky succulent with plump, glossy leaves on woody stems. Long-lived, slow-growing, and perfect for sunny windowsills.",
    care: { light: "Bright direct", water: "Every 2-3 weeks", petSafe: "Mildly toxic" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000011",
    name: "Pink Anthurium",
    tag: "Flowering · Tropical",
    price: 999,
    rating: 4.6,
    image: anthurium,
    badge: "new",
    category: "Flowering",
    description:
      "Glossy pink heart-shaped flowers bloom year-round above deep green foliage. A long-lasting, easy-care tropical statement.",
    care: { light: "Bright indirect", water: "Weekly", petSafe: "Toxic to pets" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000012",
    name: "Rubber Plant",
    tag: "Bold foliage · Indoor",
    price: 1099,
    rating: 4.7,
    image: rubber,
    category: "Indoor",
    description:
      "Large burgundy-green glossy leaves on an upright stem. The Rubber Plant is easy-going and adds a sculptural pop of color indoors.",
    care: { light: "Medium to bright", water: "Every 1-2 weeks", petSafe: "Mildly toxic" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000013",
    name: "Spider Plant",
    tag: "Easy care · Hanging",
    price: 499,
    rating: 4.8,
    image: fern,
    badge: "bestseller",
    category: "Trailing",
    description:
      "One of the most adaptable of houseplants, the Spider Plant produces long thin leaves and baby 'spiderettes' that dangle down from the mother plant.",
    care: { light: "Bright indirect", water: "Weekly", petSafe: "Pet safe" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000014",
    name: "String of Pearls",
    tag: "Succulent · Trailing",
    price: 649,
    rating: 4.5,
    image: succulent,
    category: "Trailing",
    description:
      "A unique succulent with spherical, bead-like leaves that cascade down its stems. Perfect for high shelves or hanging planters.",
    care: { light: "Bright direct", water: "Every 2-3 weeks", petSafe: "Toxic to pets" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000015",
    name: "Bird of Paradise",
    tag: "Statement · Tropical",
    price: 1999,
    oldPrice: 2499,
    rating: 4.9,
    image: monstera,
    badge: "sale",
    category: "Indoor",
    description:
      "Bring the tropics indoors with the Bird of Paradise. Known for its massive, banana-like leaves and towering height, it's the ultimate statement plant.",
    care: { light: "Bright direct to indirect", water: "Weekly", petSafe: "Toxic to pets" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000016",
    name: "Pilea Peperomioides",
    tag: "Mini · Coin Plant",
    price: 449,
    rating: 4.7,
    image: jade,
    badge: "new",
    category: "Indoor",
    description:
      "Often called the Chinese Money Plant, the Pilea is famous for its perfectly round, coin-shaped leaves. Fast-growing and easy to propagate.",
    care: { light: "Bright indirect", water: "When soil is dry", petSafe: "Pet safe" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000017",
    name: "English Ivy",
    tag: "Classic · Climbing",
    price: 399,
    rating: 4.6,
    image: pothos,
    category: "Trailing",
    description:
      "A timeless climbing vine that can be trained along wires, walls, or cascading from a basket. Excellent for adding a classic touch to any space.",
    care: { light: "Medium to bright", water: "Weekly", petSafe: "Toxic to pets" },
  },
  {
    id: "550e8400-e29b-41d4-a716-000000000018",
    name: "Alocasia Polly",
    tag: "Exotic · Statement",
    price: 1299,
    rating: 4.8,
    image: calathea,
    category: "Indoor",
    description:
      "Striking, arrow-shaped leaves with distinct, bright veins. The Alocasia Polly adds an architectural and exotic flair to your plant collection.",
    care: { light: "Bright indirect", water: "Keep moist", petSafe: "Toxic to pets" },
  },
];

export const getProductById = (id: string) => products.find((p) => p.id === id);
