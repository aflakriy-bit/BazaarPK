import React from 'react';
import { 
  CheckCircle2, 
  PhoneCall, 
  Truck, 
  MessageCircle, 
  Printer, 
  Home
} from 'lucide-react';
import { Order } from '../types';
import { OrderTimelineTracker } from './OrderTimelineTracker';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
  onTrackOrder?: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  whatsappNumber = '03001234567',
  onTrackOrder,
}) => {
  if (!isOpen || !order) return null;

  const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
  const finalPhone = cleanNum.startsWith('92') ? cleanNum : `92${cleanNum.replace(/^0/, '')}`;

  const handleWhatsAppConfirm = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Bachpan PK! My Kids Order #${order.id} has been submitted.\n\nParent: ${order.customerName}\nPhone: ${order.mobileNumber}\nCity: ${order.city}\nAmount: Rs. ${order.totalAmount.toLocaleString()} (${order.paymentMethod})\n\nPlease confirm dispatch of our child's clothes!`
    );
    window.open(`https://wa.me/${finalPhone}?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 font-sans animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-neutral-200 shadow-2xl overflow-hidden my-8">
        
        {/* Minimalist Header */}
        <div className="p-8 text-center bg-white border-b border-neutral-100 space-y-3">
          <div className="w-12 h-12 border border-neutral-900 flex items-center justify-center text-neutral-900 mx-auto">
            <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400 block">
            Bachpan PK Atelier
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 tracking-wide">
            Order Placed Successfully
          </h2>

          {/* EXACT REQUIRED MESSAGE */}
          <div className="p-3 bg-[#FAF9F8] border border-neutral-200/80 inline-flex items-center justify-center gap-2 text-xs text-neutral-900">
            <PhoneCall className="w-3.5 h-3.5 text-neutral-700 stroke-[1.5]" />
            <span className="font-medium">Thank You! We will call you shortly to confirm your order.</span>
          </div>

          <p className="text-xs text-neutral-400 font-mono pt-1">
            Order Reference: <strong className="text-neutral-900 font-medium">#{order.id}</strong>
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-neutral-700">
          
          {/* Dynamic Real-Time Visual Timeline Bar: [Order Placed] -> [Confirmed] -> [Shipped/Dispatched] -> [Delivered] */}
          <div className="p-4 bg-white border border-neutral-200">
            <OrderTimelineTracker 
              status={order.status} 
              orderId={order.id} 
              orderDate={order.createdAt} 
            />
          </div>

          {/* Dispatch Notice */}
          <div className="flex items-start gap-3 p-4 bg-[#FAF9F8] border border-neutral-200">
            <Truck className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5 stroke-[1.5]" />
            <div>
              <span className="text-xs uppercase tracking-wider font-medium text-neutral-900 block">
                Express Courier Dispatch
              </span>
              <p className="text-neutral-500 text-[11px] font-light mt-0.5 leading-relaxed">
                Shipped via <strong>TCS & Trax Express Courier</strong> in custom packaging within 24-48 hours. Estimated delivery to <strong>{order.city}</strong>: 2-4 working days.
              </p>
            </div>
          </div>

          {/* Summary Table */}
          <div className="border border-neutral-200 divide-y divide-neutral-100 bg-white">
            <div className="flex justify-between items-center p-3 text-xs">
              <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Customer:</span>
              <span className="font-medium text-neutral-900">{order.customerName}</span>
            </div>

            <div className="flex justify-between items-center p-3 text-xs">
              <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Mobile Contact:</span>
              <span className="font-mono text-neutral-900">{order.mobileNumber}</span>
            </div>

            <div className="flex justify-between items-start p-3 text-xs">
              <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Address:</span>
              <span className="font-normal text-neutral-900 text-right max-w-[240px]">
                {order.shippingAddress}, {order.city}, {order.province}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 text-xs">
              <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Payment Method:</span>
              <span className="uppercase tracking-wider font-medium text-neutral-900">
                {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 text-sm bg-[#FAF9F8]">
              <span className="uppercase tracking-wider font-medium text-xs text-neutral-900">Total Payable:</span>
              <span className="font-serif text-lg text-neutral-900 font-normal">
                Rs. {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleWhatsAppConfirm}
              className="w-full py-3 bg-neutral-900 hover:bg-black text-white text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 stroke-[1.5]" />
              <span>Confirm Instantly via WhatsApp Concierge</span>
            </button>

            {onTrackOrder && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onTrackOrder(order.id);
                }}
                className="w-full py-2.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-900 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Truck className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Track Live Order & Delivery Status</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="py-2.5 px-3 border border-neutral-300 text-neutral-700 hover:text-black hover:border-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-3 border border-neutral-300 text-neutral-700 hover:text-black hover:border-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Return To Boutique</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
