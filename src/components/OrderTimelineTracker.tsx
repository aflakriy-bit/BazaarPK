import React from 'react';
import { CheckCircle2, Clock, Truck, Home, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderTimelineTrackerProps {
  status: OrderStatus;
  orderId?: string;
  orderDate?: string;
  className?: string;
}

export const OrderTimelineTracker: React.FC<OrderTimelineTrackerProps> = ({
  status,
  orderId,
  orderDate,
  className = '',
}) => {
  const isCanceled = status === 'Canceled' || status === 'Cancelled';

  // Determine stage progression: 1 = Placed, 2 = Confirmed, 3 = Shipped/Dispatched, 4 = Delivered
  let currentStageNumber = 1;
  if (!isCanceled) {
    if (status === 'Delivered') {
      currentStageNumber = 4;
    } else if (status === 'Dispatched' || status === 'Shipped') {
      currentStageNumber = 3;
    } else if (status === 'Order Confirmed / Proceed to COD' || status === 'Processing') {
      currentStageNumber = 2;
    } else {
      currentStageNumber = 1; // Pending Confirmation
    }
  }

  const steps = [
    {
      num: 1,
      title: 'Order Placed',
      description: 'Received in system',
      icon: Clock,
    },
    {
      num: 2,
      title: 'Confirmed',
      description: 'Verified for COD',
      icon: CheckCircle2,
    },
    {
      num: 3,
      title: 'Shipped / Dispatched',
      description: 'TCS / Trax Courier',
      icon: Truck,
    },
    {
      num: 4,
      title: 'Delivered',
      description: 'Parcel handed over',
      icon: Home,
    },
  ];

  if (isCanceled) {
    return (
      <div className={`p-5 bg-rose-50 border border-rose-200 text-rose-950 font-sans ${className}`}>
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 stroke-[1.8]" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-semibold tracking-wide uppercase">
                Order Status: Canceled
              </span>
              {orderId && (
                <span className="font-mono text-xs bg-rose-100 px-2 py-0.5 border border-rose-200 text-rose-800">
                  #{orderId}
                </span>
              )}
            </div>
            <p className="text-xs text-rose-800 font-light leading-relaxed">
              This order has been marked as canceled by our dispatch team or customer request. No delivery will be dispatched.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 font-sans ${className}`}>
      {/* Header bar indicating current live status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400">
            Real-Time Tracking
          </span>
          {orderId && (
            <span className="font-mono text-xs font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 border border-neutral-200">
              #{orderId}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-neutral-900">
            Active Stage: <strong className="font-semibold">{status}</strong>
          </span>
        </div>
      </div>

      {/* Visual Tracking Timeline Bar: [Order Placed] ➡️ [Confirmed] ➡️ [Shipped/Dispatched] ➡️ [Delivered] */}
      <div className="relative pt-3 pb-2">
        {/* Connecting Progress Line */}
        <div className="absolute top-7 left-6 right-6 h-0.5 bg-neutral-200 -z-0 hidden sm:block">
          <div 
            className="h-full bg-neutral-900 transition-all duration-700 ease-out"
            style={{
              width: currentStageNumber === 1 ? '0%' : currentStageNumber === 2 ? '33.33%' : currentStageNumber === 3 ? '66.66%' : '100%'
            }}
          />
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          {steps.map((step) => {
            const isCompleted = currentStageNumber >= step.num;
            const isCurrent = currentStageNumber === step.num;
            const StepIcon = step.icon;

            return (
              <div key={step.num} className="flex flex-col items-center text-center space-y-2">
                {/* Circle Icon Badge */}
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    isCompleted
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-white text-neutral-400 border-neutral-300'
                  } ${isCurrent ? 'ring-4 ring-neutral-900/10 scale-105' : ''}`}
                >
                  <StepIcon className="w-4 h-4 stroke-[1.8]" />
                </div>

                {/* Step Title & Subtitle */}
                <div className="space-y-0.5">
                  <p className={`text-xs uppercase tracking-wider font-semibold ${
                    isCompleted ? 'text-neutral-950' : 'text-neutral-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-neutral-500 font-light leading-tight">
                    {step.description}
                  </p>
                </div>

                {isCurrent && (
                  <span className="text-[9px] uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-medium">
                    Current Stage
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
