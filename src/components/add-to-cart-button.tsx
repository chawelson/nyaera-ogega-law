'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';

interface AddToCartButtonProps {
  id: number;
  title: string;
  slug: string;
  category: string;
  price: number;
  variant?: 'card' | 'preview';
}

export function AddToCartButton({ id, title, slug, category, price, variant = 'card' }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem({ id, title, slug, category, price });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (variant === 'preview') {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          onClick={handleClick}
          size="lg"
          className={`transition-all duration-200 cursor-pointer ${
            added
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-[#2e3192] text-white hover:bg-[#ab812b]'
          }`}
        >
          {added ? (
            <>
              <Check size={16} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart — KES {price.toLocaleString('en-KE')}
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="lg"
          asChild
          className="border-slate-300 text-slate-700 hover:bg-slate-100"
        >
          <a href="/documents">
            <ArrowLeft size={16} />
            Back to Documents
          </a>
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
        added
          ? 'bg-emerald-500 text-white'
          : 'bg-[#2e3192] text-white hover:bg-[#ab812b]'
      }`}
    >
      {added ? (
        <>
          <Check size={14} />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart size={14} />
          Add to Cart
        </>
      )}
    </button>
  );
}
