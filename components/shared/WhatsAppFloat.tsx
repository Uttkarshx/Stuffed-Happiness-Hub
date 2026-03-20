'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const phone = '919999999999';
  const message = encodeURIComponent('Hi, I want to order this cute product 🧸');
  const link = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-transform duration-300 hover:scale-110 lg:bottom-8"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
      <MessageCircle className="relative" size={26} />
    </a>
  );
}
