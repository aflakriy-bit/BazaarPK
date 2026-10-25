import React, { useState, useEffect } from 'react';
import { 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  ThumbsUp, 
  Sparkles, 
  Send, 
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { Product, ProductReview } from '../types';
import { api } from '../services/api';

interface ProductReviewsProps {
  product: Product;
  onReviewSubmitted?: (newRating: number, newCount: number) => void;
  forceOpenForm?: boolean;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  product,
  onReviewSubmitted,
  forceOpenForm,
}) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (forceOpenForm) {
      setIsFormOpen(true);
    }
  }, [forceOpenForm]);

  // Form state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState('');
  const [authorCity, setAuthorCity] = useState('');
  const [childFit, setChildFit] = useState('True to size');
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Load reviews on mount or when product changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getProductReviews(product.id).then((data) => {
      if (isMounted) {
        setReviews(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [product.id]);

  // Aggregate stats calculations
  const totalReviews = reviews.length > 0 ? reviews.length : (product.reviewCount || 0);
  const avgRating = reviews.length > 0 
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
    : (product.rating || 5.0);

  // Breakdown percentages
  const getRatingPercent = (star: number) => {
    if (reviews.length === 0) {
      if (star === 5) return 85;
      if (star === 4) return 12;
      if (star === 3) return 3;
      return 0;
    }
    const count = reviews.filter((r) => r.rating === star).length;
    return Math.round((count / reviews.length) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      setFormError('Please enter your name and a brief review comment.');
      return;
    }
    if (comment.trim().length < 10) {
      setFormError('Please write at least a few words (10+ characters) to help other mothers.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const res = await api.submitProductReview(product.id, {
        authorName,
        authorCity: authorCity || 'Pakistan',
        rating,
        comment,
        childFit,
      });

      setReviews((prev) => [res.review, ...prev]);
      setSubmitSuccess(true);
      setSubmitting(false);

      if (onReviewSubmitted) {
        onReviewSubmitted(res.aggregate.rating, res.aggregate.reviewCount);
      }

      // Reset form
      setComment('');
      setAuthorName('');
      setAuthorCity('');
      setRating(5);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsFormOpen(false);
      }, 2500);
    } catch {
      setFormError('Failed to post review. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5: return '5 Stars · Exceptional Craftsmanship & Softness';
      case 4: return '4 Stars · Very Good Quality';
      case 3: return '3 Stars · Satisfactory Fit';
      case 2: return '2 Stars · Average Experience';
      case 1: return '1 Star · Below Expectations';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 pt-2 font-sans">
      
      {/* 1. AGGREGATE RATING HERO BOX (Cashmirino Luxury Minimalist) */}
      <div className="p-5 bg-[#FAF9F8] border border-neutral-200/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
          <div className="flex items-center gap-4">
            <div className="text-center sm:text-left">
              <span className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900 block leading-none">
                {avgRating}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-light block mt-1">
                out of 5.0
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(avgRating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-neutral-300'
                    }`} 
                  />
                ))}
              </div>
              <p className="text-xs text-neutral-600 font-light">
                Based on <strong className="font-medium text-neutral-900">{totalReviews}</strong> customer reviews
              </p>
            </div>
          </div>

          {/* Write a Review Button */}
          <button
            type="button"
            onClick={() => {
              setIsFormOpen(!isFormOpen);
              setSubmitSuccess(false);
            }}
            className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>{isFormOpen ? 'Close Form' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="space-y-1.5 pt-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = getRatingPercent(star);
            return (
              <div key={star} className="flex items-center gap-3 text-[11px] text-neutral-600 font-light">
                <span className="w-10 text-right font-mono">{star} Star</span>
                <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neutral-900 transition-all duration-500 rounded-full" 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
                <span className="w-9 text-right font-mono text-[10px] text-neutral-400">{pct}%</span>
              </div>
            );
          })}
        </div>

        {/* Verification Guarantee */}
        <div className="flex items-center gap-2 pt-2 text-[10px] uppercase tracking-wider text-neutral-500 border-t border-neutral-200/60 font-light">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[1.5]" />
          <span>100% Genuine Pakistani Mother & Parent Reviews · Verified Purchases</span>
        </div>
      </div>

      {/* 2. SUBMIT REVIEW FORM */}
      {isFormOpen && (
        <form 
          onSubmit={handleSubmit} 
          className="p-5 bg-white border border-neutral-900/40 space-y-4 animate-fadeIn text-xs shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-light block">
                Share Your Experience
              </span>
              <h4 className="font-serif text-base text-neutral-900 font-normal">
                Review "{product.title}"
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-neutral-400 hover:text-black p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {submitSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[1.5]" />
              <span>Shukriya! Your review has been published and the aggregate rating updated.</span>
            </div>
          )}

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 stroke-[1.5]" />
              <span>{formError}</span>
            </div>
          )}

          {/* Interactive Star Rating Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
              Overall Rating <span className="text-neutral-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-neutral-300 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-neutral-600 font-light">
                {getRatingLabel(hoverRating || rating)}
              </span>
            </div>
          </div>

          {/* Reviewer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                Your Full Name <span className="text-neutral-400">*</span>
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Fatima Tariq / Bilal Ahmed"
                className="w-full px-3 py-2 bg-white border border-neutral-300 text-neutral-900 text-xs focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={authorCity}
                onChange={(e) => setAuthorCity(e.target.value)}
                placeholder="e.g. Lahore (DHA), Karachi, Islamabad"
                className="w-full px-3 py-2 bg-white border border-neutral-300 text-neutral-900 text-xs focus:border-black focus:outline-none"
              />
            </div>
          </div>

          {/* Child Fit Recommendation */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
              How did the outfit fit your child?
            </label>
            <select
              value={childFit}
              onChange={(e) => setChildFit(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-neutral-300 text-neutral-900 text-xs focus:border-black focus:outline-none cursor-pointer"
            >
              <option value="True to size">True to size · Perfect comfortable drape</option>
              <option value="Runs slightly small">Runs slightly small · Recommend ordering 1 size up</option>
              <option value="Generous flare & length">Generous flare & length · Great for growth</option>
              <option value="Comfortable loose cotton">Comfortable loose cotton · Ideal for active toddlers</option>
            </select>
          </div>

          {/* Written Review */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-medium mb-1">
              Written Review & Fabric Feedback <span className="text-neutral-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other mothers about the fabric texture, softness, stitching quality, and whether your child enjoyed wearing it..."
              className="w-full px-3 py-2 bg-white border border-neutral-300 text-neutral-900 text-xs focus:border-black focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-neutral-200 text-neutral-600 hover:text-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-neutral-900 hover:bg-black text-white text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3 h-3 stroke-[1.5]" />
              <span>{submitting ? 'Submitting...' : 'Post Verified Review'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. REVIEWS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-light">
            Verified Customer Reviews ({reviews.length})
          </span>
          <span className="text-[10px] text-neutral-400 font-light">
            Sorted by most recent
          </span>
        </div>

        {loading ? (
          <div className="py-6 text-center text-xs text-neutral-400 font-light animate-pulse">
            Loading verified reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-8 text-center bg-[#FAF9F8] border border-neutral-200/60 p-6 space-y-2">
            <p className="font-serif text-base text-neutral-800">Be the first to review this outfit!</p>
            <p className="text-xs text-neutral-500 font-light">
              Share your feedback to help Pakistani parents find the best clothes for their children.
            </p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-2 px-4 py-1.5 bg-neutral-900 text-white text-[11px] uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
            >
              <MessageSquare className="w-3 h-3 stroke-[1.5]" />
              <span>Write First Review</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 divide-y divide-neutral-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-900 text-xs">
                      {rev.authorName}
                    </span>
                    {rev.authorCity && (
                      <span className="text-[11px] text-neutral-400 font-light">
                        · {rev.authorCity}
                      </span>
                    )}
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200/60 font-light">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 stroke-[1.5]" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-neutral-400 font-light">
                    {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Stars & Sizing Note */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-3 h-3 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                        }`} 
                      />
                    ))}
                  </div>

                  {rev.childFit && (
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 font-light">
                      {rev.childFit}
                    </span>
                  )}
                </div>

                {/* Comment */}
                <p className="text-xs text-neutral-700 font-light leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
