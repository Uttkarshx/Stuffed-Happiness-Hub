import { Product } from './types';

type SeedItem = {
  name: string;
  category: Product['category'];
  image: string;
  bestFor: string[];
};

const seedItems: SeedItem[] = [
  { name: 'Romantic Pink Teddy Bear', category: 'girlfriend', image: '/images/products/teddy-pink.jpg', bestFor: ['girlfriend', 'romantic'] },
  { name: 'Love Hug Panda', category: 'girlfriend', image: '/images/products/panda.jpg', bestFor: ['girlfriend', 'surprise'] },
  { name: 'Heart Cushion Teddy', category: 'girlfriend', image: '/images/products/teddy-pink.jpg', bestFor: ['girlfriend', 'valentine'] },
  { name: 'Rose Kiss Bunny', category: 'girlfriend', image: '/images/products/bunny.jpg', bestFor: ['girlfriend', 'date'] },
  { name: 'Sweet Love Unicorn', category: 'girlfriend', image: '/images/products/unicorn.jpg', bestFor: ['girlfriend', 'anniversary'] },
  { name: 'Forever Love Bear', category: 'girlfriend', image: '/images/products/teddy-pink.jpg', bestFor: ['girlfriend', 'gift'] },
  { name: 'Dream Date Teddy', category: 'girlfriend', image: '/images/products/teddy-pink.jpg', bestFor: ['girlfriend', 'special-day'] },
  { name: 'Blush Bunny Love Gift', category: 'girlfriend', image: '/images/products/bunny.jpg', bestFor: ['girlfriend', 'romantic'] },

  { name: 'Cartoon Bunny Toy', category: 'kids', image: '/images/products/bunny.jpg', bestFor: ['kids', 'playtime'] },
  { name: 'Mini Fox Explorer', category: 'kids', image: '/images/products/fox.jpg', bestFor: ['kids', 'school-reward'] },
  { name: 'Soft Penguin Toy', category: 'kids', image: '/images/products/penguin.jpg', bestFor: ['kids', 'bedtime'] },
  { name: 'Tiny Cat Plush', category: 'kids', image: '/images/products/cat.jpg', bestFor: ['kids', 'gift'] },
  { name: 'Rainbow Unicorn Buddy', category: 'kids', image: '/images/products/unicorn.jpg', bestFor: ['kids', 'newborn'] },
  { name: 'Sleepy Koala Cub', category: 'kids', image: '/images/products/koala.jpg', bestFor: ['kids', 'sleep'] },
  { name: 'Pocket Fox Plush', category: 'kids', image: '/images/products/fox.jpg', bestFor: ['kids', 'travel'] },
  { name: 'Happy Puppy Toy', category: 'kids', image: '/images/products/puppy.jpg', bestFor: ['kids', 'fun'] },
  { name: 'Little Panda Cub', category: 'kids', image: '/images/products/panda.jpg', bestFor: ['kids', 'daily-play'] },
  { name: 'Pocket Penguin Pal', category: 'kids', image: '/images/products/penguin.jpg', bestFor: ['kids', 'return-gift'] },

  { name: 'Funny Cat Plush', category: 'friends', image: '/images/products/cat.jpg', bestFor: ['friends', 'funny'] },
  { name: 'Chill Panda Buddy', category: 'friends', image: '/images/products/panda.jpg', bestFor: ['friends', 'cozy'] },
  { name: 'Lazy Koala Toy', category: 'friends', image: '/images/products/koala.jpg', bestFor: ['friends', 'chill'] },
  { name: 'Bestie Memory Bear', category: 'friends', image: '/images/products/teddy-pink.jpg', bestFor: ['friends', 'bestie'] },
  { name: 'Coffee Date Bunny', category: 'friends', image: '/images/products/bunny.jpg', bestFor: ['friends', 'hangout'] },
  { name: 'Travel Buddy Penguin', category: 'friends', image: '/images/products/penguin.jpg', bestFor: ['friends', 'travel'] },
  { name: 'Giggle Bear Mini', category: 'friends', image: '/images/products/teddy-pink.jpg', bestFor: ['friends', 'small-gift'] },
  { name: 'Mood Booster Plush Set', category: 'friends', image: '/images/products/hedgehog.jpg', bestFor: ['friends', 'care-package'] },
  { name: 'Bunny Bestie Plush', category: 'friends', image: '/images/products/bunny.jpg', bestFor: ['friends', 'birthday'] },
  { name: 'Fox Vibes Buddy', category: 'friends', image: '/images/products/fox.jpg', bestFor: ['friends', 'casual-gift'] },

  { name: 'Warm Hug Teddy', category: 'family', image: '/images/products/teddy-pink.jpg', bestFor: ['family', 'love'] },
  { name: 'Mom Love Bear', category: 'family', image: '/images/products/teddy-pink.jpg', bestFor: ['family', 'mom'] },
  { name: 'Dad Comfort Plush', category: 'family', image: '/images/products/puppy.jpg', bestFor: ['family', 'dad'] },
  { name: 'Grandma Cozy Bunny', category: 'family', image: '/images/products/bunny.jpg', bestFor: ['family', 'grandma'] },
  { name: 'Grandpa Smile Plush', category: 'family', image: '/images/products/whale.jpg', bestFor: ['family', 'grandpa'] },
  { name: 'Sibling Bond Panda', category: 'family', image: '/images/products/panda.jpg', bestFor: ['family', 'siblings'] },
  { name: 'Home Blessing Teddy', category: 'family', image: '/images/products/teddy-pink.jpg', bestFor: ['family', 'home'] },
  { name: 'Family Joy Plush Set', category: 'family', image: '/images/products/koala.jpg', bestFor: ['family', 'celebration'] },
  { name: 'Family Panda Keepsake', category: 'family', image: '/images/products/panda.jpg', bestFor: ['family', 'festival'] },

  { name: 'Classic Brown Teddy', category: 'general', image: '/images/products/teddy-pink.jpg', bestFor: ['general', 'all'] },
  { name: 'Premium Giant Teddy', category: 'general', image: '/images/products/teddy-pink.jpg', bestFor: ['general', 'premium'] },
  { name: 'Gift Combo Plush Set', category: 'general', image: '/images/products/hedgehog.jpg', bestFor: ['general', 'occasion'] },
  { name: 'Everyday Comfort Teddy', category: 'general', image: '/images/products/teddy-pink.jpg', bestFor: ['general', 'comfort'] },
  { name: 'Celebration Plush Hamper', category: 'general', image: '/images/products/unicorn.jpg', bestFor: ['general', 'hamper'] },
  { name: 'Classic Koala Plush', category: 'general', image: '/images/products/koala.jpg', bestFor: ['general', 'gift'] },
  { name: 'Whale Cuddle Cushion', category: 'general', image: '/images/products/whale.jpg', bestFor: ['general', 'home'] },
];

export const fallbackProducts: Product[] = seedItems.map((item, index) => ({
  id: `fallback-${index + 1}`,
  _id: `fallback-${index + 1}`,
  name: item.name,
  price: 499 + (index % 12) * 80,
  originalPrice: 599 + (index % 12) * 90,
  image: item.image,
  images: [item.image],
  rating: Number((4.2 + (index % 7) * 0.1).toFixed(1)),
  reviews: 25 + (index % 40),
  description: `${item.name} is a soft stuffed toy gift curated for ${item.bestFor.join(', ')} moments.`,
  category: item.category,
  bestFor: item.bestFor,
  inStock: true,
  stock: 15 + (index % 20),
  isTrending: index % 5 === 0,
  isBestSeller: index % 6 === 0,
  discount: index % 3 === 0 ? 10 : undefined,
}));
