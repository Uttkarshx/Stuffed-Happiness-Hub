'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <article className="card-soft flex gap-4 p-4 sm:p-5">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="line-clamp-2 font-semibold text-foreground">{item.name}</h3>
        <p className="text-sm font-semibold text-primary">{formatPrice(item.price)}</p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center rounded-full border border-border bg-white px-1.5 py-1">
            <button onClick={onDecrease} className="rounded-full p-1.5 transition hover:bg-muted" aria-label="Decrease quantity">
              <Minus size={16} />
            </button>
            <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
            <button onClick={onIncrease} className="rounded-full p-1.5 transition hover:bg-muted" aria-label="Increase quantity">
              <Plus size={16} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm font-bold text-foreground">{formatPrice(item.price * item.quantity)}</p>
            <button onClick={onRemove} className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50" aria-label="Remove item">
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
