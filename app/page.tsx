'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Gift, ShieldCheck, Truck } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { fallbackProducts } from '@/lib/fallbackProducts';
import { Product } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);

  const offerBanners = [
    { title: 'Midnight Plush Sale', subtitle: 'Get up to 30% OFF on dreamy plush gifts', image: '/images/products/unicorn.jpg' },
    { title: 'Couple Gift Week', subtitle: 'Romantic teddy picks crafted for heart-melting surprises', image: '/images/products/teddy-pink.jpg' },
    { title: 'Birthday Cuteness Drop', subtitle: 'Cute plushies everyone loves to unwrap', image: '/images/products/panda.jpg' },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        if (!data.length) {
          console.warn('Products API returned empty payload. Using fallback stuffed toys.');
          setProducts(fallbackProducts);
          return;
        }
        if (process.env.NODE_ENV !== 'production') {
          console.log('Products:', data);
        }
        setProducts(data);
      } catch (error: unknown) {
        console.warn('Failed to fetch products:', error);
        toast.warning('Live product server is unreachable. Showing stuffed toy catalog.');
        setProducts(fallbackProducts);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % offerBanners.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [offerBanners.length]);

  const trendingProducts = useMemo(
    () => {
      const trending = products.filter((p) => p.isTrending);
      if (trending.length > 0) {
        return trending.slice(0, 4);
      }
      return [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
    },
    [products]
  );
  const bestSellerProducts = useMemo(
    () => {
      const bestSellers = products.filter((p) => p.isBestSeller);
      if (bestSellers.length > 0) {
        return bestSellers.slice(0, 4);
      }
      return [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
    },
    [products]
  );

  const categories = [
    {
      name: 'Teddy Bears 🧸',
      href: '/shop?category=general',
      image: '/images/products/teddy-pink.jpg',
      description: 'Classic cuddle gifts with premium charm.',
    },
    {
      name: 'Couples Gifts 💞',
      href: '/shop?category=girlfriend',
      image: '/images/products/unicorn.jpg',
      description: 'Romantic plush picks for special moments.',
    },
    {
      name: 'Birthday Gifts 🎂',
      href: '/shop?category=kids',
      image: '/images/products/panda.jpg',
      description: 'Party-ready plush gifts full of joy.',
    },
    {
      name: 'Cute Plushies 🌸',
      href: '/shop?category=friends',
      image: '/images/products/koala.jpg',
      description: 'Aesthetic soft toys for everyday smiles.',
    },
  ];

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-[#ffd8e5] via-[#ffeaf1] to-[#ffd1dc]" />
        <div className="absolute -left-24 top-20 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute right-0 top-8 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-2 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-secondary/35 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="fade-in-up">
            <p className="glass-chip mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80">
              <Sparkles size={14} />
              Emotional Gifting, Reimagined
            </p>

            <h1 className="mb-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Make Every Moment Cuter
              <span className="text-gradient-pink block">🧸💕</span>
            </h1>

            <p className="mb-8 max-w-xl text-base text-muted-foreground sm:text-lg">
              Find the perfect plush gift for your loved ones. Gift smiles with our adorable plushies and turn ordinary days into heart-melting moments.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/shop">
                <Button size="lg" className="hero-glow w-full rounded-full px-7 pink-gradient text-white sm:w-auto">
                  Shop Now
                </Button>
              </Link>
              <Link href="/#categories">
                <Button size="lg" variant="outline" className="w-full rounded-full border-primary/40 bg-white/60 px-7 sm:w-auto">
                  Explore Gifts
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs text-muted-foreground sm:text-sm">
              <span className="glass-chip">Premium quality plushies</span>
              <span className="glass-chip">Free shipping above ₹999</span>
              <span className="glass-chip">Loved by 10k+ gifters</span>
            </div>
          </div>

          <div className="relative mx-auto h-80 w-full max-w-xl sm:h-96">
            <div className="float-soft absolute -left-4 top-10 h-10 w-10 rounded-full bg-pink-300/50 blur-sm" />
            <div className="float-soft absolute right-4 top-5 h-8 w-8 rounded-full bg-purple-300/40 blur-sm" />
            <div className="float-soft absolute right-12 bottom-6 h-9 w-9 rounded-full bg-rose-200/60 blur-sm" />
            <div className="hero-glow absolute inset-0 rounded-4xl bg-linear-to-br from-white/85 via-white/65 to-primary/20" />
            <Image
              src="/images/products/teddy-pink.jpg"
              alt="Premium stuffed gift"
              fill
              priority
              loading="eager"
              className="rounded-4xl object-cover p-5"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <div className="absolute -left-3 top-8 rounded-2xl bg-white/95 px-4 py-2 shadow-lg">
              <p className="text-xs text-muted-foreground">Top Pick</p>
              <p className="text-sm font-semibold text-foreground">Romantic Teddy Series</p>
            </div>

            <div className="absolute -bottom-3 right-4 rounded-2xl bg-white/95 px-4 py-2 shadow-lg">
              <p className="text-xs text-muted-foreground">Trending Today</p>
              <p className="text-sm font-semibold text-foreground">Magical Unicorn Gifts</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-white/85 p-5 shadow-[0_12px_30px_rgba(255,111,145,0.12)] sm:p-7">
          <div className="grid items-center gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Limited Time Offer</p>
              <h3 className="mt-2 text-2xl font-bold text-foreground">{offerBanners[bannerIndex].title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{offerBanners[bannerIndex].subtitle}</p>
              <Link href="/shop" className="mt-4 inline-block text-sm font-semibold text-primary">Shop Offer →</Link>
            </div>
            <div className="relative h-44 overflow-hidden rounded-2xl sm:h-48">
              <Image src={offerBanners[bannerIndex].image} alt={offerBanners[bannerIndex].title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-3xl font-bold text-foreground sm:text-4xl">
          Shop by Category
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
          Discover curated gifting collections tailored by relationship and mood.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group relative overflow-hidden rounded-2xl border border-border hover-lift">
              <div className="relative h-64">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                  <p className="mt-1 text-sm text-white/85">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Trending Gifts</h2>
            <p className="mt-2 text-muted-foreground">Most loved plushies this week.</p>
          </div>
          <Link href="/shop">
            <Button variant="ghost" className="text-primary">View All →</Button>
          </Link>
        </div>
        <div className="soft-scroll-x -mx-1 flex gap-5 overflow-x-auto px-1 pb-2">
          {trendingProducts.length > 0 ? (
            trendingProducts.map((product) => (
              <div key={product.id} className="min-w-[285px] max-w-[285px] sm:min-w-[300px] sm:max-w-[300px]">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="w-full rounded-2xl border border-border bg-muted/35 p-6 text-center text-muted-foreground">
              No products available right now.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Best Sellers</h2>
            <p className="mt-2 text-muted-foreground">Top-rated products your loved ones adore.</p>
          </div>
          <Link href="/shop?sort=popularity">
            <Button variant="ghost" className="text-primary">Discover More →</Button>
          </Link>
        </div>
        <div className="soft-scroll-x -mx-1 flex gap-5 overflow-x-auto px-1 pb-2">
          {bestSellerProducts.length > 0 ? (
            bestSellerProducts.map((product) => (
              <div key={product.id} className="min-w-[285px] max-w-[285px] sm:min-w-[300px] sm:max-w-[300px]">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="w-full rounded-2xl border border-border bg-muted/35 p-6 text-center text-muted-foreground">
              No products available right now.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card-soft grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
          <div className="rounded-2xl bg-muted/55 p-4">
            <Gift className="mb-3 text-primary" />
            <h3 className="font-semibold text-foreground">Gift-Ready Packaging</h3>
            <p className="mt-1 text-sm text-muted-foreground">Every order arrives beautifully packed for instant gifting.</p>
          </div>
          <div className="rounded-2xl bg-muted/55 p-4">
            <Truck className="mb-3 text-primary" />
            <h3 className="font-semibold text-foreground">Fast Delivery</h3>
            <p className="mt-1 text-sm text-muted-foreground">Quick dispatch and safe doorstep delivery across major cities.</p>
          </div>
          <div className="rounded-2xl bg-muted/55 p-4">
            <ShieldCheck className="mb-3 text-primary" />
            <h3 className="font-semibold text-foreground">Trusted Quality</h3>
            <p className="mt-1 text-sm text-muted-foreground">Premium fabrics and thoughtful details in every plushie.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="hero-glow overflow-hidden rounded-4xl bg-linear-to-r from-primary to-accent p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Send Love in the Softest Way</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            Surprise someone special today with an emotional gift they will hold onto forever.
          </p>
          <Link href="/shop" className="mt-8 inline-block">
            <Button size="lg" className="rounded-full bg-white px-8 text-primary hover:bg-white/90">
              Start Shopping
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
