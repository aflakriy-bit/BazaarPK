import React from 'react';
import { 
  X, 
  UserCheck, 
  AlertTriangle, 
  ShieldCheck, 
  ShoppingBag, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Truck, 
  Phone, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Order } from '../../types';

interface CustomerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerPhone: string;
  customerName: string;
  allOrders: Order[];
  darkMode?: boolean;
  onSelectOrder?: (order: Order) => void;
}

export const CustomerHistoryModal: React.FC<CustomerHistoryModalProps> = ({
  isOpen,
  onClose,
  customerPhone,
  customerName,
  allOrders,
  darkMode = false,
  onSelectOrder,
}) => {
  if (!isOpen) return null;

  // Normalize phone for Pakistani formats (+92, 92, 03xx, with spaces or dashes)
  const normalize = (num: string) => {
    const digits = (num || '').replace(/\D/g, '');
    return digits.length > 9 ? digits.slice(-9) : digits;
  };

  const targetDigits = normalize(customerPhone);

  const customerOrders = allOrders.filter((o) => {
    const oDigits = normalize(o.mobileNumber);
    if (targetDigits && oDigits) {
      return oDigits === targetDigits;
    }
    return o.customerName.trim().toLowerCase() === customerName.trim().toLowerCase();
  });

  // Calculate COD risk metrics
  const totalOrdersCount = customerOrders.length;
  const deliveredOrders = customerOrders.filter((o) => o.status === 'Delivered');
  const canceledOrders = customerOrders.filter((o) => o.status === 'Canceled' || o.status === 'Cancelled');
  const inProgressOrders = customerOrders.filter(
    (o) =>
      o.status !== 'Delivered' &&
      o.status !== 'Canceled' &&
      o.status !== 'Cancelled'
  );

  const deliveredCount = deliveredOrders.length;
  const canceledCount = canceledOrders.length;
  const inProgressCount = inProgressOrders.length;

  const totalSpent = customerOrders
    .filter((o) => o.status !== 'Canceled' && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // COD Risk Level evaluation
  let riskLevel: 'low' | 'moderate' | 'high' | 'new' = 'new';
  let badgeLabel = 'First-Time Buyer';
  let badgeDesc = 'New customer profile. Standard phone confirmation recommended before COD dispatch.';

  if (canceledCount >= 2) {
    riskLevel = 'high';
    badgeLabel = `High COD Risk · ${canceledCount} Orders Canceled`;
    badgeDesc = 'Caution: Multiple historical cancellations on record. Verify advance payment or call customer before packing.';
  } else if (canceledCount === 1 && deliveredCount === 0) {
    riskLevel = 'moderate';
    badgeLabel = 'Moderate COD Risk · 1 Previous Cancellation';
    badgeDesc = 'Customer previously canceled an order. Re-confirm destination and dispatch readiness.';
  } else if (totalOrdersCount >= 2 && canceledCount === 0) {
    riskLevel = 'low';
    badgeLabel = `Loyal Customer · ${totalOrdersCount}th Order Placed`;
    badgeDesc = 'Excellent track record. 100% successful fulfillment history with zero cancellations.';
  } else if (totalOrdersCount > 1 && deliveredCount > canceledCount) {
    riskLevel = 'low';
    badgeLabel = `Repeat Customer (${deliveredCount} Delivered)`;
    badgeDesc = 'Active buyer with confirmed delivery history. Safe for standard COD dispatch.';
  } else {
    riskLevel = 'new';
    badgeLabel = 'First-Time Buyer';
    badgeDesc = 'First recorded order in Bachpan PK system. Call to confirm delivery address.';
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-sans"
      onClick={onClose}
    >
      <div 
        className={`max-w-2xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-neutral-950'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-6 border-b flex items-center justify-between shrink-0 ${
          darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
              riskLevel === 'high'
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                : riskLevel === 'low'
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
            }`}>
              {riskLevel === 'high' ? (
                <AlertTriangle className="w-5 h-5 stroke-[1.8]" />
              ) : riskLevel === 'low' ? (
                <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
              ) : (
                <UserCheck className="w-5 h-5 stroke-[1.8]" />
              )}
            </div>

            <div>
              <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold block ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Customer Profile & COD Risk Log
              </span>
              <h3 className="font-serif text-xl font-normal">
                {customerName}
              </h3>
              <p className={`text-xs font-mono mt-0.5 ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600 font-medium'
              }`}>
                {customerPhone}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 cursor-pointer ${
              darkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <X className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* COD Risk Banner */}
          <div className={`p-4 border space-y-1.5 ${
            riskLevel === 'high'
              ? (darkMode ? 'bg-rose-950/30 border-rose-800/60 text-rose-200' : 'bg-rose-50 border-rose-300 text-rose-900')
              : riskLevel === 'low'
              ? (darkMode ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-950')
              : (darkMode ? 'bg-amber-950/30 border-amber-800/60 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-950')
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm font-semibold tracking-wide">
                {badgeLabel}
              </span>
              <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 font-bold ${
                riskLevel === 'high' 
                  ? 'bg-rose-600 text-white' 
                  : riskLevel === 'low'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-amber-600 text-white'
              }`}>
                {riskLevel === 'high' ? 'HIGH COD RISK' : riskLevel === 'low' ? 'SAFE COD' : 'VERIFY COD'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed font-normal opacity-90">
              {badgeDesc}
            </p>
          </div>

          {/* Historical Purchase Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 border ${
              darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-[#FAF9F8] border-neutral-200'
            }`}>
              <span className={`text-[10px] uppercase tracking-wider font-semibold block ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Total Orders
              </span>
              <span className="font-serif text-2xl font-normal mt-1 block">
                {totalOrdersCount}
              </span>
              <span className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                Lifetime registered
              </span>
            </div>

            <div className={`p-3.5 border ${
              darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-[#FAF9F8] border-neutral-200'
            }`}>
              <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold block">
                Successful
              </span>
              <span className="font-serif text-2xl font-normal text-emerald-600 mt-1 block">
                {deliveredCount}
              </span>
              <span className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                Delivered & paid
              </span>
            </div>

            <div className={`p-3.5 border ${
              darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-[#FAF9F8] border-neutral-200'
            }`}>
              <span className="text-[10px] uppercase tracking-wider text-rose-600 font-semibold block">
                Canceled
              </span>
              <span className="font-serif text-2xl font-normal text-rose-600 mt-1 block">
                {canceledCount}
              </span>
              <span className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                Voided / refused
              </span>
            </div>

            <div className={`p-3.5 border ${
              darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-[#FAF9F8] border-neutral-200'
            }`}>
              <span className={`text-[10px] uppercase tracking-wider font-semibold block ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Lifetime Spend
              </span>
              <span className="font-serif text-lg font-semibold mt-1 block truncate">
                Rs. {totalSpent.toLocaleString()}
              </span>
              <span className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                Paid & active
              </span>
            </div>
          </div>

          {/* Historical Orders Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-neutral-200/80">
              <span className={`text-xs uppercase tracking-wider font-semibold ${
                darkMode ? 'text-neutral-300' : 'text-neutral-800'
              }`}>
                All Orders Placed by Customer ({customerOrders.length})
              </span>
              <span className={`text-[10px] font-mono ${
                darkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Reverse chronological
              </span>
            </div>

            {customerOrders.length === 0 ? (
              <p className="text-center py-6 text-neutral-400 italic">
                No past records found for this phone number.
              </p>
            ) : (
              <div className="space-y-2.5">
                {customerOrders.map((ord) => {
                  const isDelivered = ord.status === 'Delivered';
                  const isCanceled = ord.status === 'Canceled' || ord.status === 'Cancelled';
                  const dateStr = new Date(ord.createdAt).toLocaleDateString('en-PK', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <div 
                      key={ord.id}
                      className={`p-3.5 border transition-all ${
                        isCanceled
                          ? (darkMode ? 'bg-rose-950/20 border-rose-900/40 opacity-75' : 'bg-rose-50/50 border-rose-200 opacity-80')
                          : (darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200 hover:border-black')
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold">
                            #{ord.id}
                          </span>
                          <span className={`text-[10px] ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {dateStr}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 border ${
                            isDelivered
                              ? 'border-emerald-600 text-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : isCanceled
                              ? 'border-rose-400 text-rose-800 bg-rose-100 line-through dark:bg-rose-950/50 dark:text-rose-300'
                              : 'border-amber-600 text-amber-800 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300'
                          }`}>
                            {ord.status}
                          </span>

                          <span className="font-serif text-xs font-semibold">
                            Rs. {ord.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <div className="space-y-0.5">
                          <p className={`font-normal ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                            {ord.city} · {ord.shippingAddress}
                          </p>
                          <p className={`text-[10px] ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            Items: {ord.items.map(i => `${i.quantity}x ${i.title}${i.selectedSize ? ` (${i.selectedSize})` : ''}`).join(', ')}
                          </p>
                        </div>

                        {onSelectOrder && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectOrder(ord);
                              onClose();
                            }}
                            className={`px-2 py-1 text-[10px] uppercase tracking-wider font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${
                              darkMode
                                ? 'border-neutral-700 hover:border-white text-neutral-300 hover:text-white'
                                : 'border-neutral-300 hover:border-black text-neutral-800 bg-white'
                            }`}
                          >
                            <FileText className="w-3 h-3 stroke-[1.8]" />
                            <span>View Invoice</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs shrink-0 ${
          darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-[#FAF9F8]'
        }`}>
          <span className={`text-[11px] ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Cross-referenced with Pakistani mobile number: <strong>{customerPhone}</strong>
          </span>

          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-1.5 border text-xs uppercase tracking-wider font-medium cursor-pointer ${
              darkMode ? 'border-neutral-700 text-neutral-300 hover:text-white' : 'border-neutral-300 text-neutral-700 hover:text-black bg-white shadow-2xs'
            }`}
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
