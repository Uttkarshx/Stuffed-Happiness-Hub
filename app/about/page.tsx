'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const specialCards = [
  {
    title: 'Emotional Gifting',
    icon: '❤️',
    text: 'Every product is designed to express feelings, not just be a product.',
  },
  {
    title: 'Curated Collections',
    icon: '🎁',
    text: 'We carefully select items perfect for girlfriends, friends, kids, and family.',
  },
  {
    title: 'Fast & Reliable',
    icon: '🚀',
    text: 'Quick delivery so your surprises arrive on time.',
  },
  {
    title: 'Affordable Luxury',
    icon: '💖',
    text: 'Premium-looking gifts at student-friendly prices.',
  },
];

const audienceTags = ['For Girlfriend 💕', 'For Friends 🤝', 'For Family 👨‍👩‍👧', 'For Kids 🧸'];

const trustHighlights = [
  '⭐ 1000+ Happy Customers',
  '📦 Secure Packaging',
  '🔄 Easy Returns',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#fff7fa] via-[#fffafd] to-white text-foreground">
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="rounded-3xl border border-pink-100/80 bg-linear-to-r from-[#ffdce8]/70 via-[#ffeaf1]/70 to-[#fff2f7]/70 p-8 text-center shadow-sm sm:p-12"
          >
            <h1 className="mx-auto mb-4 max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">
              More Than Gifts - We Deliver Emotions ❤️
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              At Stuffed Happiness Hub, every product is designed to turn ordinary moments into unforgettable memories.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-pink-100 bg-white/90 p-8 shadow-sm sm:p-10"
          >
            <h2 className="mb-5 text-2xl font-bold sm:text-3xl">Our Story</h2>
            <p className="mb-4 text-base leading-relaxed text-muted-foreground">
              Stuffed Happiness Hub started with a simple idea - to make gifting more meaningful. In a world full of ordinary products, we wanted to create something that truly connects people emotionally.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              From college friendships to long-distance relationships, we understand how important small gestures can be. That is why every product we offer is carefully selected to express love, care, and warmth.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-bold sm:text-3xl">What Makes Us Special</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {specialCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 text-2xl">{card.icon}</div>
                <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-pink-100 bg-linear-to-r from-[#fff2f7] to-[#fff8fb] p-8 text-center shadow-sm sm:p-10"
          >
            <h2 className="mb-5 text-2xl font-bold sm:text-3xl">Made For Every Special Person</h2>

            <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
              {audienceTags.map((tag) => (
                <span key={tag} className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-foreground">
                  {tag}
                </span>
              ))}
            </div>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              No matter who you are gifting, we help you find the perfect surprise.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl font-bold sm:text-3xl">Why People Love Us</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {trustHighlights.map((item, index) => (
              <motion.div
                key={item}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-2xl border border-pink-100 bg-white p-5 text-center text-sm font-medium shadow-sm sm:text-base"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 pb-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-pink-100 bg-linear-to-r from-[#ffd5e4] via-[#ffc6dc] to-[#ffb8d3] p-8 shadow-md sm:p-12"
          >
            <h2 className="mb-5 text-3xl font-bold text-foreground sm:text-4xl">Ready to Make Someone Smile?</h2>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-primary to-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Explore Gifts
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
