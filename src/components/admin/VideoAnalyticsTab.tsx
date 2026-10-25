import React, { useState } from 'react';
import { 
  Play, 
  Eye, 
  Heart, 
  BarChart3, 
  TrendingUp, 
  X,
  ExternalLink,
  Info
} from 'lucide-react';
import { Product } from '../../types';

interface VideoAnalyticsTabProps {
  products: Product[];
  onOpenStorefront: () => void;
}

export const VideoAnalyticsTab: React.FC<VideoAnalyticsTabProps> = ({
  products,
  onOpenStorefront,
}) => {
  const [selectedPreviewReel, setSelectedPreviewReel] = useState<Product | null>(null);

  // Filter products with video reels
  const reelProducts = products.filter(p => !p.videoUrl);

  // VIDEO ANALYTICS ALGORITHM:
  // Engagement Score = (Views * 1) + (Likes * 4)
  const rankedReels = [...products.filter(p => !!p.videoUrl)].map(p => {
    const views = p.views || 0;
    const likes = p.likes || 0;
    const engagementScore = (views * 1) + (likes * 4);
    const engagementRate = views > 0 ? ((likes / views) * 100).toFixed(1) : '0.0';
    return {
      product: p,
      views,
      likes,
      engagementScore,
      engagementRate,
    };
  }).sort((a, b) => b.engagementScore - a.engagementScore);

  const totalViews = rankedReels.reduce((sum, r) => sum + r.views, 0);
  const totalLikes = rankedReels.reduce((sum, r) => sum + r.likes, 0);
  const avgEngagement = rankedReels.length > 0 
    ? (totalLikes / (totalViews || 1) * 100).toFixed(1)
    : '0.0';

  const topReel = rankedReels[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Algorithm Explanation (Clean Minimalist White Theme) */}
      <div className="bg-white border border-neutral-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400">
            Engagement Algorithm · Pakistan Market
          </p>
          <h2 className="font-serif text-2xl text-neutral-900 font-normal tracking-wide">
            Video Reel Analytics & Leaderboard
          </h2>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Measures viewer engagement on 9:16 vertical reels across Pakistan. 
            Algorithm formula: <span className="font-mono text-neutral-800 font-normal">Score = (Views × 1) + (Likes × 4)</span> to detect trending children's outfits.
          </p>
        </div>

        <button
          onClick={onOpenStorefront}
          className="px-4 py-2 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 flex items-center gap-2"
        >
          <span>View On Store</span>
          <ExternalLink className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Top Reel */}
        <div className="bg-white p-5 border border-neutral-200 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-light">
            #1 Trending Outfit
          </span>
          <div className="pt-1">
            <h4 className="font-normal text-xs text-neutral-900 truncate">
              {topReel ? topReel.product.title : 'No reels yet'}
            </h4>
            <p className="font-serif text-sm text-neutral-900 mt-1">
              {topReel ? `${topReel.engagementScore.toLocaleString()} pts` : '-'}
            </p>
          </div>
        </div>

        {/* Card 2: Total Reel Views */}
        <div className="bg-white p-5 border border-neutral-200 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-light">
            Total Reel Impressions
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="font-serif text-2xl text-neutral-900 font-normal">
              {totalViews.toLocaleString()}
            </span>
            <Eye className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
          </div>
          <p className="text-[10px] text-neutral-400 font-light">Recorded across Pakistan</p>
        </div>

        {/* Card 3: Total Likes */}
        <div className="bg-white p-5 border border-neutral-200 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-light">
            Customer Likes
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="font-serif text-2xl text-neutral-900 font-normal">
              {totalLikes.toLocaleString()}
            </span>
            <Heart className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
          </div>
          <p className="text-[10px] text-neutral-400 font-light">Direct purchase interest clicks</p>
        </div>

        {/* Card 4: Avg Engagement Rate */}
        <div className="bg-white p-5 border border-neutral-200 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-light">
            Avg Engagement Rate
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="font-serif text-2xl text-neutral-900 font-normal">
              {avgEngagement}%
            </span>
            <BarChart3 className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
          </div>
          <p className="text-[10px] text-neutral-400 font-light">Likes per 100 reel impressions</p>
        </div>
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg text-neutral-900 font-normal tracking-wide">
              Trending Reel Ranking Leaderboard
            </h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Ranked dynamically by view-to-like engagement weights.
            </p>
          </div>

          <span className="text-xs tracking-wider uppercase font-light text-neutral-500 border border-neutral-200 px-3 py-1">
            {rankedReels.length} Active Reels
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F8] border-b border-neutral-200 text-neutral-500 uppercase tracking-[0.16em] text-[10px] font-light">
                <th className="py-4 px-6 text-center">Rank</th>
                <th className="py-4 px-6">Outfit & Video Reel</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-right">Price (PKR)</th>
                <th className="py-4 px-6 text-center">Views</th>
                <th className="py-4 px-6 text-center">Likes</th>
                <th className="py-4 px-6 text-center">Score</th>
                <th className="py-4 px-6 text-center">Rate</th>
                <th className="py-4 px-6 text-right">Preview</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {rankedReels.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-neutral-400 font-light">
                    No video reels found in the catalog. Upload a 9:16 reel in the Catalog tab.
                  </td>
                </tr>
              ) : (
                rankedReels.map((item, index) => {
                  const rankNumber = index + 1;
                  return (
                    <tr 
                      key={item.product.id}
                      className="hover:bg-neutral-50/60 transition-colors"
                    >
                      {/* Rank */}
                      <td className="py-4 px-6 text-center align-middle font-serif text-sm">
                        #{rankNumber}
                      </td>

                      {/* Product Thumbnail & Title */}
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 aspect-[4/5] bg-neutral-100 shrink-0 overflow-hidden">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <Play className="w-3 h-3 text-white fill-white" />
                            </div>
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <h4 className="font-normal text-xs text-neutral-900 truncate">
                              {item.product.title}
                            </h4>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              ID: {item.product.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 align-middle text-neutral-500 font-light">
                        {item.product.category}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 align-middle text-right font-serif text-neutral-900">
                        Rs. {item.product.price.toLocaleString()}
                      </td>

                      {/* Views */}
                      <td className="py-4 px-6 align-middle text-center font-mono text-neutral-600">
                        {item.views.toLocaleString()}
                      </td>

                      {/* Likes */}
                      <td className="py-4 px-6 align-middle text-center font-mono text-neutral-600">
                        {item.likes.toLocaleString()}
                      </td>

                      {/* Score */}
                      <td className="py-4 px-6 align-middle text-center font-serif text-sm text-neutral-900 font-normal">
                        {item.engagementScore.toLocaleString()}
                      </td>

                      {/* Rate */}
                      <td className="py-4 px-6 align-middle text-center font-mono text-neutral-600">
                        {item.engagementRate}%
                      </td>

                      {/* Preview Action */}
                      <td className="py-4 px-6 align-middle text-right">
                        <button
                          onClick={() => setSelectedPreviewReel(item.product)}
                          className="px-2.5 py-1 text-[10px] uppercase tracking-wider border border-neutral-300 text-neutral-700 hover:border-black hover:text-black transition-colors cursor-pointer"
                        >
                          Play 9:16
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9:16 Video Preview Modal */}
      {selectedPreviewReel && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative bg-white max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <h4 className="font-serif text-base text-neutral-900 font-normal">
                9:16 Reel Preview
              </h4>
              <button
                onClick={() => setSelectedPreviewReel(null)}
                className="text-neutral-400 hover:text-black p-1 cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="aspect-[9/16] w-full bg-black overflow-hidden relative">
              <video
                src={selectedPreviewReel.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center pt-2">
              <p className="font-normal text-xs text-neutral-900">{selectedPreviewReel.title}</p>
              <p className="font-serif text-sm text-neutral-900 mt-1">Rs. {selectedPreviewReel.price.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
