import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  Tag, 
  PhoneCall, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { AbandonedCart } from '../../types';
import { api } from '../../services/api';

interface AbandonedCartsTabProps {
  darkMode: boolean;
  whatsappConciergeNumber?: string;
}

export const AbandonedCartsTab: React.FC<AbandonedCartsTabProps> = ({
  darkMode,
}) => {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'recovered'>('pending');
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadCarts = async () => {
    setLoading(true);
    try {
      const data = await api.getAbandonedCarts();
      setCarts(data);
    } catch (e) {
      console.warn('Failed to fetch abandoned carts', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCarts();
  }, []);

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleMarkRecovered = async (id: string) => {
    const ok = await api.recoverAbandonedCart(id);
    if (ok) {
      setCarts(prev => prev.map(c => c.id === id ? { ...c, recovered: true } : c));
      showToast('Cart marked as recovered successfully!');
    }
  };

  const handleDeleteCart = async (id: string) => {
    if (!window.confirm('Dismiss this abandoned cart record?')) return;
    const ok = await api.deleteAbandonedCart(id);
    if (ok) {
      setCarts(prev => prev.filter(c => c.id !== id));
      showToast('Abandoned cart record dismissed');
    }
  };

  const handleSendWhatsAppRecovery = (cart: AbandonedCart) => {
    if (!cart.customerPhone) {
      alert('No customer phone recorded for this session.');
      return;
    }

    const cleanNumber = cart.customerPhone.replace(/\D/g, '');
    const intlNumber = cleanNumber.startsWith('92') 
      ? cleanNumber 
      : `92${cleanNumber.replace(/^0/, '')}`;

    const itemsSummary = cart.items.map(i => `${i.product.title} (${i.selectedSize || 'Standard'})`).join(', ');
    const code = cart.recoveryDiscountCode || 'COMEBACK10';

    const message = encodeURIComponent(
      `Assalam-o-Alaikum ${cart.customerName || 'Valued Customer'}! 🌸\n\n` +
      `We noticed you were browsing our handmade kids collection at Bachpan PK and left:\n` +
      `👗 ${itemsSummary}\n` +
      `Total: Rs. ${cart.subtotal.toLocaleString()}\n\n` +
      `We have reserved your sizing! Use VIP perk code *${code}* today to get 10% OFF + Complimentary Express Delivery right to your doorstep anywhere in Pakistan.\n\n` +
      `Would you like us to confirm your order via Cash on Delivery (COD)? Just reply 'YES' with your address!`
    );

    window.open(`https://wa.me/${intlNumber}?text=${message}`, '_blank');
  };

  const filteredCarts = carts.filter(c => {
    if (filter === 'pending' && c.recovered) return false;
    if (filter === 'recovered' && !c.recovered) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = (c.customerName || '').toLowerCase().includes(q);
      const matchPhone = (c.customerPhone || '').includes(q);
      const matchCity = (c.city || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchCity;
    }
    return true;
  });

  const totalLostRevenue = carts
    .filter(c => !c.recovered)
    .reduce((sum, c) => sum + (c.subtotal || 0), 0);

  const totalRecoveredRevenue = carts
    .filter(c => c.recovered)
    .reduce((sum, c) => sum + (c.subtotal || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Toast Alert */}
      {actionMessage && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 rounded-sm text-xs flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="cursor-pointer font-bold">×</button>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Abandoned Sessions */}
        <div className={`p-5 rounded-sm border ${
          darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
              Incomplete Sessions
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold">
              {carts.filter(c => !c.recovered).length}
            </span>
            <span className="text-xs text-neutral-500">pending recovery</span>
          </div>
        </div>

        {/* Recoverable Revenue */}
        <div className={`p-5 rounded-sm border ${
          darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
              Recoverable Value
            </span>
            <DollarSign className="w-4 h-4 text-[#C89299]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#C89299]">
              Rs. {totalLostRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Recovered Value */}
        <div className={`p-5 rounded-sm border ${
          darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
              Recovered Revenue
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-600">
              Rs. {totalRecoveredRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 font-medium">
              ({carts.filter(c => c.recovered).length} carts)
            </span>
          </div>
        </div>

      </div>

      {/* Control Bar: Filters & Search */}
      <div className={`p-4 rounded-sm border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
        darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-2xs'
      }`}>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['pending', 'all', 'recovered'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-[#C89299] text-white shadow-2xs'
                  : (darkMode ? 'text-neutral-400 hover:text-white bg-neutral-800' : 'text-neutral-600 hover:text-black bg-neutral-100')
              }`}
            >
              {tab === 'pending' ? 'Pending Recovery' : tab === 'all' ? 'All Sessions' : 'Recovered'}
            </button>
          ))}
          
          <button
            onClick={loadCarts}
            className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
              darkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
            }`}
            title="Refresh abandoned carts"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search name, phone, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`pl-9 pr-3 py-1.5 text-xs rounded-xs border w-full sm:w-64 ${
              darkMode 
                ? 'bg-neutral-950 border-neutral-700 text-white placeholder-neutral-500' 
                : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
            }`}
          />
        </div>
      </div>

      {/* Abandoned Carts Table / Card Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-neutral-400">
          Loading incomplete checkout sessions...
        </div>
      ) : filteredCarts.length === 0 ? (
        <div className={`p-12 text-center border rounded-sm ${
          darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-400' : 'bg-white border-neutral-200 text-neutral-500'
        }`}>
          <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C89299]" />
          <p className="font-serif text-base">No abandoned carts found</p>
          <p className="text-xs font-light mt-1 text-neutral-400">All customer sessions are either checked out or up to date.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCarts.map((cart) => {
            const timeAgo = (() => {
              const diffMs = Date.now() - new Date(cart.lastActive).getTime();
              const mins = Math.floor(diffMs / 60000);
              if (mins < 60) return `${mins}m ago`;
              const hrs = Math.floor(mins / 60);
              if (hrs < 24) return `${hrs}h ago`;
              return `${Math.floor(hrs / 24)}d ago`;
            })();

            return (
              <div
                key={cart.id}
                className={`p-4 sm:p-5 border rounded-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  cart.recovered
                    ? (darkMode ? 'bg-neutral-900/40 border-neutral-800/60 opacity-70' : 'bg-neutral-50/70 border-neutral-200/60 opacity-80')
                    : (darkMode ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700' : 'bg-white border-neutral-200 shadow-2xs hover:border-neutral-300')
                }`}
              >
                {/* Left: Customer & Items Preview */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                      {cart.customerName || 'Guest Visitor'}
                    </span>
                    {cart.customerPhone && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded-2xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {cart.customerPhone}
                      </span>
                    )}
                    <span className="text-xs text-neutral-400">· {cart.city || 'Pakistan'}</span>
                    
                    <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400">
                      <Clock className="w-3 h-3" />
                      {timeAgo}
                    </span>

                    {cart.recovered ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Recovered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Outfits in cart */}
                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {cart.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 shrink-0 bg-neutral-100/70 dark:bg-neutral-800/70 p-1.5 rounded-xs border border-neutral-200/50 dark:border-neutral-700/50">
                        <img 
                          src={item.product?.imageUrl} 
                          alt={item.product?.title} 
                          className="w-8 h-10 object-cover rounded-2xs" 
                        />
                        <div className="text-[11px] max-w-[160px] truncate">
                          <p className="font-medium truncate">{item.product?.title}</p>
                          <p className="text-[9px] text-neutral-400">Size: {item.selectedSize || 'Std'} · Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {cart.notes && (
                    <p className="text-[11px] text-neutral-400 italic">
                      Note: {cart.notes}
                    </p>
                  )}
                </div>

                {/* Right: Cart Value & Action Triggers */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-end lg:items-center gap-3 shrink-0">
                  <div className="text-left sm:text-right md:text-left lg:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Total Cart Value</span>
                    <span className="font-serif text-lg font-bold text-[#C89299]">
                      Rs. {cart.subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* One-Click WhatsApp Recovery */}
                    <button
                      type="button"
                      onClick={() => handleSendWhatsAppRecovery(cart)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      title="Send WhatsApp recovery reminder with 10% coupon"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp Recovery</span>
                    </button>

                    {/* Mark Recovered */}
                    {!cart.recovered && (
                      <button
                        type="button"
                        onClick={() => handleMarkRecovered(cart.id)}
                        className={`p-2 rounded-xs border transition-colors cursor-pointer ${
                          darkMode ? 'border-neutral-700 hover:bg-neutral-800 text-neutral-300' : 'border-neutral-300 hover:bg-neutral-100 text-neutral-700'
                        }`}
                        title="Mark as Recovered"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </button>
                    )}

                    {/* Dismiss / Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteCart(cart.id)}
                      className={`p-2 rounded-xs border transition-colors cursor-pointer ${
                        darkMode ? 'border-neutral-700 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400' : 'border-neutral-300 hover:bg-rose-50 text-neutral-400 hover:text-rose-600'
                      }`}
                      title="Dismiss Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
