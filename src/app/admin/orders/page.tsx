'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  ExternalLink,
  RefreshCw,
  Download,
  Shield,
  Zap,
  Rocket,
  User,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ── Types ───────────────────────────────────────────────────────────
interface Purchase {
  id: number;
  documentId: number;
  document: { title: string; category: string; slug: string };
  userEmail: string | null;
  userPhone: string;
  amount: number;
  checkoutId: string;
  status: string;
  documentStatus: string;
  clientInstructions: string | null;
  adminNotes: string | null;
  priority: string;
  uploadedFilePath: string | null;
  buyerName: string | null;
  downloadToken: string | null;
  tokenUsed: boolean;
  createdAt: string;
}

// ── Priority helpers ────────────────────────────────────────────────
const priorityConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  standard: {
    label: 'Standard',
    icon: <Clock size={14} />,
    color: 'text-slate-700',
    bg: 'bg-slate-100',
  },
  urgent: {
    label: 'Urgent',
    icon: <Zap size={14} />,
    color: 'text-amber-700',
    bg: 'bg-amber-100',
  },
  express: {
    label: 'Express',
    icon: <Rocket size={14} />,
    color: 'text-red-700',
    bg: 'bg-red-100',
  },
};

function formatPrice(price: number): string {
  return `KES ${price.toLocaleString('en-KE')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Admin Login ─────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check — in production, use proper auth
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      onLogin();
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d3f] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-[#ab812b]/10 mb-4">
            <Shield size={32} className="text-[#ab812b]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[#090d3f]">Admin Panel</h1>
          <p className="text-sm text-slate-500 mt-1">Enter password to access orders</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            className="w-full rounded-xl border border-slate-200 px-4 py-5 text-base focus:border-[#ab812b]/60 focus:ring-[#ab812b]/30"
          />
          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red-500">
              <AlertCircle size={12} />
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full bg-[#2e3192] text-white hover:bg-[#ab812b] rounded-xl py-5 font-bold"
          >
            Access Admin Panel
          </Button>
        </form>
      </div>
    </div>
  );
}

// ── Upload Modal ────────────────────────────────────────────────────
function UploadModal({
  purchase,
  onClose,
  onUploaded,
}: {
  purchase: Purchase;
  onClose: () => void;
  onUploaded: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    if (!file.name.endsWith('.pdf')) {
      setError('Only PDF files are allowed');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purchaseId', purchase.id.toString());
      formData.append('checkoutId', purchase.checkoutId);

      const res = await fetch('/api/admin/upload-document', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess(`Document uploaded successfully! Path: ${data.path}`);
      onUploaded();
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-[#090d3f]">Upload Draft Document</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-slate-50 text-sm">
          <p className="font-semibold text-slate-700">{purchase.document.title}</p>
          <p className="text-xs text-slate-500 mt-1">
            Order #{purchase.checkoutId.slice(0, 8)} — {purchase.buyerName || purchase.userEmail}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Draft PDF File
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-[#ab812b]/40 transition-colors">
            {file ? (
              <div className="space-y-2">
                <FileText size={32} className="mx-auto text-[#2e3192]" />
                <p className="text-sm font-medium text-slate-700">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  onClick={() => setFile(null)}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-[#2e3192]">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-400 mt-1">PDF files only</p>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-red-500 mb-3">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
        {success && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-600 mb-3">
            <CheckCircle size={12} />
            {success}
          </p>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-[#2e3192] text-white hover:bg-[#ab812b] rounded-xl py-5 font-bold disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Uploading to Supabase...
            </>
          ) : (
            <>
              <Upload size={18} className="mr-2" />
              Upload to Supabase Storage
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ── Main Admin Page ─────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [uploadModalPurchase, setUploadModalPurchase] = useState<Purchase | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (res.ok) {
        setPurchases(data.purchases || []);
      }
    } catch (err) {
      console.error('Failed to fetch purchases:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      // Fetch purchases when authenticated
      const load = async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/admin/orders');
          const data = await res.json();
          if (res.ok) {
            setPurchases(data.purchases || []);
          }
        } catch (err) {
          console.error('Failed to fetch purchases:', err);
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [authenticated]);

  const filteredPurchases = purchases.filter((p) => {
    // Status filter
    if (statusFilter !== 'all' && p.documentStatus !== statusFilter) return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.document.title.toLowerCase().includes(q) ||
        p.userEmail?.toLowerCase().includes(q) ||
        p.userPhone.includes(q) ||
        p.checkoutId.toLowerCase().includes(q) ||
        p.buyerName?.toLowerCase().includes(q)
      );
    }

    return true;
  });

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-[#090d3f]">
              <Shield size={20} className="text-[#ab812b]" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-[#090d3f]">Admin — Orders</h1>
              <p className="text-xs text-slate-500">{purchases.length} total orders</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={fetchPurchases}
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-600"
            >
              <RefreshCw size={14} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => setAuthenticated(false)}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by title, email, phone, or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-5 text-base focus:border-[#ab812b]/60 focus:ring-[#ab812b]/30"
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'drafting', label: 'Drafting' },
              { value: 'completed', label: 'Completed' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  statusFilter === f.value
                    ? 'bg-[#2e3192] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 size={32} className="animate-spin mx-auto text-[#2e3192]" />
            <p className="mt-3 text-sm text-slate-500">Loading orders...</p>
          </div>
        ) : filteredPurchases.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="font-display text-lg font-bold text-slate-700">No orders found</h3>
            <p className="text-sm text-slate-500 mt-1">
              {searchQuery ? 'Try a different search term.' : 'No orders match the selected filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPurchases.map((purchase) => {
              const priority = priorityConfig[purchase.priority] || priorityConfig.standard;
              const isExpanded = expandedId === purchase.id;

              return (
                <div
                  key={purchase.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div
                    className="p-4 sm:p-6 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : purchase.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[#2e3192] truncate">
                            {purchase.document.title}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${priority.bg} ${priority.color}`}>
                            {priority.icon}
                            {priority.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {purchase.buyerName || purchase.userEmail?.split('@')[0] || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail size={12} />
                            {purchase.userEmail || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={12} />
                            {purchase.userPhone}
                          </span>
                          <span className="font-mono text-[10px]">
                            #{purchase.checkoutId.slice(0, 8)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                            purchase.documentStatus === 'completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : purchase.documentStatus === 'drafting'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {purchase.documentStatus === 'completed' ? (
                            <CheckCircle size={14} />
                          ) : purchase.documentStatus === 'drafting' ? (
                            <Clock size={14} />
                          ) : (
                            <AlertCircle size={14} />
                          )}
                          {purchase.documentStatus}
                        </span>

                        <span className="font-display text-lg font-bold text-[#ab812b]">
                          {formatPrice(purchase.amount)}
                        </span>

                        {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 px-4 sm:px-6 py-4 space-y-4">
                      {/* Client Instructions */}
                      {purchase.clientInstructions && (
                        <div>
                          <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            <MessageSquare size={12} />
                            Client Instructions
                          </h4>
                          <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                            {purchase.clientInstructions}
                          </p>
                        </div>
                      )}

                      {/* Uploaded File Status */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Draft Document
                          </h4>
                          {purchase.uploadedFilePath ? (
                            <p className="flex items-center gap-1.5 text-sm text-emerald-600">
                              <CheckCircle size={14} />
                              Uploaded to Supabase
                              <code className="text-[10px] text-slate-500 ml-1">
                                ({purchase.uploadedFilePath})
                              </code>
                            </p>
                          ) : (
                            <p className="flex items-center gap-1.5 text-sm text-amber-600">
                              <AlertCircle size={14} />
                              Not yet uploaded
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadModalPurchase(purchase);
                          }}
                          size="sm"
                          className="bg-[#2e3192] text-white hover:bg-[#ab812b] rounded-lg"
                        >
                          <Upload size={14} className="mr-1.5" />
                          {purchase.uploadedFilePath ? 'Re-upload' : 'Upload Draft'}
                        </Button>
                      </div>

                      {/* Order Meta */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500">
                        <div>
                          <span className="font-semibold text-slate-700">Order Date</span>
                          <p>{formatDate(purchase.createdAt)}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">Category</span>
                          <p>{purchase.document.category}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">Token Used</span>
                          <p>{purchase.tokenUsed ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">Download Token</span>
                          <p className="font-mono text-[10px] truncate">
                            {purchase.downloadToken || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalPurchase && (
        <UploadModal
          purchase={uploadModalPurchase}
          onClose={() => setUploadModalPurchase(null)}
          onUploaded={fetchPurchases}
        />
      )}
    </div>
  );
}
