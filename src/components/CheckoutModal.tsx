import React, { useState } from 'react';
import { X, Truck, ShieldCheck, AlertCircle, CheckCircle2, Banknote, Zap } from 'lucide-react';
import { CartItem, Order, PaymentMethod } from '../types';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  discount: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  discount,
  onOrderSuccess,
}) => {
  // Strict, minimalist customer fields
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [city, setCity] = useState('Lahore');
  const [customCity, setCustomCity] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // City-based shipping rate calculation
  const isMajorCity = (c: string) => {
    const lower = (c || '').toLowerCase();
    return lower.includes('karachi') || lower.includes('lahore') || lower.includes('islamabad') || lower.includes('rawalpindi');
  };

  const selectedEffectiveCity = (city === 'Other Cities' || city === 'Other') ? customCity.trim() : city;
  const isLocalShipping = isMajorCity(selectedEffectiveCity);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : (isLocalShipping ? 150 : 250);
  const totalAmount = Math.max(0, subtotal + deliveryFee - discount);

  // Automated Incomplete Session / Abandoned Cart Capture
  const captureAbandonedSession = (nameVal = customerName, phoneVal = mobileNumber, cityVal = selectedEffectiveCity) => {
    const clean = phoneVal.replace(/\D/g, '');
    if (clean.length >= 7 && cart.length > 0) {
      api.saveAbandonedCart({
        customerName: nameVal.trim() || 'Guest Visitor',
        customerPhone: phoneVal.trim(),
        city: cityVal,
        items: cart,
        subtotal,
        notes: isGuestMode ? 'Guest 1-Tap Checkout initiated' : 'Standard Checkout initiated',
      });
    }
  };

  // Phone auto-formatting for Pakistani mobile
  const handlePhoneChange = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);

    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }
    setMobileNumber(formatted);

    if (digits.length >= 7) {
      captureAbandonedSession(customerName, formatted, selectedEffectiveCity);
    }
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errs.customerName = 'Please enter your full name.';
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!cleanMobile.startsWith('03') || cleanMobile.length !== 11) {
      errs.mobileNumber = 'Please enter a valid 11-digit Pakistani mobile number (e.g. 0300-1234567).';
    }

    if ((city === 'Other Cities' || city === 'Other') && !customCity.trim()) {
      errs.customCity = 'Please enter your city or tehsil name.';
    }

    if (!isGuestMode && (!shippingAddress.trim() || shippingAddress.trim().length < 6)) {
      errs.shippingAddress = 'Please enter complete house, street and area address.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const finalCity = (city === 'Other Cities' || city === 'Other') ? (customCity.trim() || 'Pakistan') : city;
      
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
        selectedSize: item.selectedSize || 'Standard',
      }));

      const resolvedAddress = isGuestMode
        ? (shippingAddress.trim() || `Express Address to be confirmed via WhatsApp Call (${finalCity})`)
        : shippingAddress.trim();

      const finalOrder = await api.createOrder({
        customerName: customerName.trim(),
        mobileNumber: mobileNumber.trim(),
        whatsappNumber: mobileNumber.trim(),
        province: isLocalShipping ? (city === 'Karachi' ? 'Sindh' : city === 'Lahore' ? 'Punjab' : 'Federal') : 'Pakistan',
        city: finalCity,
        shippingAddress: resolvedAddress,
        items: orderItems,
        subtotal,
        deliveryFee,
        discount,
        totalAmount,
        paymentMethod,
      });

      // Dispatch real-time global event so Admin Dashboard plays "Ding" and shows floating toast
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bachpanpk_order_placed', { detail: finalOrder }));
      }

      setIsSubmitting(false);
      onOrderSuccess(finalOrder);
    } catch (err) {
      console.error('Failed to submit order', err);
      setIsSubmitting(false);
      setErrors({ form: 'Unable to process order. Please check your connection or contact us on WhatsApp.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 font-sans animate-fadeIn">
      {/* Ultra-Clean Single-Column Box */}
      <div className="relative w-full max-w-lg bg-white border border-neutral-200 shadow-2xl my-8 flex flex-col overflow-hidden max-h-[94vh]">
        
        {/* Minimalist Boutique Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400 block">
              Bachpan PK - Express Checkout
            </span>
            <h2 className="font-serif text-2xl text-neutral-900 font-normal tracking-wide mt-0.5">
              Cash on Delivery (COD)
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Single-Column Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 space-y-6">
          
          {errors.form && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Mini Items Overview */}
          <div className="p-3.5 bg-[#FAF9F8] border border-neutral-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-600 font-light">
              <span>Selected Outfits ({cart.reduce((s, i) => s + i.quantity, 0)} items):</span>
              <span className="font-medium text-neutral-900">Subtotal: Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-2 shrink-0 bg-white border border-neutral-200 px-2 py-1">
                  <img src={item.product.imageUrl} alt={item.product.title} className="w-8 h-8 object-cover" />
                  <div className="text-[11px] leading-tight max-w-[120px]">
                    <p className="truncate font-medium text-neutral-800">{item.product.title}</p>
                    <p className="text-neutral-400 text-[10px]">{item.selectedSize} · x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guest Checkout Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 rounded-sm">
            <button
              type="button"
              onClick={() => setIsGuestMode(false)}
              className={`py-2 px-3 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer ${
                !isGuestMode 
                  ? 'bg-white shadow-2xs text-neutral-900 font-semibold' 
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              Standard Order
            </button>
            <button
              type="button"
              onClick={() => setIsGuestMode(true)}
              className={`py-2 px-3 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                isGuestMode 
                  ? 'bg-[#C89299] text-white shadow-2xs font-semibold' 
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ Guest 1-Tap</span>
            </button>
          </div>

          {isGuestMode && (
            <div className="p-3 bg-[#C89299]/10 border border-[#C89299]/25 text-neutral-800 text-xs flex items-center gap-2 rounded-xs">
              <Zap className="w-4 h-4 text-[#C89299] shrink-0" />
              <span>
                <strong>Guest 1-Tap Ordering:</strong> Only Name, Phone, and City required. Our concierge will confirm delivery address via WhatsApp call before shipping!
              </span>
            </div>
          )}

          {/* Express Form */}
          <form onSubmit={handleSubmitOrder} className="space-y-5">
            
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (mobileNumber.length >= 7) {
                    captureAbandonedSession(e.target.value, mobileNumber, selectedEffectiveCity);
                  }
                }}
                placeholder="e.g. Ayesha Khan / Muhammad Tariq"
                className="w-full px-4 py-3 bg-white border border-neutral-300 text-neutral-900 text-sm focus:border-black focus:outline-none transition-colors"
              />
              {errors.customerName && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.customerName}
                </p>
              )}
            </div>

            {/* 2. Mobile Number (Compulsory) */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                Mobile Number (Compulsory for Parcel Delivery) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-mono">
                  +92
                </span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="0300-1234567"
                  maxLength={12}
                  className="w-full pl-13 pr-4 py-3 bg-white border border-neutral-300 text-neutral-900 text-sm sm:text-base font-mono focus:border-black focus:outline-none transition-colors"
                />
              </div>
              {errors.mobileNumber ? (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.mobileNumber}
                </p>
              ) : (
                <p className="text-[11px] text-neutral-400 font-light mt-1">
                  Our dispatch rider will call or WhatsApp this number before parcel arrival.
                </p>
              )}
            </div>

            {/* 3. City (Dropdown with Pakistani City-Based Shipping Rates) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  City <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[11px] font-medium px-2 py-0.5 border ${
                  isLocalShipping 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                }`}>
                  {isLocalShipping ? 'Major Hub Rate: Rs. 150' : 'Nationwide Rate: Rs. 250'}
                </span>
              </div>
              
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-neutral-300 text-neutral-900 text-sm focus:border-black focus:outline-none transition-colors cursor-pointer"
              >
                <optgroup label="Major Hubs (Local Shipping: Rs. 150)">
                  <option value="Karachi">Karachi (Rs. 150)</option>
                  <option value="Lahore">Lahore (Rs. 150)</option>
                  <option value="Islamabad">Islamabad (Rs. 150)</option>
                  <option value="Rawalpindi">Rawalpindi (Rs. 150)</option>
                </optgroup>
                <optgroup label="Nationwide Delivery (Courier: Rs. 250)">
                  <option value="Faisalabad">Faisalabad (Rs. 250)</option>
                  <option value="Multan">Multan (Rs. 250)</option>
                  <option value="Peshawar">Peshawar (Rs. 250)</option>
                  <option value="Quetta">Quetta (Rs. 250)</option>
                  <option value="Sialkot">Sialkot (Rs. 250)</option>
                  <option value="Gujranwala">Gujranwala (Rs. 250)</option>
                  <option value="Hyderabad">Hyderabad (Rs. 250)</option>
                  <option value="Bahawalpur">Bahawalpur (Rs. 250)</option>
                  <option value="Sargodha">Sargodha (Rs. 250)</option>
                  <option value="Sukkur">Sukkur (Rs. 250)</option>
                  <option value="Abbottabad">Abbottabad (Rs. 250)</option>
                  <option value="Gujrat">Gujrat (Rs. 250)</option>
                  <option value="Sahiwal">Sahiwal (Rs. 250)</option>
                  <option value="Mardan">Mardan (Rs. 250)</option>
                  <option value="Mirpur (AJK)">Mirpur (AJK) (Rs. 250)</option>
                  <option value="Other Cities">Other Cities / Towns (Rs. 250)</option>
                </optgroup>
              </select>

              {(city === 'Other Cities' || city === 'Other') && (
                <div className="mt-3">
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Enter City / Town Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="e.g. Swat, Gwadar, Dera Ghazi Khan, Jhelum"
                    className="w-full px-4 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-sm focus:border-black focus:outline-none"
                  />
                  {errors.customCity && (
                    <p className="text-rose-600 text-xs mt-1">{errors.customCity}</p>
                  )}
                </div>
              )}
            </div>

            {/* 4. Complete Delivery Address */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5 flex items-center justify-between">
                <span>
                  Delivery Address {isGuestMode ? <span className="text-neutral-400 font-normal">(Optional in Guest Mode)</span> : <span className="text-rose-500">*</span>}
                </span>
                {isGuestMode && (
                  <span className="text-[10px] text-[#C89299] font-normal">
                    Confirm via WhatsApp
                  </span>
                )}
              </label>
              <textarea
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder={isGuestMode ? "Optional: Area / Sector / Nearest Landmark (or leave blank)" : "House / Flat #, Street #, Sector / Colony, Area"}
                className="w-full px-4 py-3 bg-white border border-neutral-300 text-neutral-900 text-sm focus:border-black focus:outline-none transition-colors"
              />
              {errors.shippingAddress && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.shippingAddress}
                </p>
              )}
            </div>

            {/* Payment Method Badge */}
            <div className="p-3.5 border border-neutral-200 bg-[#FAF9F8] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-neutral-800">
                <Banknote className="w-4 h-4 text-neutral-700" />
                <span className="font-medium">Cash on Delivery (COD)</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-light text-neutral-500">
                Pay Upon Parcel Delivery
              </span>
            </div>

            {/* Live Pricing Breakdown */}
            <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-mono">Rs. {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Shipping ({isLocalShipping ? `${city} Local Rate` : 'Nationwide Rate'})</span>
                <span className="font-mono font-medium text-neutral-900">Rs. {deliveryFee.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo Discount</span>
                  <span className="font-mono">-Rs. {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
                <span className="font-medium text-xs uppercase tracking-wider text-neutral-900">Total Payable</span>
                <span className="font-serif text-2xl text-neutral-900 font-medium">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Big Touch-Friendly Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-neutral-900 hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer disabled:opacity-50 shadow-md"
            >
              {isSubmitting ? 'Confirming Order...' : `Confirm Order · Rs. ${totalAmount.toLocaleString()}`}
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-400 font-light pt-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-neutral-500" /> 2-4 Days Express Dispatch
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-neutral-500" /> Open Parcel Inspection
              </span>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
