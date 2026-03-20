'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const options = [
  'Track my order',
  'Product info',
  'Delivery time',
  'Talk to support',
];

export default function ChatbotFloat() {
  const [open, setOpen] = useState(false);

  const openWhatsApp = (topic: string) => {
    const text = encodeURIComponent(`Hi, I need help with: ${topic}`);
    window.open(`https://wa.me/9310457312?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-6">
      {open && (
        <div className="mb-3 w-72 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_16px_36px_rgba(255,111,145,0.18)]">
          <div className="bg-linear-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-white">
            Stuffed Assistant 💬
          </div>
          <div className="space-y-2 p-3">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => openWhatsApp(option)}
                className="w-full rounded-xl border border-border bg-muted/35 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-primary/10"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open support chatbot"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_10px_26px_rgba(255,111,145,0.45)] transition-transform duration-300 hover:scale-105"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/35" />
        {open ? <X className="relative" size={24} /> : <MessageCircle className="relative" size={24} />}
      </button>
    </div>
  );
}
