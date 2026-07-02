'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface PreviewPageClientProps {
  id: number;
  title: string;
  slug: string;
  category: string;
  price: number;
}

export function PreviewPageClient({ id, title, slug, category, price }: PreviewPageClientProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem({ id, title, slug, category, price });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-lg shadow-2xl shadow-black/10 md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#ab812b]">KES</span>
          <span className="font-display text-xl font-bold text-[#2e3192]">
            {price.toLocaleString('en-KE')}
          </span>
        </div>
        <button
          onClick={handleClick}
          className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
            added
              ? 'bg-emerald-500 text-white'
              : 'bg-[#2e3192] text-white hover:bg-[#ab812b]'
          }`}
        >
          {added ? (
            <>
              <Check size={16} />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
