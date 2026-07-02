'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export default function MyPurchasesPage() {
  const { purchases, totalSpent } = useCart();
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  const handleDownload = (slug: string, id: string) => {
    setDownloading((prev) => ({ ...prev, [id]: true }));
    // Simulate download delay
    setTimeout(() => {
      window.open(`/documents/${slug}`, '_blank');
      setDownloading((prev) => ({ ...prev, [id]: false }));
    }, 500);
  };

  const completedCount = purchases.filter((p) => p.status === 'Completed').length;

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
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              My Purchases
            </h1>
            <p className="mt-4 text-lg text-white/80">
              View your document purchase history and download your files.
            </p>
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
                value: formatPrice(totalSpent),
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
                No purchases yet
              </h2>
              <p className="mt-3 text-slate-500 max-w-md">
                You haven{'\''}t purchased any documents yet. Browse our marketplace to find the legal documents you need.
              </p>
              <Link
                href="/documents"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2e3192] px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#ab812b]"
              >
                Browse Marketplace <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase, index) => {
                const status = statusConfig[purchase.status] || statusConfig.Pending;
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
                            {formatDate(purchase.date)}
                          </span>
                        </div>
                        <h3 className="font-display text-base font-bold text-[#2e3192] truncate">
                          {purchase.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {purchase.category} · {purchase.phone}
                        </p>
                      </div>

                      {/* Price + Download */}
                      <div className="flex items-center gap-4 sm:text-right">
                        <div className="text-right">
                          <p className="font-display text-lg font-bold text-[#ab812b]">
                            {formatPrice(purchase.price)}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {purchase.transactionId}
                          </p>
                        </div>

                        {purchase.status === 'Completed' && (
                          <Button
                            onClick={() => handleDownload(purchase.slug, purchase.id)}
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
