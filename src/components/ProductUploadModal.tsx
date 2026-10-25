import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Film, 
  Image as ImageIcon, 
  Check, 
  AlertCircle,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { Product, MAIN_CATEGORIES } from '../types';
import { api } from '../services/api';

interface ProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (product: Product) => void;
  productToEdit?: Product | null;
  categories?: string[];
}

export const ProductUploadModal: React.FC<ProductUploadModalProps> = ({
  isOpen,
  onClose,
  onProductAdded,
  productToEdit,
}) => {
  // Normalize initial main category
  const getInitialMainCat = () => {
    if (!productToEdit?.category) return MAIN_CATEGORIES[0].name;
    const cat = productToEdit.category;
    if (cat === 'Boys Wear' || cat === 'Boys') return 'Boys';
    if (cat === 'Girls Wear' || cat === 'Girls') return 'Girls';
    if (cat === 'Toddler Outfits') return 'Baby Boy';
    if (cat === 'Newborn Essentials' || cat === 'Newborn') return 'Newborn';
    const found = MAIN_CATEGORIES.find(c => c.name.toLowerCase() === cat.toLowerCase());
    return found ? found.name : MAIN_CATEGORIES[0].name;
  };

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  
  // Dynamic Two-Tier Category States
  const [mainCategory, setMainCategory] = useState<string>(MAIN_CATEGORIES[0].name);
  const [subCategory, setSubCategory] = useState<string>('');
  
  const [ageGroup, setAgeGroup] = useState('1 - 4 Years');
  const [sizes, setSizes] = useState('1-2Y, 2-3Y, 3-4Y');
  const [fabric, setFabric] = useState('100% Breathable Combed Cotton');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('25');
  const [badge, setBadge] = useState('New Arrival');
  const [priority, setPriority] = useState<string>('1');
  
  // Media Upload State
  const [uploadSource, setUploadSource] = useState<'pc' | 'url'>('pc');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [selectedFileBase64, setSelectedFileBase64] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFileType, setSelectedFileType] = useState<string>('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [directMediaUrl, setDirectMediaUrl] = useState<string>('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [videoPosterBase64, setVideoPosterBase64] = useState<string | null>(null);

  // Available sub-categories for currently selected main category
  const currentSubCategories = MAIN_CATEGORIES.find(
    (c) => c.name.toLowerCase() === mainCategory.toLowerCase()
  )?.subCategories || [];

  // When main category changes, auto-select first sub-category if not already part of it
  const handleMainCategoryChange = (newMain: string) => {
    setMainCategory(newMain);
    const catDef = MAIN_CATEGORIES.find(c => c.name.toLowerCase() === newMain.toLowerCase());
    if (catDef && catDef.subCategories.length > 0) {
      setSubCategory(catDef.subCategories[0]);
    } else {
      setSubCategory('');
    }
  };

  // Populate form if editing
  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title || '');
      setPrice(productToEdit.price ? String(productToEdit.price) : '');
      setOriginalPrice(productToEdit.originalPrice ? String(productToEdit.originalPrice) : '');
      
      const initMain = getInitialMainCat();
      setMainCategory(initMain);

      const catDef = MAIN_CATEGORIES.find(c => c.name.toLowerCase() === initMain.toLowerCase());
      if (productToEdit.subCategory) {
        setSubCategory(productToEdit.subCategory);
      } else if (catDef && catDef.subCategories.length > 0) {
        setSubCategory(catDef.subCategories[0]);
      }

      setAgeGroup(productToEdit.ageGroup || '1 - 4 Years');
      setSizes(productToEdit.sizes ? productToEdit.sizes.join(', ') : '1-2Y, 2-3Y, 3-4Y');
      setFabric(productToEdit.fabric || '100% Breathable Combed Cotton');
      setDescription(productToEdit.description || '');
      setStock(productToEdit.stock !== undefined ? String(productToEdit.stock) : '25');
      setBadge(productToEdit.badge || '');
      setPriority(productToEdit.priority !== undefined ? String(productToEdit.priority) : '10');
      
      if (productToEdit.videoUrl) {
        setMediaType('video');
        setDirectMediaUrl(productToEdit.videoUrl);
        setMediaPreview(productToEdit.videoUrl);
      } else if (productToEdit.imageUrl) {
        setMediaType('image');
        setDirectMediaUrl(productToEdit.imageUrl);
        setMediaPreview(productToEdit.imageUrl);
      }
      setUploadSource('url');
    } else {
      // Reset form
      setTitle('');
      setPrice('');
      setOriginalPrice('');
      const defaultMain = MAIN_CATEGORIES[0].name;
      setMainCategory(defaultMain);
      setSubCategory(MAIN_CATEGORIES[0].subCategories[0] || '');
      setAgeGroup('1 - 4 Years');
      setSizes('1-2Y, 2-3Y, 3-4Y');
      setFabric('100% Breathable Combed Cotton');
      setDescription('Luxury crafted children outfit in pure breathable fabric with delicate artisanal details.');
      setStock('25');
      setBadge('New Arrival');
      setPriority('1');
      setMediaPreview(null);
      setSelectedFileBase64(null);
      setDirectMediaUrl('');
      setUploadSource('pc');
    }
    setError(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle local file selection from PC
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setVideoPosterBase64(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isVideo = file.type.startsWith('video/') || lowerName.endsWith('.mp4') || lowerName.endsWith('.webm') || lowerName.endsWith('.mov');
    const isImage = file.type.startsWith('image/') || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || lowerName.endsWith('.png') || lowerName.endsWith('.webp');

    if (!isVideo && !isImage) {
      setError('Please select a valid image (PNG/JPG/WEBP) or video reel (MP4/WEBM/MOV).');
      return;
    }

    setSelectedFileName(file.name);
    setSelectedFileType(file.type || (isVideo ? 'video/mp4' : 'image/jpeg'));
    setMediaType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      setSelectedFileBase64(dataUrl);
      setMediaPreview(dataUrl);

      if (isVideo) {
        try {
          const tempVideo = document.createElement('video');
          tempVideo.src = dataUrl;
          tempVideo.muted = true;
          tempVideo.playsInline = true;
          tempVideo.crossOrigin = 'anonymous';
          tempVideo.currentTime = 0.5;
          tempVideo.onloadeddata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = tempVideo.videoWidth || 480;
            canvas.height = tempVideo.videoHeight || 720;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
              try {
                const poster = canvas.toDataURL('image/jpeg', 0.85);
                setVideoPosterBase64(poster);
              } catch (err) {
                console.warn('Could not generate video poster frame', err);
              }
            }
          };
        } catch (vErr) {
          console.warn('Video preview element error', vErr);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please enter the outfit title.');
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setError('Please enter a valid price in PKR (Rs.).');
      return;
    }

    if (!productToEdit) {
      if (uploadSource === 'pc' && !selectedFileBase64) {
        setError('Please select a photo or video reel from your PC.');
        return;
      }
      if (uploadSource === 'url' && !directMediaUrl.trim()) {
        setError('Please enter an image or video URL.');
        return;
      }
    }

    setIsUploading(true);
    setUploadProgressText('Processing outfit media and updating catalog...');

    try {
      let finalImageUrl = productToEdit?.imageUrl || 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80';
      let finalVideoUrl: string | undefined = productToEdit?.videoUrl;
      let isVideoReel = productToEdit?.isVideoReel || false;

      if (uploadSource === 'pc' && selectedFileBase64) {
        const uploadResult = await api.uploadFile(selectedFileBase64, selectedFileName, selectedFileType);
        
        if (uploadResult.isVideo) {
          finalVideoUrl = uploadResult.url;
          isVideoReel = true;

          if (videoPosterBase64) {
            try {
              const posterUpload = await api.uploadFile(videoPosterBase64, `poster-${selectedFileName}.jpg`, 'image/jpeg');
              finalImageUrl = posterUpload.url;
            } catch {
              finalImageUrl = 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80';
            }
          }
        } else {
          finalImageUrl = uploadResult.url;
          finalVideoUrl = undefined;
          isVideoReel = false;
        }
      } else if (uploadSource === 'url' && directMediaUrl.trim()) {
        if (mediaType === 'video') {
          finalVideoUrl = directMediaUrl.trim();
          isVideoReel = true;
          if (!productToEdit?.imageUrl) {
            finalImageUrl = 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80';
          }
        } else {
          finalImageUrl = directMediaUrl.trim();
          finalVideoUrl = undefined;
          isVideoReel = false;
        }
      }

      const parsedSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);

      const payload: Partial<Product> = {
        title: title.trim(),
        price: numericPrice,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        category: mainCategory, // Tier 1: Main Category (Baby Girl, Baby Boy, Girls, Boys, Newborn)
        subCategory: subCategory.trim() || undefined, // Tier 2: Dynamic Sub-Category
        ageGroup: ageGroup.trim(),
        sizes: parsedSizes.length > 0 ? parsedSizes : ['Standard'],
        fabric: fabric.trim(),
        description: description.trim() || 'Luxury crafted kids outfit in pure breathable natural fabrics.',
        stock: parseInt(stock, 10) || 15,
        priority: priority ? parseInt(priority, 10) : 10,
        badge: badge.trim() || undefined,
        imageUrl: finalImageUrl,
        videoUrl: finalVideoUrl,
        isVideoReel,
        rating: productToEdit?.rating || 5.0,
        reviewCount: productToEdit?.reviewCount || 1,
      };

      if (productToEdit) {
        // Edit mode: Call PUT
        const updated = await api.updateProduct(productToEdit.id, payload);
        if (updated) {
          onProductAdded(updated);
        } else {
          throw new Error('Could not update outfit.');
        }
      } else {
        // Create mode: Call POST
        const saved = await api.addProduct(payload as any);
        onProductAdded(saved);
      }

      setIsUploading(false);
      onClose();
    } catch (err: any) {
      console.error('Failed to save outfit:', err);
      setIsUploading(false);
      setError(err?.message || 'Failed to save outfit. Please verify and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-neutral-200 shadow-2xl my-8 flex flex-col max-h-[92vh]">
        
        {/* Minimalist Cashmirino Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400 block">
              Bachpan PK Atelier
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-neutral-900 font-normal tracking-wide mt-0.5">
              {productToEdit ? 'Edit Outfit & Inventory' : 'Upload New Children Outfit'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto text-xs text-neutral-800">
          
          {error && (
            <div className="p-3.5 bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-neutral-900" />
              <span>{error}</span>
            </div>
          )}

          {/* DYNAMIC TWO-TIER CATEGORY DROPDOWNS (Requirement 2 Bug Fix) */}
          <div className="bg-[#FAF9F8] p-5 border border-neutral-200/80 space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-500 block">
                Two-Tier Category Selection
              </span>
              <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                Select the primary department, and the dynamic sub-category will automatically populate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dropdown 1: Main Category */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                  1. Main Category (Primary Section) <span className="text-neutral-400">*</span>
                </label>
                <select
                  value={mainCategory}
                  onChange={(e) => handleMainCategoryChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs tracking-wide focus:border-black focus:outline-none transition-colors cursor-pointer"
                >
                  {MAIN_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown 2: Dynamic Sub-Category */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                  2. Dynamic Sub-Category <span className="text-neutral-400">*</span>
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs tracking-wide focus:border-black focus:outline-none transition-colors cursor-pointer"
                >
                  {currentSubCategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
              Outfit Title <span className="text-neutral-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Pure Cashmere Touch Cardigan & Romper Set"
              className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:border-black focus:outline-none transition-colors"
            />
          </div>

          {/* Pricing, Stock & Display Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                Price in PKR (Rs.) <span className="text-neutral-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-light">
                  Rs.
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2450"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs sm:text-sm font-medium focus:border-black focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                Original Price (Strike)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-light">
                  Rs.
                </span>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="3200"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:border-black focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                Warehouse Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="25"
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:border-black focus:outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
                  Display Weight / Priority
                </label>
                <span className="text-[10px] text-neutral-400 font-light">1 = Top</span>
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="1"
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs sm:text-sm font-medium focus:border-black focus:outline-none transition-colors"
              />
              <p className="text-[9px] text-neutral-400 font-light mt-1">
                Priority 1 appears at the absolute top of the page.
              </p>
            </div>
          </div>

          {/* Age Group & Sizes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                Age Group
              </label>
              <input
                type="text"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                placeholder="e.g. 0 - 6 Months, 2 - 7 Years"
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs focus:border-black focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                Available Sizes (comma separated)
              </label>
              <input
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="0-3M, 3-6M, 6-12M, 1-2Y"
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs focus:border-black focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Fabric & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                Fabric & Weave
              </label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="100% GOTS Organic Cotton & Cashmere touch"
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs focus:border-black focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                Boutique Tag / Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. New Arrival, Festive Special"
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs focus:border-black focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
              Description & Craftsmanship Story
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Artisanal tailoring, tagless inner lining, and natural horn buttons..."
              className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs focus:border-black focus:outline-none transition-colors"
            />
          </div>

          {/* Media Section */}
          <div className="space-y-3 pt-2 border-t border-neutral-100">
            <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium">
              Outfit Photography or 9:16 Video Reel
            </label>

            {/* Media Source Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUploadSource('pc')}
                className={`flex-1 py-2 text-xs uppercase tracking-wider border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  uploadSource === 'pc' ? 'border-neutral-900 bg-neutral-900 text-white font-medium' : 'border-neutral-200 text-neutral-600 hover:border-black'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Computer</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadSource('url')}
                className={`flex-1 py-2 text-xs uppercase tracking-wider border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  uploadSource === 'url' ? 'border-neutral-900 bg-neutral-900 text-white font-medium' : 'border-neutral-200 text-neutral-600 hover:border-black'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Paste Media Link</span>
              </button>
            </div>

            {/* PC Picker */}
            {uploadSource === 'pc' ? (
              <div className="border border-dashed border-neutral-300 hover:border-neutral-900 p-6 text-center bg-[#FAF9F8] transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {mediaPreview ? (
                  <div className="flex flex-col items-center gap-2">
                    {mediaType === 'video' ? (
                      <div className="relative w-32 h-44 bg-black overflow-hidden shadow-xs">
                        <video src={mediaPreview} controls className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <img
                        src={mediaPreview}
                        alt="Uploaded preview"
                        className="w-32 h-32 object-cover border border-neutral-200 shadow-xs"
                      />
                    )}
                    <span className="text-xs text-neutral-900 font-medium flex items-center gap-1 mt-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> {selectedFileName || 'Media attached'}
                    </span>
                    <span className="text-[10px] text-neutral-400">Click to choose another file</span>
                  </div>
                ) : (
                  <div className="space-y-1.5 py-4">
                    <Upload className="w-5 h-5 mx-auto text-neutral-500 stroke-[1.5]" />
                    <p className="text-xs uppercase tracking-wider text-neutral-800">
                      Select photo or vertical reel from PC
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      Supports JPG, PNG, WEBP and MP4 vertical video (Up to 50MB)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* URL Input */
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`flex-1 py-1.5 text-xs uppercase tracking-wider border cursor-pointer ${
                      mediaType === 'image' ? 'border-neutral-900 bg-neutral-100 text-neutral-900 font-medium' : 'border-neutral-200 text-neutral-500'
                    }`}
                  >
                    Product Photo URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`flex-1 py-1.5 text-xs uppercase tracking-wider border cursor-pointer ${
                      mediaType === 'video' ? 'border-neutral-900 bg-neutral-100 text-neutral-900 font-medium' : 'border-neutral-200 text-neutral-500'
                    }`}
                  >
                    Video Reel URL (9:16)
                  </button>
                </div>
                <input
                  type="url"
                  value={directMediaUrl}
                  onChange={(e) => setDirectMediaUrl(e.target.value)}
                  placeholder={mediaType === 'video' ? 'https://example.com/reel.mp4' : 'https://example.com/frock.jpg'}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs focus:border-black focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-5 py-2.5 border border-neutral-300 text-neutral-600 hover:text-black hover:border-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{uploadProgressText || 'Saving...'}</span>
                </>
              ) : (
                <span>{productToEdit ? 'Save Changes' : 'Publish Outfit'}</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
