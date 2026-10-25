import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (appliedDiscount: number) => void;
  whatsappNumber?: string;
}

const FREE_SHIPPING_THRESHOLD = 2999;
const STANDARD_DELIVERY_FEE = 250;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  whatsappNumber = '03001234567',
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = subtotal === 0 ? 0 : (isFreeShipping ? 0 : STANDARD_DELIVERY_FEE);
  const amountNeededForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const netTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'BABY10' || code === 'AZADI' || code === 'WELCOME10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setPromoMessage(`Voucher "${code}" applied! Saved Rs. ${disc.toLocaleString()}`);
    } else if (code === 'FREESHIP') {
      setDiscountAmount(deliveryFee);
      setPromoMessage('Free shipping voucher applied!');
    } else {
      setPromoMessage('Try code "BABY10" for 10% off.');
    }
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const itemList = cart
      .map((item, idx) => `${idx + 1}. ${item.product.title} [Size: ${item.selectedSize || 'Standard'}] (Qty: ${item.quantity}) - Rs. ${(item.product.price * item.quantity).toLocaleString()}`)
      .join('\n');

    const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
    const finalPhone = cleanNum.startsWith('92') ? cleanNum : `92${cleanNum.replace(/^0/, '')}`;

    const msg = encodeURIComponent(
      `Assalam-o-Alaikum Bachpan PK! I would like to place an order for my shopping bag:\n\n${itemList}\n\nSubtotal: Rs. ${subtotal.toLocaleString()}\nShipping: ${deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}\n*Total Payable: Rs. ${netTotal.toLocaleString()}*\n\nPlease confirm delivery address via Cash on Delivery (COD).`
    );
    window.open(`https://wa.me/${finalPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-neutral-200">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400 block">
                Bachpan PK Atelier
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 tracking-wide mt-0.5">
                Shopping Bag ({cart.length})
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Complimentary Delivery Progress Meter */}
          <div className="bg-[#FAF9F8] border-b border-neutral-200/80 px-6 py-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-800">
              <span className="flex items-center gap-1.5 font-light">
                <Truck className="w-3.5 h-3.5 text-neutral-600 stroke-[1.5]" />
                {isFreeShipping ? (
                  <span className="text-neutral-900 font-medium">
                    Complimentary Express Delivery Unlocked Across Pakistan
                  </span>
                ) : (
                  <span>
                    Add <strong className="font-medium text-neutral-900">Rs. {amountNeededForFree.toLocaleString()}</strong> for complimentary delivery
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] text-neutral-400">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-neutral-200 h-1 overflow-hidden">
              <div 
                className="bg-neutral-900 h-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-neutral-900 font-normal">Your Bag Is Empty</h3>
                  <p className="text-neutral-400 text-xs font-light mt-1 max-w-xs">
                    Explore our hand-tailored Baba Suits, chiffon frocks, and organic newborn essentials.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Explore Outfits
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.product.id + (item.selectedSize || '')}
                  className="flex gap-4 pb-4 border-b border-neutral-100"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="w-20 aspect-[4/5] object-cover bg-neutral-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 block truncate">
                        {item.product.category} {item.product.subCategory ? `• ${item.product.subCategory}` : ''}
                      </span>
                      <h4 className="font-normal text-xs sm:text-sm text-neutral-900 truncate mt-0.5">
                        {item.product.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-serif text-xs sm:text-sm text-neutral-900">
                          Rs. {item.product.price.toLocaleString()}
                        </span>
                        {item.selectedSize && (
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider border border-neutral-200 px-1.5 py-0.2">
                            {item.selectedSize}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-300 bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3 stroke-[1.5]" />
                        </button>
                        <span className="px-3 text-xs font-mono text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3 stroke-[1.5]" />
                        </button>
                      </div>

                      {/* Remove item */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Remove outfit"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-[#FAF9F8] space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 stroke-[1.5]" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Voucher: BABY10"
                    className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-white border border-neutral-300 focus:border-black focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {promoMessage && (
                <p className="text-[11px] text-neutral-700">{promoMessage}</p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery across Pakistan</span>
                  <span className="font-mono text-neutral-900">
                    {deliveryFee === 0 ? <strong className="text-emerald-700 font-medium">FREE</strong> : `Rs. ${deliveryFee}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Voucher Discount</span>
                    <span className="font-mono">-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t border-neutral-200 text-neutral-900 items-baseline">
                  <span className="uppercase tracking-wider font-medium text-xs">Total Payable</span>
                  <span className="font-serif text-xl sm:text-2xl text-neutral-900 font-normal">
                    Rs. {netTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout(discountAmount);
                  }}
                  className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-black text-white text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 px-4 border border-neutral-300 hover:border-black text-neutral-800 text-xs uppercase tracking-wider font-light flex items-center justify-center gap-2 transition-colors cursor-pointer bg-white"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 stroke-[1.5]" />
                  <span>1-Click Order via WhatsApp Concierge</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider text-neutral-400 font-light pt-1">
                <ShieldCheck className="w-3 h-3 text-neutral-500 stroke-[1.5]" />
                <span>Cash on Delivery (COD) · Open Parcel Check Welcomed</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
