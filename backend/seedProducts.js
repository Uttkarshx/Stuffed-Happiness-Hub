const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const categoryImagePools = {
  girlfriend: [
    '/images/products/teddy-pink.jpg',
    '/images/products/unicorn.jpg',
    '/images/products/angel-bear.jpg',
    '/images/products/bunny.jpg',
  ],
  kids: [
    '/images/products/bunny.jpg',
    '/images/products/unicorn.jpg',
    '/images/products/fox.jpg',
    '/images/products/penguin.jpg',
  ],
  friends: [
    '/images/products/panda.jpg',
    '/images/products/koala.jpg',
    '/images/products/fox.jpg',
    '/images/products/hedgehog.jpg',
  ],
  family: [
    '/images/products/koala.jpg',
    '/images/products/puppy.jpg',
    '/images/products/panda.jpg',
    '/images/products/whale.jpg',
  ],
  general: [
    '/images/products/teddy-pink.jpg',
    '/images/products/cat.jpg',
    '/images/products/hedgehog.jpg',
    '/images/products/whale.jpg',
  ],
};

const fallbackImage = '/images/products/teddy-pink.jpg';

const keywordImageMap = [
  { keywords: ['teddy', 'bear'], image: '/images/products/teddy-pink.jpg' },
  { keywords: ['panda'], image: '/images/products/panda.jpg' },
  { keywords: ['unicorn'], image: '/images/products/unicorn.jpg' },
  { keywords: ['bunny', 'rabbit'], image: '/images/products/bunny.jpg' },
  { keywords: ['fox'], image: '/images/products/fox.jpg' },
  { keywords: ['penguin'], image: '/images/products/penguin.jpg' },
  { keywords: ['koala'], image: '/images/products/koala.jpg' },
  { keywords: ['cat'], image: '/images/products/cat.jpg' },
  { keywords: ['whale'], image: '/images/products/whale.jpg' },
  { keywords: ['hedgehog'], image: '/images/products/hedgehog.jpg' },
  { keywords: ['puppy', 'dog'], image: '/images/products/puppy.jpg' },
];

const resolveImageForProduct = (product, index) => {
  const sourceText = `${product.name} ${product.description}`.toLowerCase();
  const matched = keywordImageMap.find(({ keywords }) =>
    keywords.some((keyword) => sourceText.includes(keyword))
  );

  if (matched) return matched.image;

  const pool = categoryImagePools[product.category] || [];
  if (!pool.length) return fallbackImage;

  return pool[index % pool.length];
};

const products = [
  // Girlfriend (8)
  {
    name: 'Romantic Pink Teddy Bear',
    price: 899,
    description: 'A perfect birthday gift for your girlfriend to express love and care with a soft romantic touch.',
    category: 'girlfriend',
    bestFor: ['girlfriend', 'birthday', 'anniversary'],
    images: [fallbackImage],
    stock: 24,
  },
  {
    name: 'Love Hug Panda',
    price: 799,
    description: 'A cuddly panda made for heartfelt hugs, ideal to surprise your partner on a special evening.',
    category: 'girlfriend',
    bestFor: ['girlfriend', 'date-night', 'surprise'],
    images: [fallbackImage],
    stock: 18,
  },
  {
    name: 'Heart Cushion Teddy',
    price: 999,
    description: 'A charming teddy with a heart cushion that says everything when words are not enough.',
    category: 'girlfriend',
    bestFor: ['girlfriend', 'valentine', 'proposal'],
    images: [fallbackImage],
    stock: 20,
  },
  {
    name: 'Rose Kiss Bunny',
    price: 749,
    description: 'A cute bunny gift that brings warmth and romance, perfect for celebrating your bond.',
    category: 'girlfriend',
    bestFor: ['girlfriend', 'romantic', 'gift'],
    images: [fallbackImage],
    stock: 16,
  },
  {
    name: 'Sweet Love Unicorn',
    price: 1099,
    description: 'A magical plush for dreamy moments, great for anniversaries and sweet surprises.',
    category: 'girlfriend',
    bestFor: ['girlfriend', 'anniversary', 'special-day'],
    images: [fallbackImage],
    stock: 14,
  },
  {
    name: 'Moonlight Couple Teddy',
    price: 1199,
    description: 'A premium couple teddy set crafted to make your love story even more memorable.',
    category: 'girlfriend',
    bestFor: ['girlfriend', 'couple', 'engagement'],
    images: [fallbackImage],
    stock: 12,
  },
  {
    name: 'Forever Love Bear',
    price: 949,
    description: 'A timeless plush gift that symbolizes commitment, affection, and everyday love.',
    category: 'girlfriend',
    bestFor: ['girlfriend', 'love', 'apology'],
    images: [fallbackImage],
    stock: 22,
  },
  {
    name: 'Dream Date Teddy',
    price: 879,
    description: 'A soft companion for romantic gestures, ideal for making your date extra special.',
    category: 'girlfriend',
    bestFor: ['girlfriend', 'date', 'romantic'],
    images: [fallbackImage],
    stock: 19,
  },

  // Kids (8)
  {
    name: 'Cartoon Bunny Toy',
    price: 599,
    description: 'Soft and safe toy for kids, ideal for playtime, naps, and comforting cuddles.',
    category: 'kids',
    bestFor: ['kids', 'playtime', 'birthday'],
    images: [fallbackImage],
    stock: 35,
  },
  {
    name: 'Mini Fox Explorer',
    price: 649,
    description: 'A playful fox plush that sparks imagination and keeps little explorers smiling.',
    category: 'kids',
    bestFor: ['kids', 'toys', 'school-reward'],
    images: [fallbackImage],
    stock: 28,
  },
  {
    name: 'Soft Penguin Toy',
    price: 699,
    description: 'Gentle fabric and adorable design make this penguin a great bedtime companion.',
    category: 'kids',
    bestFor: ['kids', 'bedtime', 'comfort'],
    images: [fallbackImage],
    stock: 30,
  },
  {
    name: 'Tiny Cat Plush',
    price: 579,
    description: 'A playful cat toy for active kids who love cozy adventures and cuddles.',
    category: 'kids',
    bestFor: ['kids', 'play', 'gift'],
    images: [fallbackImage],
    stock: 26,
  },
  {
    name: 'Rainbow Unicorn Buddy',
    price: 529,
    description: 'Bright and colorful unicorn plush that brings joy to every kid room and play corner.',
    category: 'kids',
    bestFor: ['kids', 'newborn', 'baby-shower'],
    images: [fallbackImage],
    stock: 40,
  },
  {
    name: 'Sleepy Koala Cub',
    price: 739,
    description: 'A soothing koala plush for peaceful sleep and cozy bedtime routines.',
    category: 'kids',
    bestFor: ['kids', 'sleep', 'night-routine'],
    images: [fallbackImage],
    stock: 21,
  },
  {
    name: 'Pocket Fox Plush',
    price: 489,
    description: 'A mini fox plush that fits little hands perfectly and becomes a quick favorite.',
    category: 'kids',
    bestFor: ['kids', 'return-gift', 'travel'],
    images: [fallbackImage],
    stock: 33,
  },
  {
    name: 'Happy Puppy Toy',
    price: 629,
    description: 'An adorable puppy toy designed for hugs, laughter, and cheerful play sessions.',
    category: 'kids',
    bestFor: ['kids', 'fun', 'daily-play'],
    images: [fallbackImage],
    stock: 25,
  },

  // Friends (8)
  {
    name: 'Funny Cat Plush',
    price: 549,
    description: 'A cute and funny cat plush to gift your best friend and make them smile instantly.',
    category: 'friends',
    bestFor: ['friends', 'funny', 'surprise'],
    images: [fallbackImage],
    stock: 29,
  },
  {
    name: 'Chill Panda Buddy',
    price: 699,
    description: 'A relaxed panda plush perfect for your friend who loves cozy and aesthetic gifts.',
    category: 'friends',
    bestFor: ['friends', 'birthday', 'casual-gift'],
    images: [fallbackImage],
    stock: 23,
  },
  {
    name: 'Lazy Koala Toy',
    price: 679,
    description: 'A lovable koala plush that captures chill vibes and makes every gift moment fun.',
    category: 'friends',
    bestFor: ['friends', 'chill', 'desk-buddy'],
    images: [fallbackImage],
    stock: 17,
  },
  {
    name: 'Bestie Memory Bear',
    price: 829,
    description: 'A thoughtful plush gift to celebrate friendship milestones and shared memories.',
    category: 'friends',
    bestFor: ['friends', 'bestie', 'friendship-day'],
    images: [fallbackImage],
    stock: 20,
  },
  {
    name: 'Coffee Date Bunny',
    price: 589,
    description: 'A quirky bunny companion made for friends who enjoy long talks and coffee breaks.',
    category: 'friends',
    bestFor: ['friends', 'coffee-date', 'hangout'],
    images: [fallbackImage],
    stock: 31,
  },
  {
    name: 'Travel Buddy Penguin',
    price: 749,
    description: 'A travel-themed plush gift for friends who love adventures and road trips.',
    category: 'friends',
    bestFor: ['friends', 'travel', 'farewell-gift'],
    images: [fallbackImage],
    stock: 15,
  },
  {
    name: 'Giggle Bear Mini',
    price: 519,
    description: 'A tiny plush full of charm that turns ordinary days into happy friendship moments.',
    category: 'friends',
    bestFor: ['friends', 'small-gift', 'fun'],
    images: [fallbackImage],
    stock: 36,
  },
  {
    name: 'Mood Booster Plush Set',
    price: 999,
    description: 'A cheerful plush set that is perfect for lifting your friend mood with warmth.',
    category: 'friends',
    bestFor: ['friends', 'care-package', 'support'],
    images: [fallbackImage],
    stock: 11,
  },

  // Family (8)
  {
    name: 'Warm Hug Teddy',
    price: 899,
    description: 'Great for gifting your family members as a symbol of warmth, affection, and care.',
    category: 'family',
    bestFor: ['family', 'home', 'love'],
    images: [fallbackImage],
    stock: 27,
  },
  {
    name: 'Mom Love Bear',
    price: 949,
    description: 'A heartfelt plush gift for moms to thank them for endless love and support.',
    category: 'family',
    bestFor: ['family', 'mom', 'mothers-day'],
    images: [fallbackImage],
    stock: 18,
  },
  {
    name: 'Dad Comfort Plush',
    price: 899,
    description: 'A meaningful comfort plush for dads who deserve a warm and thoughtful gift.',
    category: 'family',
    bestFor: ['family', 'dad', 'fathers-day'],
    images: [fallbackImage],
    stock: 16,
  },
  {
    name: 'Grandma Cozy Bunny',
    price: 769,
    description: 'A soft cozy bunny that brings a smile to grandparents and brightens their day.',
    category: 'family',
    bestFor: ['family', 'grandma', 'care'],
    images: [fallbackImage],
    stock: 22,
  },
  {
    name: 'Grandpa Smile Plush',
    price: 759,
    description: 'A cute plush gift to make grandpa feel loved and remembered every day.',
    category: 'family',
    bestFor: ['family', 'grandpa', 'comfort'],
    images: [fallbackImage],
    stock: 20,
  },
  {
    name: 'Sibling Bond Panda',
    price: 709,
    description: 'A lovely plush to celebrate sibling bond and shared childhood memories.',
    category: 'family',
    bestFor: ['family', 'siblings', 'rakhi'],
    images: [fallbackImage],
    stock: 26,
  },
  {
    name: 'Home Blessing Teddy',
    price: 1029,
    description: 'A premium teddy for family celebrations, housewarming, and festive gifting.',
    category: 'family',
    bestFor: ['family', 'housewarming', 'festival'],
    images: [fallbackImage],
    stock: 13,
  },
  {
    name: 'Family Joy Plush Set',
    price: 1199,
    description: 'A joyful plush set made for sharing warm moments with your loved ones at home.',
    category: 'family',
    bestFor: ['family', 'celebration', 'group-gift'],
    images: [fallbackImage],
    stock: 10,
  },

  // General (5)
  {
    name: 'Classic Brown Teddy',
    price: 699,
    description: 'A timeless teddy bear that suits every occasion and every age group beautifully.',
    category: 'general',
    bestFor: ['general', 'all', 'gift'],
    images: [fallbackImage],
    stock: 38,
  },
  {
    name: 'Premium Giant Teddy',
    price: 1999,
    description: 'A giant premium plush for grand surprises, celebrations, and unforgettable gifting.',
    category: 'general',
    bestFor: ['general', 'premium', 'celebration'],
    images: [fallbackImage],
    stock: 12,
  },
  {
    name: 'Gift Combo Plush Set',
    price: 1499,
    description: 'A versatile plush combo for birthdays, anniversaries, and festive gifting needs.',
    category: 'general',
    bestFor: ['general', 'combo', 'occasion'],
    images: [fallbackImage],
    stock: 14,
  },
  {
    name: 'Everyday Comfort Teddy',
    price: 799,
    description: 'A soft daily comfort plush designed to make anyone feel calm and cared for.',
    category: 'general',
    bestFor: ['general', 'comfort', 'self-care'],
    images: [fallbackImage],
    stock: 34,
  },
  {
    name: 'Celebration Plush Hamper',
    price: 1699,
    description: 'A festive plush hamper that works as a ready-to-gift bundle for joyful moments.',
    category: 'general',
    bestFor: ['general', 'hamper', 'festival'],
    images: [fallbackImage],
    stock: 11,
  },
  {
    name: 'Blush Bunny Love Gift',
    price: 929,
    description: 'A blush bunny plush made for romantic surprises and soft evening cuddles.',
    category: 'girlfriend',
    bestFor: ['girlfriend', 'romantic', 'surprise'],
    images: [fallbackImage],
    stock: 18,
  },
  {
    name: 'Velvet Panda Promise',
    price: 1049,
    description: 'A premium panda plush to celebrate commitment and memorable relationship milestones.',
    category: 'girlfriend',
    bestFor: ['girlfriend', 'anniversary', 'promise'],
    images: [fallbackImage],
    stock: 14,
  },
  {
    name: 'Unicorn Dream Hug',
    price: 1149,
    description: 'A magical unicorn hug plush that adds sparkle to every heartfelt gift moment.',
    category: 'girlfriend',
    bestFor: ['girlfriend', 'special-day', 'valentine'],
    images: [fallbackImage],
    stock: 12,
  },
  {
    name: 'Little Panda Cub',
    price: 619,
    description: 'A tiny panda cub plush for playful hugs, cozy naps, and happy storytelling time.',
    category: 'kids',
    bestFor: ['kids', 'playtime', 'gift'],
    images: [fallbackImage],
    stock: 34,
  },
  {
    name: 'Pocket Penguin Pal',
    price: 559,
    description: 'A cute pocket penguin plush that is easy to carry and fun for everyday play.',
    category: 'kids',
    bestFor: ['kids', 'travel', 'return-gift'],
    images: [fallbackImage],
    stock: 29,
  },
  {
    name: 'Bunny Bestie Plush',
    price: 689,
    description: 'A soft bunny plush crafted for best friends who love sweet and thoughtful gifts.',
    category: 'friends',
    bestFor: ['friends', 'bestie', 'birthday'],
    images: [fallbackImage],
    stock: 24,
  },
  {
    name: 'Fox Vibes Buddy',
    price: 639,
    description: 'A trendy fox buddy plush that makes hangouts, selfies, and surprises extra fun.',
    category: 'friends',
    bestFor: ['friends', 'fun', 'casual-gift'],
    images: [fallbackImage],
    stock: 27,
  },
  {
    name: 'Family Panda Keepsake',
    price: 969,
    description: 'A charming panda keepsake plush for family celebrations and warm home moments.',
    category: 'family',
    bestFor: ['family', 'celebration', 'home'],
    images: [fallbackImage],
    stock: 16,
  },
  {
    name: 'Classic Koala Plush',
    price: 779,
    description: 'A classic koala plush gift suitable for all ages and everyday cozy comfort.',
    category: 'general',
    bestFor: ['general', 'all', 'comfort'],
    images: [fallbackImage],
    stock: 32,
  },
  {
    name: 'Whale Cuddle Cushion',
    price: 889,
    description: 'A soft whale cuddle cushion plush perfect for relaxing, gifting, and decor.',
    category: 'general',
    bestFor: ['general', 'home', 'gift'],
    images: [fallbackImage],
    stock: 23,
  },
];

const trendingProductNames = new Set([
  'Romantic Pink Teddy Bear',
  'Sweet Love Unicorn',
  'Cartoon Bunny Toy',
  'Pocket Fox Plush',
  'Chill Panda Buddy',
  'Travel Buddy Penguin',
  'Warm Hug Teddy',
  'Home Blessing Teddy',
]);

const bestSellerProductNames = new Set([
  'Heart Cushion Teddy',
  'Forever Love Bear',
  'Sleepy Koala Cub',
  'Happy Hippo Toy',
  'Bestie Memory Bear',
  'Mood Booster Plush Set',
  'Mom Love Bear',
  'Premium Giant Teddy',
]);

const getSeedRating = (index) => Number((4.2 + (index % 9) * 0.08).toFixed(1));

const seedProducts = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.info('MongoDB connected for seeding');

    const productsWithImages = products.map((product, index) => ({
      ...product,
      images: [resolveImageForProduct(product, index)],
      isTrending: trendingProductNames.has(product.name),
      isBestSeller: bestSellerProductNames.has(product.name),
      rating: getSeedRating(index),
    }));

    await Product.deleteMany({});
    const insertedProducts = await Product.insertMany(productsWithImages);

    console.info(`Seed completed: ${insertedProducts.length} products inserted`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedProducts();
