'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  X,
  Trash2,
  ArrowRight,
  CreditCard,
  ShoppingBag,
  Phone,
  Mail,
  User,
  CheckCircle,
  Loader2,
  AlertCircle,
  Download,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart, type CartItem } from '@/lib/cart-context';

// ── Format price ────────────────────────────────────────────────────
function formatPrice(price: number): string {
  return `KES ${price.toLocaleString('en-KE')}`;
}

// ── Validate Kenyan phone ───────────────────────────────────────────
function isValidKenyanPhone(phone: string): boolean {
  return /^2547\d{8}$/.test(phone);
}

// ── Validate email ──────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Cart Drawer ─────────────────────────────────────────────────────
interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, clearCart, total, itemCount, addPurchase } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [purchaseResults, setPurchaseResults] = useState<Array<{ documentTitle: string; downloadUrl: string }>>([]);
  const [checkoutRequestIds, setCheckoutRequestIds] = useState<string[]>([]);
  const [pollCount, setPollCount] = useState(0);
  const [showMpesaPrompt, setShowMpesaPrompt] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaAmount, setMpesaAmount] = useState(0);
  const [mpesaCheckoutId, setMpesaCheckoutId] = useState('');
  const [mpesaMerchantId, setMpesaMerchantId] = useState('');
  const [pollingTimeout, setPollingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [stkError, setStkError] = useState('');
  const [stkRetryCount, setStkRetryCount] = useState(0);

  // Reset checkout state when drawer closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setShowCheckout(false);
        setEmail('');
        setPhone('');
        setName('');
        setEmailError('');
        setPhoneError('');
        setPaymentState('idle');
        setPurchasedItems([]);
        setErrorMessage('');
        setPurchaseResults([]);
      }, 300);
    }
  }, [open]);

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setShowCheckout(true);
  };

  const handlePay = async () => {
    // Validate email
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    // Validate phone
    if (!phone.trim()) {
      setPhoneError('Please enter your M-Pesa phone number');
      return;
    }
    if (!isValidKenyanPhone(phone)) {
      setPhoneError('Enter a valid Safaricom number: 2547XXXXXXXX');
      return;
    }
    setPhoneError('');

    // Start payment
    setPaymentState('processing');
    setPurchasedItems([...items]);
    setErrorMessage('');

    try {
      // Call the checkout API
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
          })),
          email: email.trim(),
          phone: phone.trim(),
          name: name.trim() || email.split('@')[0],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      setPurchaseResults(data.purchases || []);
      setPaymentState('success');

      // Record purchases locally
      items.forEach((item) => {
        addPurchase({
          documentId: item.id,
          title: item.title,
          slug: item.slug,
          category: item.category,
          price: item.price,
          status: 'Completed',
          phone: phone,
        });
      });

      clearCart();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setPaymentState('error');
    }
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
    setEmail('');
    setPhone('');
    setName('');
    setEmailError('');
    setPhoneError('');
    setPaymentState('idle');
    setPurchasedItems([]);
    setErrorMessage('');
    setPurchaseResults([]);
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart size={22} className="text-[#2e3192]" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center size-4 rounded-full bg-[#ab812b] text-[10px] font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-lg font-bold text-[#090d3f]">
                  {showCheckout ? 'Checkout' : 'Shopping Cart'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center size-9 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col h-[calc(100%-73px)]">
              {!showCheckout ? (
                /* ── CART VIEW ── */
                <>
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="flex items-center justify-center size-20 rounded-full bg-slate-100 mb-4">
                          <ShoppingBag size={32} className="text-slate-300" />
                        </div>
                        <h3 className="font-display text-lg font-bold text-slate-700">Your cart is empty</h3>
                        <p className="mt-2 text-sm text-slate-500 max-w-xs">
                          Browse our document marketplace and add items to your cart.
                        </p>
                        <Button
                          onClick={onClose}
                          className="mt-6 bg-[#2e3192] text-white hover:bg-[#ab812b]"
                        >
                          Browse Documents
                        </Button>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="group flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 mb-3 hover:border-slate-200 hover:shadow-sm transition-all"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#2e3192] line-clamp-1">
                                {item.title}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">{item.category}</p>
                              <div className="mt-2 flex items-center gap-3">
                                <span className="font-display text-sm font-bold text-[#ab812b]">
                                  {formatPrice(item.price)}
                                </span>
                                {item.quantity > 1 && (
                                  <span className="text-xs text-slate-400">× {item.quantity}</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex items-center justify-center size-8 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                              aria-label={`Remove ${item.title}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>

                  {/* Footer with total + checkout */}
                  {items.length > 0 && (
                    <div className="border-t border-slate-100 px-6 py-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Subtotal</span>
                        <span className="font-display text-xl font-bold text-[#090d3f]">
                          {formatPrice(total)}
                        </span>
                      </div>
                      <Button
                        onClick={handleProceedToCheckout}
                        size="lg"
                        className="w-full bg-[#2e3192] text-white hover:bg-[#ab812b] transition-all duration-200 rounded-xl py-6 font-bold"
                      >
                        Proceed to Checkout
                        <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                /* ── CHECKOUT VIEW ── */
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {paymentState === 'idle' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Guest Checkout Notice */}
                      <div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
                        <div className="flex items-start gap-3">
                          <User size={18} className="text-blue-600 mt-0.5 shrink-0" />
                          <div>
                            <h3 className="text-sm font-bold text-blue-800">Guest Checkout</h3>
                            <p className="text-xs text-blue-600 mt-1">
                              No account required. Enter your email and M-Pesa phone number to purchase.
                              Your receipt and download link will be sent to your email.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="mb-6">
                        <h3 className="font-display text-base font-bold text-[#090d3f] mb-3">
                          Order Summary
                        </h3>
                        <div className="space-y-2">
                          {purchasedItems.length > 0
                            ? purchasedItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-700 truncate">
                                      {item.title}
                                    </p>
                                    <p className="text-xs text-slate-500">{item.category}</p>
                                  </div>
                                  <span className="ml-4 font-display text-sm font-bold text-[#ab812b] whitespace-nowrap">
                                    {formatPrice(item.price)}
                                  </span>
                                </div>
                              ))
                            : items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-700 truncate">
                                      {item.title}
                                    </p>
                                    <p className="text-xs text-slate-500">{item.category}</p>
                                  </div>
                                  <span className="ml-4 font-display text-sm font-bold text-[#ab812b] whitespace-nowrap">
                                    {formatPrice(item.price)}
                                  </span>
                                </div>
                              ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                          <span className="text-sm font-semibold text-slate-700">Total</span>
                          <span className="font-display text-lg font-bold text-[#090d3f]">
                            {formatPrice(total)}
                          </span>
                        </div>
                      </div>

                      {/* Name (optional) */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Your Name <span className="text-slate-400">(optional)</span>
                        </label>
                        <div className="relative">
                          <User
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <Input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-5 text-base focus:border-[#ab812b]/60 focus:ring-[#ab812b]/30"
                          />
                        </div>
                      </div>

                      {/* Email Input */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailError('');
                            }}
                            className={`w-full rounded-xl border pl-10 pr-4 py-5 text-base ${
                              emailError
                                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                                : 'border-slate-200 focus:border-[#ab812b]/60 focus:ring-[#ab812b]/30'
                            }`}
                          />
                        </div>
                        {emailError && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                            <AlertCircle size={12} />
                            {emailError}
                          </p>
                        )}
                        <p className="mt-1.5 text-xs text-slate-400">
                          Your receipt and download link will be sent here.
                        </p>
                      </div>

                      {/* Phone Input */}
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          M-Pesa Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <Input
                            type="tel"
                            placeholder="2547XXXXXXXX"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value.replace(/\D/g, ''));
                              setPhoneError('');
                            }}
                            className={`w-full rounded-xl border pl-10 pr-4 py-5 text-base ${
                              phoneError
                                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                                : 'border-slate-200 focus:border-[#ab812b]/60 focus:ring-[#ab812b]/30'
                            }`}
                          />
                        </div>
                        {phoneError && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                            <AlertCircle size={12} />
                            {phoneError}
                          </p>
                        )}
                        <p className="mt-1.5 text-xs text-slate-400">
                          Enter your Safaricom number to receive the M-Pesa prompt.
                        </p>
                      </div>

                      {/* Pay Button */}
                      <Button
                        onClick={handlePay}
                        size="lg"
                        className="w-full bg-[#1f7a1f] text-white hover:bg-[#166016] transition-all duration-200 rounded-xl py-6 font-bold text-base"
                      >
                        <CreditCard size={20} className="mr-2" />
                        Pay with M-Pesa
                      </Button>

                      <button
                        onClick={handleBackToCart}
                        className="mt-3 w-full text-center text-sm text-slate-500 hover:text-[#2e3192] transition-colors"
                      >
                        ← Back to Cart
                      </button>
                    </motion.div>
                  )}

                  {/* ── PROCESSING STATE ── */}
                  {paymentState === 'processing' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center h-full text-center py-12"
                    >
                      <div className="relative mb-6">
                        <div className="flex items-center justify-center size-24 rounded-full bg-[#1f7a1f]/10">
                          <Loader2 size={40} className="text-[#1f7a1f] animate-spin" />
                        </div>
                      </div>
                      <h3 className="font-display text-xl font-bold text-[#090d3f]">
                        Processing Payment...
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 max-w-xs">
                        Please check your phone and enter your M-Pesa PIN to complete the payment.
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-[#ab812b] animate-pulse" />
                          <span className="size-1.5 rounded-full bg-[#ab812b] animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <span className="size-1.5 rounded-full bg-[#ab812b] animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                        Processing payment...
                      </div>
                    </motion.div>
                  )}

                  {/* ── SUCCESS STATE ── */}
                  {paymentState === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center h-full text-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                        className="flex items-center justify-center size-24 rounded-full bg-emerald-100 mb-6"
                      >
                        <CheckCircle size={48} className="text-emerald-600" />
                      </motion.div>
                      <h3 className="font-display text-xl font-bold text-[#090d3f]">
                        Payment Successful!
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 max-w-xs">
                        Your documents are ready. A receipt with download links has been sent to{' '}
                        <strong className="text-slate-700">{email}</strong>.
                      </p>

                      <div className="mt-6 w-full space-y-3">
                        {purchaseResults.length > 0 ? (
                          purchaseResults.map((result, i) => (
                            <Button
                              key={i}
                              onClick={() => handleDownload(result.downloadUrl)}
                              variant="outline"
                              className="w-full justify-between border-[#ab812b]/30 text-[#2e3192] hover:bg-[#ab812b]/5 hover:border-[#ab812b] rounded-xl py-5"
                            >
                              <span className="truncate text-sm font-semibold">{result.documentTitle}</span>
                              <span className="flex items-center gap-1 text-xs text-[#ab812b] font-bold ml-2">
                                <Download size={14} />
                                Download
                              </span>
                            </Button>
                          ))
                        ) : (
                          purchasedItems.map((item) => (
                            <Button
                              key={item.id}
                              onClick={() => handleDownload(`/documents/${item.slug}`)}
                              variant="outline"
                              className="w-full justify-between border-[#ab812b]/30 text-[#2e3192] hover:bg-[#ab812b]/5 hover:border-[#ab812b] rounded-xl py-5"
                            >
                              <span className="truncate text-sm font-semibold">{item.title}</span>
                              <span className="flex items-center gap-1 text-xs text-[#ab812b] font-bold ml-2">
                                <Download size={14} />
                                Download
                              </span>
                            </Button>
                          ))
                        )}
                      </div>

                      <p className="mt-4 text-xs text-slate-400">
                        <ExternalLink size={12} className="inline mr-1" />
                        Check your email for the receipt and download link.
                      </p>

                      <Button
                        onClick={onClose}
                        className="mt-4 bg-[#2e3192] text-white hover:bg-[#ab812b] rounded-xl py-5"
                      >
                        Continue Shopping
                      </Button>
                    </motion.div>
                  )}

                  {/* ── ERROR STATE ── */}
                  {paymentState === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center h-full text-center py-12"
                    >
                      <div className="flex items-center justify-center size-24 rounded-full bg-red-100 mb-6">
                        <AlertCircle size={48} className="text-red-500" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-[#090d3f]">
                        Payment Failed
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 max-w-xs">
                        {errorMessage || 'Something went wrong. Please try again.'}
                      </p>
                      <Button
                        onClick={() => setPaymentState('idle')}
                        className="mt-6 bg-[#2e3192] text-white hover:bg-[#ab812b] rounded-xl py-5"
                      >
                        Try Again
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
