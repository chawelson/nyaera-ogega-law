'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Shield, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LicenseData {
  id: number;
  version: string;
  title: string;
  content: string;
  isActive: boolean;
}

function LicenseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [license, setLicense] = useState<LicenseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  useEffect(() => {
    async function fetchLicense() {
      try {
        const res = await fetch('/api/license');
        const data = await res.json();
        setLicense(data);
      } catch (err) {
        console.error('Failed to fetch license:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLicense();
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setScrolledToBottom(true);
    }
  };

  const handleAccept = async () => {
    if (!token) {
      setError('No download token found. Please use the link from your email.');
      return;
    }

    setAccepting(true);
    setError('');

    try {
      const res = await fetch('/api/license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to accept license');
      }

      setAccepted(true);

      // Redirect to download after a brief moment
      setTimeout(() => {
        window.location.href = data.downloadUrl;
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7ff] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="mx-auto text-[#2e3192] animate-spin mb-4" />
          <p className="text-slate-500">Loading license agreement...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#f6f7ff] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex items-center justify-center size-20 rounded-full bg-red-100 mx-auto mb-6">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[#090d3f] mb-2">Invalid Access</h1>
          <p className="text-slate-500 mb-6">
            No download token was provided. Please use the download link from your purchase receipt email.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2e3192] px-6 py-3 text-sm font-bold text-white hover:bg-[#ab812b] transition-colors"
          >
            <ArrowLeft size={16} />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-[#f6f7ff] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="flex items-center justify-center size-20 rounded-full bg-emerald-100 mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-emerald-600" />
          </motion.div>
          <h1 className="font-display text-2xl font-bold text-[#090d3f] mb-2">License Accepted!</h1>
          <p className="text-slate-500">
            Your download will begin shortly...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="relative isolate overflow-hidden bg-[#090d3f] py-16 md:py-20 text-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#090d3f] via-[#1a1d6e] to-[#2e3192]" />
        <div className="site-container">
          <nav className="mb-6 flex items-center gap-2 text-sm font-medium">
            <Link href="/" className="text-white/70 hover:text-[#ab812b] transition-colors">
              Home
            </Link>
            <span className="text-white/30 select-none">{'>'}</span>
            <span className="text-white">License Agreement</span>
          </nav>

          <div className="max-w-3xl">
            <div className="mb-6 inline-flex rounded border border-[#ab812b]/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#f0c675] backdrop-blur">
              <Shield size={14} className="mr-2" />
              Legal
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
              {license?.title || 'End User License Agreement'}
            </h1>
            <p className="mt-4 text-white/80">
              Please read and accept the terms below to download your document.
            </p>
          </div>
        </div>
      </section>

      {/* License Content */}
      <section className="bg-[#f6f7ff] py-12 md:py-16">
        <div className="site-container">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {/* Version badge */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <FileText size={16} />
                  Version {license?.version || '1.0'}
                </div>
              </div>

              {/* Scrollable content */}
              <div
                className="p-6 md:p-8 max-h-[60vh] overflow-y-auto prose prose-sm max-w-none"
                onScroll={handleScroll}
              >
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
                  {license?.content || 'Loading...'}
                </pre>
              </div>

              {/* Accept button */}
              <div className="px-6 py-5 border-t border-slate-100 bg-slate-50">
                {error && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button
                    onClick={handleAccept}
                    disabled={!scrolledToBottom || accepting}
                    className={`w-full sm:w-auto rounded-xl py-5 px-8 font-bold transition-all duration-200 ${
                      scrolledToBottom
                        ? 'bg-[#2e3192] text-white hover:bg-[#ab812b]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {accepting ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} className="mr-2" />
                        I Accept & Download
                      </>
                    )}
                  </Button>

                  {!scrolledToBottom && (
                    <p className="text-xs text-slate-400">
                      Please scroll through the entire agreement to enable acceptance
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function LicensePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f6f7ff] flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={40} className="mx-auto text-[#2e3192] animate-spin mb-4" />
            <p className="text-slate-500">Loading...</p>
          </div>
        </div>
      }
    >
      <LicenseContent />
    </Suspense>
  );
}
