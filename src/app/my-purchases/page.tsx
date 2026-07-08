'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  FileText,
  TrendingUp,
  Award,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCart, type PurchaseRecord } from '@/lib/cart-context';

function formatPrice(price: number): string {
  return `KES ${price.toLocaleString('en-KE')}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
  Completed: {
    icon: <CheckCircle size={14} />,
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  Pending: {
    icon: <Clock size={14} />,
    label: 'Pending',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  Failed: {
    icon: <XCircle size={14} />,
    label: 'Failed',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
};

// ── API Purchase type ───────────────────────────────────────────────
interface ApiPurchase {
  id: string;
  documentId: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  date: string;
  status: string;
  phone: string;
  email: string;
  transactionId: string;
  downloadToken: string | null;
  tokenExpiry: string | null;
  tokenUsed: boolean;
  licenseAccepted: boolean;
  uploadedFilePath: string | null;
  documentStatus: string;
  downloadCount: number;
  maxDownloads: number;
}

export default function MyPurchasesPage() {
  const { purchases: localPurchases, totalSpent } = useCart();
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  // ── Email verification state ──────────────────────────────────────
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [apiPurchases, setApiPurchases] = useState<ApiPurchase[]>([]);
  const [showLocalFallback, setShowLocalFallback] = useState(false);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const fetchPurchases = async (emailToFetch: string) => {
    setIsLoading(true);
    setFetchError('');

    try {
      const res = await fetch(`/api/purchases/${encodeURIComponent(emailToFetch)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch purchases');
      }

      setApiPurchases(data.purchases || []);
      setIsVerified(true);
      sessionStorage.setItem('verified_purchase_email', emailToFetch);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load purchases');
      setApiPurchases([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for previously verified email in sessionStorage
  useEffect(() => {
    const verifiedEmail = sessionStorage.getItem('verified_purchase_email');
    if (verifiedEmail) {
      // Use a microtask to avoid cascading renders in strict mode
      queueMicrotask(() => {
        setEmail(verifiedEmail);
        setIsVerified(true);
        fetchPurchases(verifiedEmail);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    await fetchPurchases(email.trim().toLowerCase());
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('verified_purchase_email');
    setIsVerified(false);
    setEmail('');
    setApiPurchases([]);
    setShowLocalFallback(false);
  };

  const handleDownload = (downloadToken: string | null, id: string) => {
    if (!downloadToken) {
      console.error('No download token available for purchase:', id);
      return;
    }
    setDownloading((prev) => ({ ...prev, [id]: true }));
    // Use the download API endpoint which validates token, watermarks, and returns the PDF
    window.open(`/api/download/${downloadToken}`, '_blank');
    setDownloading((prev) => ({ ...prev, [id]: false }));
  };

  // Determine which purchases to show
  const purchases = apiPurchases.length > 0 ? apiPurchases : showLocalFallback ? localPurchases : [];
  const completedCount = purchases.filter((p) => p.status === 'Completed').length;
  const spentTotal = apiPurchases.length > 0
    ? apiPurchases.reduce((sum, p) => sum + p.price, 0)
    : totalSpent;

  // ── Email Verification Gate ───────────────────────────────────────
  if (!isVerified) {
    return (
      <>
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-[#090d3f] py-16 md:py-20 lg:py-24 text-white">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#090d3f] via-[#1a1d6e] to-[#2e3192]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(171,129,43,0.15),transparent_50%)]" />
          <div className="site-container">
            <nav className="mb-6 flex items-center gap-2 text-sm font-medium">
              <Link href="/" className="text-white/70 hover:text-[#ab812b] transition-colors">
                Home
              </Link>
              <span className="text-white/30 select-none">{'>'}</span>
              <span className="text-white">My Purchases</span>
            </nav>
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex rounded border border-[#ab812b]/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#f0c675] backdrop-blur">
                Account
              </div>
              <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                My Purchases
              </h1>
              <p className="mt-4 text-lg text-white/80">
                Enter your email to view your document purchases and downloads.
              </p>
            </div>
          </div>
        </section>

        {/* Email Verification Form */}
        <section className="bg-[#f6f7ff] py-16 min-h-[400px]">
          <div className="site-container max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="flex items-center justify-center size-16 rounded-full bg-[#2e3192]/10 mx-auto mb-6">
                <Lock size={28} className="text-[#2e3192]" />
              </div>

              <h2 className="text-center font-display text-xl font-bold text-[#090d3f] mb-2">
                Verify Your Email
              </h2>
              <p className="text-center text-sm text-slate-500 mb-8">
                Enter the email address you used during checkout to access your purchases.
              </p>

              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
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
                        setFetchError('');
                      }}
                      className={`w-full rounded-xl border pl-10 pr-4 py-5 text-base ${
                        emailError || fetchError
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                          : 'border-slate-200 focus:border-[#ab812b]/60 focus:ring-[#ab812b]/30'
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {emailError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                      <AlertCircle size={12} />
                      {emailError}
                    </p>
                  )}
                  {fetchError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                      <AlertCircle size={12} />
                      {fetchError}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-[#2e3192] text-white hover:bg-[#ab812b] transition-all duration-200 rounded-xl py-6 font-bold text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Eye size={18} className="mr-2" />
                      View My Purchases
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-start gap-3">
                  <Lock size={16} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-blue-800">Your Privacy Matters</h3>
                    <p className="text-xs text-blue-600 mt-1">
                      We only show purchases linked to your email address. No account or password needed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Local purchases fallback */}
              {localPurchases.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-center text-xs text-slate-400 mb-3">
                    Or view purchases from this browser
                  </p>
                  <Button
                    onClick={() => {
                      setShowLocalFallback(true);
                      setIsVerified(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-200 text-slate-600 hover:text-[#2e3192] rounded-xl"
                  >
                    <ShoppingBag size={14} className="mr-2" />
                    Show Local Purchases ({localPurchases.length})
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  // ── Loading State ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="bg-[#f6f7ff] py-16 min-h-[400px]">
        <div className="site-container flex flex-col items-center justify-center py-16">
          <Loader2 size={40} className="text-[#2e3192] animate-spin mb-4" />
          <p className="text-slate-500">Loading your purchases...</p>
        </div>
      </section>
    );
  }

  // ── Main Purchases View ───────────────────────────────────────────
  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative isolate overflow-hidden bg-[#090d3f] py-16 md:py-20 lg:py-24 text-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#090d3f] via-[#1a1d6e] to-[#2e3192]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(171,129,43,0.15),transparent_50%)]" />

        <div className="site-container">
          <nav className="mb-6 flex items-center gap-2 text-sm font-medium">
            <Link href="/" className="text-white/70 hover:text-[#ab812b] transition-colors">
              Home
            </Link>
            <span className="text-white/30 select-none">{'>'}</span>
            <span className="text-white">My Purchases</span>
          </nav>

          <div className="max-w-3xl">
            <div className="mb-6 inline-flex rounded border border-[#ab812b]/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#f0c675] backdrop-blur">
              Account
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  My Purchases
                </h1>
                <p className="mt-4 text-lg text-white/80">
                  {apiPurchases.length > 0
                    ? `Showing purchases for ${email}`
                    : 'View your document purchase history and download your files.'}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="shrink-0 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/20 hover:text-white transition-all backdrop-blur"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="bg-[#f6f7ff] border-b border-slate-100">
        <div className="site-container py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <ShoppingBag size={20} className="text-[#ab812b]" />,
                label: 'Total Purchases',
                value: purchases.length,
              },
              {
                icon: <CheckCircle size={20} className="text-emerald-600" />,
                label: 'Completed',
                value: completedCount,
              },
              {
                icon: <TrendingUp size={20} className="text-[#ab812b]" />,
                label: 'Total Spent',
                value: formatPrice(spentTotal),
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-center gap-4 rounded-xl bg-white border border-slate-200 px-5 py-4 shadow-sm"
              >
                <div className="flex items-center justify-center size-12 rounded-lg bg-slate-50">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  <p className="font-display text-xl font-bold text-[#090d3f]">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PURCHASES LIST ===================== */}
      <section className="bg-[#f6f7ff] py-12 md:py-16 min-h-[400px]">
        <div className="site-container">
          {purchases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center py-16"
            >
              <div className="flex items-center justify-center size-24 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
                <ShoppingBag size={40} className="text-slate-300" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#090d3f]">
                No purchases found
              </h2>
              <p className="mt-3 text-slate-500 max-w-md">
                {apiPurchases.length === 0 && !showLocalFallback
                  ? `No purchases found for ${email}. Make sure you entered the email used during checkout.`
                  : "You haven't purchased any documents yet. Browse our marketplace to find the legal documents you need."}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/documents"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2e3192] px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#ab812b]"
                >
                  Browse Marketplace <ArrowRight size={16} />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-600 transition-all duration-200 hover:border-slate-300"
                >
                  Try Another Email
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase, index) => {
                const status = statusConfig[purchase.status] || statusConfig.Pending;
                const slug = 'slug' in purchase ? purchase.slug : '';
                const title = 'title' in purchase ? purchase.title : '';
                const category = 'category' in purchase ? purchase.category : '';
                const price = 'price' in purchase ? purchase.price : 0;
                const phone = 'phone' in purchase ? purchase.phone : '';
                const transactionId = 'transactionId' in purchase ? purchase.transactionId : '';
                const date = 'date' in purchase ? purchase.date : '';
                const downloadToken = 'downloadToken' in purchase ? purchase.downloadToken : null;
                const uploadedFilePath = 'uploadedFilePath' in purchase ? purchase.uploadedFilePath : null;
                const documentStatus = 'documentStatus' in purchase ? purchase.documentStatus : null;

                return (
                  <motion.div
                    key={purchase.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Document info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`gap-1.5 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${status.className}`}
                          >
                            {status.icon}
                            {status.label}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {formatDate(date)}
                          </span>
                        </div>
                        <h3 className="font-display text-base font-bold text-[#2e3192] truncate">
                          {title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {category} · {phone}
                        </p>
                      </div>

                      {/* Price + Download */}
                      <div className="flex items-center gap-4 sm:text-right">
                        <div className="text-right">
                          <p className="font-display text-lg font-bold text-[#ab812b]">
                            {formatPrice(price)}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {transactionId?.slice(0, 12)}
                          </p>
                        </div>

                        {purchase.status === 'Completed' && uploadedFilePath && (
                          <Button
                            onClick={() => handleDownload(downloadToken, purchase.id)}
                            disabled={downloading[purchase.id]}
                            variant="outline"
                            size="sm"
                            className="border-[#ab812b]/30 text-[#2e3192] hover:bg-[#ab812b]/5 hover:border-[#ab812b] rounded-lg"
                          >
                            {downloading[purchase.id] ? (
                              <span className="size-4 border-2 border-[#ab812b] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Download size={14} />
                            )}
                            <span className="ml-1.5 text-xs font-semibold">Download</span>
                          </Button>
                        )}

                        {purchase.status === 'Completed' && !uploadedFilePath && (
                          <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50 text-xs">
                            Document in progress
                          </Badge>
                        )}

                        {purchase.status === 'Pending' && (
                          <Badge variant="outline" className="border-amber-200 text-amber-600 bg-amber-50 text-xs">
                            Awaiting Payment
                          </Badge>
                        )}

                        {purchase.status === 'Failed' && (
                          <Badge variant="outline" className="border-red-200 text-red-600 bg-red-50 text-xs">
                            Payment Failed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      {purchases.length > 0 && (
        <section className="bg-white border-t border-slate-100 py-12">
          <div className="site-container text-center">
            <Link
              href="/documents"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2e3192] px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#ab812b]"
            >
              Browse More Documents <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
