import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ExternalLink,
  Loader2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { OrderTimelineTracker } from './OrderTimelineTracker';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
  whatsappNumber?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
  whatsappNumber = '03001234567',
}) => {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // Format WhatsApp number
  const cleanPhone = (whatsappNumber || '03001234567').replace(/\D/g, '');
  const finalWhatsApp = cleanPhone.startsWith('92') 
    ? cleanPhone 
    : (cleanPhone.startsWith('0') ? `92${cleanPhone.slice(1)}` : `92${cleanPhone}`);

  // Fetch recent orders for quick-click convenience
  useEffect(() => {
    if (isOpen) {
      api.getOrders().then((all) => {
        setRecentOrders(all.slice(0, 4));
      });
    }
  }, [isOpen]);

  // If initialOrderId provided, auto search
  useEffect(() => {
    if (initialOrderId && isOpen) {
      setOrderIdInput(initialOrderId);
      handleTrack(initialOrderId);
    }
  }, [initialOrderId, isOpen]);

  if (!isOpen) return null;

  const handleTrack = async (targetId?: string) => {
    const query = (targetId || orderIdInput).trim();
    if (!query) {
      setError('Please enter your Order ID or registered mobile number.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearched(true);

    try {
      const result = await api.getOrderById(query);
      if (result) {
        setOrder(result);
        setError(null);
      } else {
        setOrder(null);
        setError(`No active order found with reference "${query}". Please verify your Order ID (e.g. BP-1001) or contact our concierge.`);
      }
    } catch {
      setError('Unable to fetch tracking status at this time. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    const orderRef = order ? `#${order.id} for ${order.customerName}` : (orderIdInput ? `#${orderIdInput}` : '');
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum Bachpan PK! I am inquiring about the tracking status of my kids order ${orderRef}. Could you please share the current dispatch update?`
    );
    window.open(`https://wa.me/${finalWhatsApp}?text=${msg}`, '_blank');
  };

  // Determine stage active states: Processing -> Shipped -> Delivered
  const getStageStates = (status?: OrderStatus) => {
    if (!status) return { processing: false, shipped: false, delivered: false, isCanceled: false };

    const isCanceled = status === 'Canceled' || status === 'Cancelled';
    if (isCanceled) {
      return { processing: false, shipped: false, delivered: false, isCanceled: true };
    }

    const isDelivered = status === 'Delivered';
    const isShipped = isDelivered || status === 'Dispatched' || status === 'Shipped';
    const isProcessing = isShipped || status === 'Pending Confirmation' || status === 'Order Confirmed / Proceed to COD' || status === 'Processing';

    return {
      processing: isProcessing,
      shipped: isShipped,
      delivered: isDelivered,
      isCanceled: false,
    };
  };

  const stages = getStageStates(order?.status);

  // Format Pakistani masked phone (e.g., 0300-***1234)
  const maskPhone = (phone: string) => {
    if (!phone) return '';
    const clean = phone.replace(/\s+/g, '');
    if (clean.length < 8) return clean;
    return `${clean.slice(0, 4)}-***${clean.slice(-4)}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-sans"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white border border-neutral-200 shadow-2xl my-8 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400">
                Bachpan PK Atelier
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-neutral-700 bg-neutral-100 px-2 py-0.5">
                <Truck className="w-2.5 h-2.5 stroke-[1.5]" />
                Live Courier Sync
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-neutral-900 font-normal tracking-wide mt-0.5">
              Track Order & Parcel Status
            </h2>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Express nationwide delivery via TCS & Trax Logistics with open parcel check.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
            aria-label="Close tracking modal"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 text-xs">
          
          {/* Search Box */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
              Enter Order Reference ID or Mobile Number
            </label>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleTrack();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
                <input
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="e.g. BP-1001 or 03001234567"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs sm:text-sm font-mono focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <span>Track</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Quick-select chips if orders exist */}
            {recentOrders.length > 0 && !order && (
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-light">
                  Recent Orders:
                </span>
                {recentOrders.map((ro) => (
                  <button
                    key={ro.id}
                    type="button"
                    onClick={() => {
                      setOrderIdInput(ro.id);
                      handleTrack(ro.id);
                    }}
                    className="px-2 py-0.5 border border-neutral-200 hover:border-black bg-neutral-50 text-[10px] font-mono text-neutral-700 transition-colors cursor-pointer"
                  >
                    #{ro.id} ({ro.city})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error Feedback */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 stroke-[1.5]" />
              <div className="space-y-1">
                <p className="font-medium">{error}</p>
                <p className="text-[11px] text-rose-700 font-light">
                  Need help? You can also contact our WhatsApp Concierge for live parcel tracking assistance.
                </p>
              </div>
            </div>
          )}

          {/* ORDER TRACKING RESULT */}
          {order && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Order Status Banner */}
              <div className="bg-[#FAF9F8] border border-neutral-200/90 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/80 pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block font-light">
                      Order Reference
                    </span>
                    <h3 className="font-mono text-base sm:text-lg font-medium text-neutral-900 mt-0.5">
                      #{order.id}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 block font-light">
                      Placed On
                    </span>
                    <span className="text-xs text-neutral-700 font-light">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Dynamic Real-Time Visual Timeline Bar: [Order Placed] ➡️ [Confirmed] ➡️ [Shipped/Dispatched] ➡️ [Delivered] */}
                <div className="py-2">
                  <OrderTimelineTracker 
                    status={order.status} 
                    orderId={order.id} 
                    orderDate={order.createdAt} 
                  />
                  <div className="mt-4 pt-3 border-t border-neutral-200/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-neutral-600 font-light">
                      Carrier: <strong>TCS & Trax Pakistan Express</strong>
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      Waybill: TCS-{order.id.replace('PK-', '')}-PK
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery & Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-neutral-200 p-4 space-y-2 bg-white">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-light block">
                    Recipient & Address
                  </span>
                  <p className="font-medium text-neutral-900 text-xs">{order.customerName}</p>
                  <p className="text-neutral-600 font-light leading-relaxed text-[11px]">
                    {order.shippingAddress}, {order.city}, {order.province}
                  </p>
                  <p className="text-neutral-500 font-mono text-[11px] pt-1">
                    Contact: {maskPhone(order.mobileNumber)}
                  </p>
                </div>

                <div className="border border-neutral-200 p-4 space-y-2 bg-white">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-light block">
                    Payment & Valuation
                  </span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-neutral-600 text-[11px]">Method:</span>
                    <span className="font-medium text-neutral-900 text-xs">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-neutral-600 text-[11px]">Delivery:</span>
                    <span className="text-neutral-900 text-xs">
                      {order.deliveryFee === 0 ? 'Complimentary' : `Rs. ${order.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-neutral-100">
                    <span className="text-neutral-900 font-medium text-xs">Total Amount:</span>
                    <span className="font-serif text-sm font-medium text-neutral-900">
                      Rs. {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Purchased Items List */}
              <div className="border border-neutral-200 divide-y divide-neutral-100 bg-white">
                <div className="p-3 bg-[#FAF9F8] text-[10px] uppercase tracking-wider text-neutral-500 font-light">
                  Order Items ({order.items.length})
                </div>

                {order.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-neutral-100 shrink-0 overflow-hidden border border-neutral-200/60">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="text-xs text-neutral-900 font-normal line-clamp-1">{item.title}</h4>
                        <p className="text-[10px] text-neutral-400 font-light mt-0.5">
                          Size: {item.selectedSize || 'Standard'} · Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <span className="font-serif text-xs text-neutral-900 shrink-0">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* Concierge Assistance */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs font-medium text-neutral-900 block">
                Need urgent parcel dispatch help?
              </span>
              <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                Our customer team can update your delivery address or contact the courier directly.
              </p>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="px-4 py-2 border border-neutral-300 hover:border-black hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500 stroke-[1.5]" />
              <span>WhatsApp Concierge</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF9F8] border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span className="text-[11px] font-light">
            Pakistan Nationwide Delivery via TCS & Trax
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-neutral-300 text-neutral-700 hover:text-black hover:border-black text-[11px] uppercase tracking-wider transition-colors cursor-pointer bg-white"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
