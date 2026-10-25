import React, { useState, useRef, useEffect } from 'react';
import { 
  StoreLayoutConfig, 
  DEFAULT_LAYOUT_CONFIG, 
  Product 
} from '../../types';
import { 
  Eye, 
  Check, 
  Upload, 
  Film, 
  Image as ImageIcon, 
  Sun, 
  Moon, 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw, 
  ExternalLink, 
  Sparkles, 
  Sliders, 
  ShoppingBag, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Truck, 
  Banknote, 
  Camera, 
  MessageCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Layers,
  ArrowRight,
  Tag
} from 'lucide-react';

interface LiveVisualCustomizerProps {
  layoutConfig: StoreLayoutConfig;
  onSaveLayout: (updatedConfig: StoreLayoutConfig) => Promise<void>;
  products: Product[];
  darkMode: boolean; // Admin panel UI theme
  onOpenStorefront: () => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const LiveVisualCustomizer: React.FC<LiveVisualCustomizerProps> = ({
  layoutConfig,
  onSaveLayout,
  products,
  darkMode,
  onOpenStorefront,
}) => {
  // Live state that syncs instantly with the right preview panel
  const [liveConfig, setLiveConfig] = useState<StoreLayoutConfig>({
    ...DEFAULT_LAYOUT_CONFIG,
    ...layoutConfig,
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [uploadingHero, setUploadingHero] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string>('theme');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync when layoutConfig changes externally
  useEffect(() => {
    setLiveConfig({
      ...DEFAULT_LAYOUT_CONFIG,
      ...layoutConfig,
    });
    setIsDirty(false);
  }, [layoutConfig]);

  // Update a field in the live configuration
  const updateField = <K extends keyof StoreLayoutConfig>(key: K, value: StoreLayoutConfig[K]) => {
    setLiveConfig((prev) => {
      const next = { ...prev, [key]: value };
      // Broadcast live event to any open storefront window or iframe
      try {
        window.dispatchEvent(new CustomEvent('bachpanpk_layout_updated', { detail: next }));
      } catch (e) {
        // ignore
      }
      return next;
    });
    setIsDirty(true);
    setSaveSuccess(false);
  };

  // Handle direct media file upload from Admin PC
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    setSaveError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: base64Data,
              filename: file.name,
              mimeType: file.type,
            }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || 'Upload failed');

          const isVideo = json.isVideo || file.type.startsWith('video/') || file.name.endsWith('.mp4');
          if (isVideo) {
            updateField('heroBannerVideoUrl', json.url);
            updateField('heroBannerMediaType', 'video');
          } else {
            updateField('heroBannerImageUrl', json.url);
            updateField('heroBannerMediaType', 'image');
          }
        } catch (err: any) {
          setSaveError(err.message || 'Failed to upload hero media file.');
        } finally {
          setUploadingHero(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setSaveError(err.message || 'File read error.');
      setUploadingHero(false);
    }
  };

  // Save all live synchronized settings permanently to database
  const handlePublish = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await onSaveLayout(liveConfig);
      setIsDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to publish live customizer settings.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default settings
  const handleResetDefaults = () => {
    if (window.confirm('Reset all frontend layout and styling properties to official Bachpan PK defaults?')) {
      setLiveConfig(DEFAULT_LAYOUT_CONFIG);
      setIsDirty(true);
      window.dispatchEvent(new CustomEvent('bachpanpk_layout_updated', { detail: DEFAULT_LAYOUT_CONFIG }));
    }
  };

  // Toggle accordion sections
  const toggleAccordion = (name: string) => {
    setActiveAccordion((prev) => (prev === name ? '' : name));
  };

  const isCustomerDark = liveConfig.globalThemeMode === 'dark';

  return (
    <div className="space-y-6">
      
      {/* Sticky Publishing Bar & Device Viewport Switcher */}
      <div className={`sticky top-0 z-30 p-4 border rounded-sm shadow-xs transition-colors backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 ${
        darkMode ? 'bg-neutral-900/95 border-neutral-800' : 'bg-white/95 border-neutral-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#C89299]/15 text-[#C89299] flex items-center justify-center">
            <Sliders className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`font-serif text-lg font-medium ${darkMode ? 'text-white' : 'text-neutral-950'}`}>
                Shopify-Style Live Theme Customizer
              </h2>
              {isDirty && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300/60 animate-pulse">
                  ● Unsaved Draft
                </span>
              )}
            </div>
            <p className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Changes in left panel update the live interactive storefront preview with zero latency.
            </p>
          </div>
        </div>

        {/* Center: Device Simulation Viewport Toggles */}
        <div className={`flex items-center p-1 rounded-sm border ${
          darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
        }`}>
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? (darkMode ? 'bg-neutral-800 text-white shadow-2xs' : 'bg-white text-neutral-900 shadow-2xs font-semibold')
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            title="Desktop View (100% full width)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('tablet')}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'tablet'
                ? (darkMode ? 'bg-neutral-800 text-white shadow-2xs' : 'bg-white text-neutral-900 shadow-2xs font-semibold')
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            title="Tablet View (768px portrait)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'mobile'
                ? (darkMode ? 'bg-neutral-800 text-white shadow-2xs' : 'bg-white text-neutral-900 shadow-2xs font-semibold')
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            title="Mobile View (390px iPhone)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className={`px-3 py-2 text-xs font-medium uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1.5 ${
              darkMode 
                ? 'border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500' 
                : 'border-neutral-300 text-neutral-700 hover:text-black hover:border-black bg-white shadow-2xs'
            }`}
            title="Reset to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={onOpenStorefront}
            className={`px-3 py-2 text-xs font-medium uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1.5 ${
              darkMode 
                ? 'border-neutral-700 text-neutral-300 hover:text-white' 
                : 'border-neutral-300 text-neutral-700 hover:text-black bg-white shadow-2xs'
            }`}
            title="Open customer storefront in live view"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Tab</span>
          </button>

          {/* Sticky Publish Live Changes Button */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="px-5 py-2.5 bg-[#C89299] hover:bg-[#B9838A] active:scale-95 text-white text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Published Live!</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2]" />
                <span>Publish Live Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-medium rounded-sm">
          {saveError}
        </div>
      )}

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================== */}
        {/* LEFT PANEL: CONTROL CENTER (STRUCTURED CMS ACCORDIONS)         */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 1. MASTER GLOBAL THEME SWITCHER CARD */}
          <div className={`p-4 border rounded-sm space-y-3 ${
            darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-300 shadow-2xs'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C89299]" />
                <h3 className={`font-serif text-base font-medium ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                  Global Customer Site Theme
                </h3>
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                isCustomerDark 
                  ? 'bg-neutral-800 text-white border border-neutral-700' 
                  : 'bg-[#FAF6F0] text-[#8C6D68] border border-[#E8DFD8]'
              }`}>
                {isCustomerDark ? 'Midnight Charcoal' : 'Ivory Pastel'}
              </span>
            </div>

            <p className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Switches customer-end background between Alaya Junior luxury soft ivory/cream pastel (#FDFBF7) and luxury deep-charcoal midnight mode (#121214).
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Light Mode Option */}
              <button
                type="button"
                onClick={() => updateField('globalThemeMode', 'light')}
                className={`p-3 border rounded-sm text-left transition-all cursor-pointer relative ${
                  !isCustomerDark
                    ? 'border-[#C89299] bg-[#FDFBF7] ring-2 ring-[#C89299]/30'
                    : (darkMode ? 'border-neutral-800 bg-neutral-900 opacity-60 hover:opacity-100' : 'border-neutral-200 bg-neutral-50')
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="font-serif text-xs font-semibold text-neutral-900">
                      Soft Ivory Pastel
                    </span>
                  </div>
                  {!isCustomerDark && <CheckCircle2 className="w-4 h-4 text-[#C89299]" />}
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-4 h-4 rounded-full bg-[#FDFBF7] border border-neutral-300" title="Ivory Pastel #FDFBF7" />
                  <div className="w-4 h-4 rounded-full bg-[#171717]" title="Charcoal Text #171717" />
                  <div className="w-4 h-4 rounded-full bg-[#C89299]" title="Dusty Rose CTA #C89299" />
                </div>
                <span className="text-[10px] text-neutral-500 block leading-tight">
                  Alaya Junior Signature Light Tone
                </span>
              </button>

              {/* Dark Mode Option */}
              <button
                type="button"
                onClick={() => updateField('globalThemeMode', 'dark')}
                className={`p-3 border rounded-sm text-left transition-all cursor-pointer relative ${
                  isCustomerDark
                    ? 'border-[#C89299] bg-neutral-900 ring-2 ring-[#C89299]/30 text-white'
                    : (darkMode ? 'border-neutral-800 bg-neutral-900 opacity-60 hover:opacity-100' : 'border-neutral-200 bg-neutral-50 text-neutral-800')
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-sky-400" />
                    <span className={`font-serif text-xs font-semibold ${isCustomerDark ? 'text-white' : 'text-neutral-900'}`}>
                      Midnight Charcoal
                    </span>
                  </div>
                  {isCustomerDark && <CheckCircle2 className="w-4 h-4 text-[#C89299]" />}
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-4 h-4 rounded-full bg-[#121214] border border-neutral-700" title="Midnight Charcoal #121214" />
                  <div className="w-4 h-4 rounded-full bg-[#FAF6F0]" title="Cream Text #FAF6F0" />
                  <div className="w-4 h-4 rounded-full bg-[#C89299]" title="Dusty Rose CTA #C89299" />
                </div>
                <span className={`text-[10px] block leading-tight ${isCustomerDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Ultra-Modern Luxury Dark Tone
                </span>
              </button>
            </div>
          </div>

          {/* 2. HEADER & ANNOUNCEMENT BAR SETTINGS BLOCK */}
          <div className={`border rounded-sm overflow-hidden transition-colors ${
            darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-300 shadow-2xs'
          }`}>
            <button
              type="button"
              onClick={() => toggleAccordion('header')}
              className={`w-full p-4 flex items-center justify-between text-left cursor-pointer border-b ${
                darkMode ? 'border-neutral-800 hover:bg-neutral-900' : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <div>
                  <h4 className={`font-serif text-sm font-medium ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Header & Brand Identity Box
                  </h4>
                  <span className="text-[10px] text-neutral-400">Logo text, tagline, and top ticker bar</span>
                </div>
              </div>
              {activeAccordion === 'header' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {activeAccordion === 'header' && (
              <div className="p-4 space-y-3.5 text-xs">
                {/* Announcement Bar Toggle */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <label className={`font-medium block ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>
                      Top Announcement Ticker
                    </label>
                    <span className="text-[10px] text-neutral-400">Display delivery guarantee and offer bar</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={liveConfig.showAnnouncementBar}
                    onChange={(e) => updateField('showAnnouncementBar', e.target.checked)}
                    className="w-4 h-4 accent-[#C89299] cursor-pointer"
                  />
                </div>

                {liveConfig.showAnnouncementBar && (
                  <div>
                    <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      Announcement Ticker Text
                    </label>
                    <input
                      type="text"
                      value={liveConfig.announcementText || ''}
                      onChange={(e) => updateField('announcementText', e.target.value)}
                      placeholder="e.g. Free Shipping on Orders Above Rs. 3000 | Cash on Delivery"
                      className={`w-full px-3 py-2 border rounded-xs ${
                        darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                      }`}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      Brand Logo Name
                    </label>
                    <input
                      type="text"
                      value={liveConfig.headerLogoText || 'Bachpan PK'}
                      onChange={(e) => updateField('headerLogoText', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xs font-serif ${
                        darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      value={liveConfig.headerTagline || 'PREMIUM KIDS WEAR · PAKISTAN'}
                      onChange={(e) => updateField('headerTagline', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xs ${
                        darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Helpline / Support Phone
                  </label>
                  <input
                    type="text"
                    value={liveConfig.supportPhoneNumber || ''}
                    onChange={(e) => updateField('supportPhoneNumber', e.target.value)}
                    placeholder="0300-1234567"
                    className={`w-full px-3 py-2 border rounded-xs ${
                      darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. HERO VIDEO & BANNER SETTINGS BLOCK */}
          <div className={`border rounded-sm overflow-hidden transition-colors ${
            darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-300 shadow-2xs'
          }`}>
            <button
              type="button"
              onClick={() => toggleAccordion('hero')}
              className={`w-full p-4 flex items-center justify-between text-left cursor-pointer border-b ${
                darkMode ? 'border-neutral-800 hover:bg-neutral-900' : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <div>
                  <h4 className={`font-serif text-sm font-medium ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Hero Video / Banner CMS Box
                  </h4>
                  <span className="text-[10px] text-neutral-400">Media format, height, zoom, focal point, and overlays</span>
                </div>
              </div>
              {activeAccordion === 'hero' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {activeAccordion === 'hero' && (
              <div className="p-4 space-y-4 text-xs">
                {/* Hero Visibility */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <label className={`font-medium block ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>
                      Show Hero Banner
                    </label>
                    <span className="text-[10px] text-neutral-400">Master visibility for main storefront hero</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={liveConfig.showHeroBanner}
                    onChange={(e) => updateField('showHeroBanner', e.target.checked)}
                    className="w-4 h-4 accent-[#C89299] cursor-pointer"
                  />
                </div>

                {/* Media Format: Image vs Autoplay Video */}
                <div>
                  <label className={`block font-medium mb-1.5 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Media Format
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('heroBannerMediaType', 'image')}
                      className={`flex-1 py-1.5 px-3 rounded-xs border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        (liveConfig.heroBannerMediaType || 'image') === 'image'
                          ? 'bg-[#C89299] text-white border-[#C89299] shadow-2xs'
                          : (darkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-300' : 'bg-neutral-100 border-neutral-300 text-neutral-700')
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Photo (Image)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('heroBannerMediaType', 'video')}
                      className={`flex-1 py-1.5 px-3 rounded-xs border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        liveConfig.heroBannerMediaType === 'video'
                          ? 'bg-[#C89299] text-white border-[#C89299] shadow-2xs'
                          : (darkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-300' : 'bg-neutral-100 border-neutral-300 text-neutral-700')
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Autoplay Video (MP4)</span>
                    </button>
                  </div>
                </div>

                {/* Media File Upload Button */}
                <div>
                  <label className={`block font-medium mb-1.5 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Upload High-Resolution Media
                  </label>
                  <label className={`w-full py-2 px-3 border border-dashed rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    darkMode ? 'bg-neutral-900/60 border-neutral-700 hover:border-neutral-500 text-neutral-300' : 'bg-neutral-50 border-neutral-300 hover:border-black text-neutral-700'
                  }`}>
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingHero ? 'Uploading Media...' : 'Choose Image or MP4 Video File'}</span>
                    <input
                      type="file"
                      accept="image/*,video/mp4,video/webm"
                      onChange={handleHeroFileUpload}
                      disabled={uploadingHero}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct Media URL Input */}
                <div>
                  <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    {liveConfig.heroBannerMediaType === 'video' ? 'Video URL (MP4 / WebM)' : 'Image URL'}
                  </label>
                  <input
                    type="text"
                    value={liveConfig.heroBannerMediaType === 'video' ? (liveConfig.heroBannerVideoUrl || '') : (liveConfig.heroBannerImageUrl || '')}
                    onChange={(e) => {
                      if (liveConfig.heroBannerMediaType === 'video') {
                        updateField('heroBannerVideoUrl', e.target.value);
                      } else {
                        updateField('heroBannerImageUrl', e.target.value);
                      }
                    }}
                    placeholder="https://..."
                    className={`w-full px-3 py-2 border rounded-xs font-mono text-[11px] ${
                      darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                    }`}
                  />
                </div>

                {/* Dynamic Dimensions: Height & Scale Sliders */}
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span className={darkMode ? 'text-neutral-300' : 'text-neutral-700'}>Container Height</span>
                      <span className="font-mono text-neutral-500">{liveConfig.heroBannerHeight || 680}px</span>
                    </div>
                    <input
                      type="range"
                      min="450"
                      max="900"
                      step="10"
                      value={liveConfig.heroBannerHeight || 680}
                      onChange={(e) => updateField('heroBannerHeight', Number(e.target.value))}
                      className="w-full accent-[#C89299] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span className={darkMode ? 'text-neutral-300' : 'text-neutral-700'}>Media Scale / Zoom</span>
                      <span className="font-mono text-neutral-500">{liveConfig.heroBannerScale || 100}%</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="150"
                      step="5"
                      value={liveConfig.heroBannerScale || 100}
                      onChange={(e) => updateField('heroBannerScale', Number(e.target.value))}
                      className="w-full accent-[#C89299] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span className={darkMode ? 'text-neutral-300' : 'text-neutral-700'}>Focal Point Cropper</span>
                      <span className="capitalize font-mono text-neutral-500">{liveConfig.heroBannerFocalPoint || 'center'}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 pt-1">
                      {(['top', 'center', 'bottom', 'left', 'right'] as const).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => updateField('heroBannerFocalPoint', pos)}
                          className={`py-1 text-[10px] uppercase font-semibold border rounded-xs transition-colors cursor-pointer capitalize ${
                            (liveConfig.heroBannerFocalPoint || 'center') === pos
                              ? 'bg-[#C89299] text-white border-[#C89299]'
                              : (darkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-300' : 'bg-neutral-100 border-neutral-300 text-neutral-700')
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text Overlays */}
                <div className="space-y-2.5 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <div>
                    <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      Banner Tag Overlay
                    </label>
                    <input
                      type="text"
                      value={liveConfig.heroBannerTag || ''}
                      onChange={(e) => updateField('heroBannerTag', e.target.value)}
                      placeholder="Tiny ones, big firsts"
                      className={`w-full px-3 py-1.5 border rounded-xs ${
                        darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      Headline (Cormorant Garamond)
                    </label>
                    <input
                      type="text"
                      value={liveConfig.heroBannerTitle || ''}
                      onChange={(e) => updateField('heroBannerTitle', e.target.value)}
                      placeholder="Thoughtfully Made For Childhood Memories"
                      className={`w-full px-3 py-1.5 border rounded-xs font-serif ${
                        darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      Subtitle / Supporting Description
                    </label>
                    <textarea
                      rows={2}
                      value={liveConfig.heroBannerSubtitle || ''}
                      onChange={(e) => updateField('heroBannerSubtitle', e.target.value)}
                      placeholder="Hand-tailored festive Baba Suits..."
                      className={`w-full px-3 py-1.5 border rounded-xs leading-relaxed ${
                        darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. TRUST BADGES BAR SETTINGS BLOCK */}
          <div className={`border rounded-sm overflow-hidden transition-colors ${
            darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-300 shadow-2xs'
          }`}>
            <button
              type="button"
              onClick={() => toggleAccordion('trust')}
              className={`w-full p-4 flex items-center justify-between text-left cursor-pointer border-b ${
                darkMode ? 'border-neutral-800 hover:bg-neutral-900' : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-sky-600" />
                <div>
                  <h4 className={`font-serif text-sm font-medium ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Trust Badges Bar Box
                  </h4>
                  <span className="text-[10px] text-neutral-400">COD, PostEx Tracking, and Real Photo badges</span>
                </div>
              </div>
              {activeAccordion === 'trust' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {activeAccordion === 'trust' && (
              <div className="p-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <label className={`font-medium block ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>
                      Show 3-Column Trust Bar
                    </label>
                    <span className="text-[10px] text-neutral-400">Positioned directly beneath hero banner</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={liveConfig.showTrustBadgesBar ?? true}
                    onChange={(e) => updateField('showTrustBadgesBar', e.target.checked)}
                    className="w-4 h-4 accent-[#C89299] cursor-pointer"
                  />
                </div>

                <div className="space-y-3">
                  <div className="p-2.5 border rounded-xs dark:border-neutral-800">
                    <span className="text-[10px] uppercase font-bold text-[#C89299] block mb-1">Badge 1 (COD)</span>
                    <input
                      type="text"
                      value={liveConfig.trustBadge1Title || 'COD Available'}
                      onChange={(e) => updateField('trustBadge1Title', e.target.value)}
                      className={`w-full px-2.5 py-1 border rounded-xs mb-1 font-serif ${darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'}`}
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      value={liveConfig.trustBadge1Subtitle || 'Pay cash when it arrives at your doorstep'}
                      onChange={(e) => updateField('trustBadge1Subtitle', e.target.value)}
                      className={`w-full px-2.5 py-1 border rounded-xs text-[11px] ${darkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-300' : 'bg-white border-neutral-300'}`}
                      placeholder="Subtitle"
                    />
                  </div>

                  <div className="p-2.5 border rounded-xs dark:border-neutral-800">
                    <span className="text-[10px] uppercase font-bold text-[#C89299] block mb-1">Badge 2 (Tracking)</span>
                    <input
                      type="text"
                      value={liveConfig.trustBadge2Title || 'PostEx Tracking'}
                      onChange={(e) => updateField('trustBadge2Title', e.target.value)}
                      className={`w-full px-2.5 py-1 border rounded-xs mb-1 font-serif ${darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'}`}
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      value={liveConfig.trustBadge2Subtitle || 'Follow every step via SMS & Rider Portal'}
                      onChange={(e) => updateField('trustBadge2Subtitle', e.target.value)}
                      className={`w-full px-2.5 py-1 border rounded-xs text-[11px] ${darkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-300' : 'bg-white border-neutral-300'}`}
                      placeholder="Subtitle"
                    />
                  </div>

                  <div className="p-2.5 border rounded-xs dark:border-neutral-800">
                    <span className="text-[10px] uppercase font-bold text-[#C89299] block mb-1">Badge 3 (Real Photo)</span>
                    <input
                      type="text"
                      value={liveConfig.trustBadge3Title || 'Real Photo on Request'}
                      onChange={(e) => updateField('trustBadge3Title', e.target.value)}
                      className={`w-full px-2.5 py-1 border rounded-xs mb-1 font-serif ${darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'}`}
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      value={liveConfig.trustBadge3Subtitle || 'See real unedited outfit photos before it ships'}
                      onChange={(e) => updateField('trustBadge3Subtitle', e.target.value)}
                      className={`w-full px-2.5 py-1 border rounded-xs text-[11px] ${darkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-300' : 'bg-white border-neutral-300'}`}
                      placeholder="Subtitle"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. SHOP BY CATEGORY & NEW ARRIVALS BOX */}
          <div className={`border rounded-sm overflow-hidden transition-colors ${
            darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-300 shadow-2xs'
          }`}>
            <button
              type="button"
              onClick={() => toggleAccordion('categories')}
              className={`w-full p-4 flex items-center justify-between text-left cursor-pointer border-b ${
                darkMode ? 'border-neutral-800 hover:bg-neutral-900' : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-purple-600" />
                <div>
                  <h4 className={`font-serif text-sm font-medium ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Shop by Category & New Arrivals Box
                  </h4>
                  <span className="text-[10px] text-neutral-400">Section titles and visibility toggles</span>
                </div>
              </div>
              {activeAccordion === 'categories' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {activeAccordion === 'categories' && (
              <div className="p-4 space-y-3.5 text-xs">
                {/* Category Grid Section */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>
                      Shop by Category 5-Column Grid
                    </label>
                    <input
                      type="checkbox"
                      checked={liveConfig.showCategoryGrid ?? true}
                      onChange={(e) => updateField('showCategoryGrid', e.target.checked)}
                      className="w-4 h-4 accent-[#C89299] cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={liveConfig.categorySectionTitle || 'Shop by category'}
                    onChange={(e) => updateField('categorySectionTitle', e.target.value)}
                    placeholder="Section Title"
                    className={`w-full px-3 py-1.5 border rounded-xs font-serif ${
                      darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                    }`}
                  />
                </div>

                {/* New Arrivals Section */}
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>
                      New Arrivals & Fresh Drops Grid
                    </label>
                    <input
                      type="checkbox"
                      checked={liveConfig.showNewArrivalsSection ?? true}
                      onChange={(e) => updateField('showNewArrivalsSection', e.target.checked)}
                      className="w-4 h-4 accent-[#C89299] cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={liveConfig.newArrivalsSectionTitle || 'New Arrivals · Fresh In'}
                    onChange={(e) => updateField('newArrivalsSectionTitle', e.target.value)}
                    placeholder="Section Title"
                    className={`w-full px-3 py-1.5 border rounded-xs font-serif ${
                      darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                    }`}
                  />
                </div>

                {/* Other Catalog Sections */}
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">Catalog Rows</span>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={liveConfig.showBoysWearSection}
                        onChange={(e) => updateField('showBoysWearSection', e.target.checked)}
                        className="accent-[#C89299]"
                      />
                      <span>Boys Wear Section</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={liveConfig.showGirlsWearSection}
                        onChange={(e) => updateField('showGirlsWearSection', e.target.checked)}
                        className="accent-[#C89299]"
                      />
                      <span>Girls Wear Section</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={liveConfig.showToddlerSection}
                        onChange={(e) => updateField('showToddlerSection', e.target.checked)}
                        className="accent-[#C89299]"
                      />
                      <span>Toddler Section</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={liveConfig.showNewbornSection}
                        onChange={(e) => updateField('showNewbornSection', e.target.checked)}
                        className="accent-[#C89299]"
                      />
                      <span>Newborn Section</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={liveConfig.showVideoReels}
                        onChange={(e) => updateField('showVideoReels', e.target.checked)}
                        className="accent-[#C89299]"
                      />
                      <span>9:16 Video Reels</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={liveConfig.showAllProductsGrid}
                        onChange={(e) => updateField('showAllProductsGrid', e.target.checked)}
                        className="accent-[#C89299]"
                      />
                      <span>All Outfits Grid</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. AD & SPONSOR BANNER SLOT MANAGER (MONETIZATION) */}
          <div className={`border rounded-sm overflow-hidden transition-colors ${
            darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-300 shadow-2xs'
          }`}>
            <button
              type="button"
              onClick={() => toggleAccordion('sponsor_banner')}
              className={`w-full p-4 flex items-center justify-between text-left cursor-pointer border-b ${
                darkMode ? 'border-neutral-800 hover:bg-neutral-900' : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-[#C89299]" />
                <div>
                  <h4 className={`font-serif text-sm font-medium ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Ad & Sponsor Slot Manager
                  </h4>
                  <span className="text-[10px] text-neutral-400">Configure native atelier sponsor slot for monetization</span>
                </div>
              </div>
              {activeAccordion === 'sponsor_banner' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {activeAccordion === 'sponsor_banner' && (
              <div className="p-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <label className={`font-medium block ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>
                      Enable Sponsor Banner Slot
                    </label>
                    <span className="text-[10px] text-neutral-400">Display luxury native sponsor slot on customer storefront</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={liveConfig.showSponsorBanner ?? false}
                    onChange={(e) => updateField('showSponsorBanner', e.target.checked)}
                    className="w-4 h-4 accent-[#C89299] cursor-pointer"
                  />
                </div>

                {liveConfig.showSponsorBanner && (
                  <>
                    <div>
                      <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Sponsor Badge / Label
                      </label>
                      <input
                        type="text"
                        value={liveConfig.sponsorBannerBadge || ''}
                        onChange={(e) => updateField('sponsorBannerBadge', e.target.value)}
                        placeholder="e.g. Partner Atelier Selection"
                        className={`w-full px-3 py-2 border rounded-xs ${
                          darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Headline
                      </label>
                      <input
                        type="text"
                        value={liveConfig.sponsorBannerTitle || ''}
                        onChange={(e) => updateField('sponsorBannerTitle', e.target.value)}
                        placeholder="e.g. Handcrafted Silver Keepsakes & Heirloom Rattles"
                        className={`w-full px-3 py-2 border rounded-xs ${
                          darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Subtitle / Description
                      </label>
                      <textarea
                        rows={2}
                        value={liveConfig.sponsorBannerSubtitle || ''}
                        onChange={(e) => updateField('sponsorBannerSubtitle', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-xs ${
                          darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={liveConfig.sponsorBannerCtaText || ''}
                          onChange={(e) => updateField('sponsorBannerCtaText', e.target.value)}
                          placeholder="e.g. Explore Collection"
                          className={`w-full px-3 py-2 border rounded-xs ${
                            darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          Position
                        </label>
                        <select
                          value={liveConfig.sponsorBannerPosition || 'after_categories'}
                          onChange={(e: any) => updateField('sponsorBannerPosition', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xs ${
                            darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                          }`}
                        >
                          <option value="after_hero">After Hero Banner</option>
                          <option value="after_categories">After Categories</option>
                          <option value="before_catalog">Before All Products</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Sponsor Image URL
                      </label>
                      <input
                        type="text"
                        value={liveConfig.sponsorBannerImageUrl || ''}
                        onChange={(e) => updateField('sponsorBannerImageUrl', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-xs ${
                          darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                        }`}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 7. WHATSAPP CONCIERGE & MAINTENANCE BLOCK */}
          <div className={`border rounded-sm overflow-hidden transition-colors ${
            darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-300 shadow-2xs'
          }`}>
            <button
              type="button"
              onClick={() => toggleAccordion('whatsapp')}
              className={`w-full p-4 flex items-center justify-between text-left cursor-pointer border-b ${
                darkMode ? 'border-neutral-800 hover:bg-neutral-900' : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <div>
                  <h4 className={`font-serif text-sm font-medium ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    WhatsApp Button & Maintenance Settings
                  </h4>
                  <span className="text-[10px] text-neutral-400">Floating concierge and maintenance mode lock</span>
                </div>
              </div>
              {activeAccordion === 'whatsapp' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {activeAccordion === 'whatsapp' && (
              <div className="p-4 space-y-3.5 text-xs">
                <div>
                  <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    WhatsApp Number (Format: 03001234567)
                  </label>
                  <input
                    type="text"
                    value={liveConfig.whatsappNumber || ''}
                    onChange={(e) => updateField('whatsappNumber', e.target.value)}
                    placeholder="03001234567"
                    className={`w-full px-3 py-2 border rounded-xs ${
                      darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Floating Tooltip Label
                  </label>
                  <input
                    type="text"
                    value={liveConfig.whatsappButtonLabel || 'Size Concierge · WhatsApp Advice'}
                    onChange={(e) => updateField('whatsappButtonLabel', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xs ${
                      darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-medium mb-1 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Default WhatsApp Pre-filled Message
                  </label>
                  <textarea
                    rows={2}
                    value={liveConfig.whatsappWelcomeMessage || 'Assalam-o-Alaikum! I have a question about Bachpan PK collection.'}
                    onChange={(e) => updateField('whatsappWelcomeMessage', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xs leading-relaxed ${
                      darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300'
                    }`}
                  />
                </div>

                {/* Maintenance Mode Lock */}
                <div className="p-3 border rounded-xs bg-amber-500/10 border-amber-300/60 dark:border-amber-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="font-semibold block text-neutral-900 dark:text-neutral-100">
                        Maintenance Mode
                      </span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        Locks storefront with "Under Construction" overlay for public visitors
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={liveConfig.maintenanceMode}
                    onChange={(e) => updateField('maintenanceMode', e.target.checked)}
                    className="w-4 h-4 accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: LIVE STOREFRONT PREVIEW BOX (SIMULATED MINI-APP) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 sticky top-20">
          <div className={`border rounded-sm shadow-md overflow-hidden transition-all ${
            darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-300'
          }`}>
            
            {/* Browser Mockup Chrome Header */}
            <div className={`px-4 py-2.5 border-b flex items-center justify-between select-none ${
              darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              </div>

              {/* URL Pill */}
              <div className={`px-4 py-1 rounded-full text-[11px] font-mono flex items-center gap-2 border ${
                darkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700 shadow-2xs'
              }`}>
                <span className="text-emerald-500">🔒</span>
                <span>https://bachpan.pk</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#C89299]/15 text-[#C89299] font-bold">
                  ● Live Sync
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                <span>{deviceMode === 'desktop' ? '1280px' : deviceMode === 'tablet' ? '768px' : '390px'}</span>
              </div>
            </div>

            {/* Container for device preview */}
            <div className="p-3 sm:p-5 flex justify-center bg-neutral-200/40 dark:bg-neutral-900/40 min-h-[640px] max-h-[820px] overflow-y-auto">
              
              <div 
                style={{
                  width: deviceMode === 'desktop' ? '100%' : deviceMode === 'tablet' ? '768px' : '390px',
                  maxWidth: '100%',
                }}
                className={`transition-all duration-300 shadow-xl border rounded-md overflow-hidden text-left relative flex flex-col ${
                  isCustomerDark 
                    ? 'bg-[#121214] text-[#FAF6F0] border-neutral-800' 
                    : 'bg-[#FDFBF7] text-neutral-900 border-neutral-200'
                }`}
              >
                
                {/* 1. Preview Announcement Bar */}
                {liveConfig.showAnnouncementBar && (
                  <div className="bg-neutral-900 text-neutral-200 text-[9px] uppercase tracking-wider py-1.5 px-3 flex items-center justify-between border-b border-neutral-800">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shrink-0 animate-pulse" />
                      <span className="truncate">{liveConfig.announcementText || 'Complimentary Express Delivery Across Pakistan'}</span>
                    </div>
                    <span className="hidden sm:inline text-neutral-400 text-[8px]">Helpline: {liveConfig.supportPhoneNumber || '0300-1234567'}</span>
                  </div>
                )}

                {/* 2. Preview Luxury Navbar */}
                <div className={`px-4 py-3 border-b flex items-center justify-between transition-colors ${
                  isCustomerDark ? 'bg-[#18181b] border-neutral-800' : 'bg-white border-neutral-200/80'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">☰</span>
                    <span className={`text-[9px] uppercase tracking-wider hidden sm:inline ${isCustomerDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Concierge
                    </span>
                  </div>

                  <div className="text-center">
                    <h3 className={`font-serif text-sm sm:text-base font-normal tracking-[0.2em] uppercase ${
                      isCustomerDark ? 'text-white' : 'text-neutral-900'
                    }`}>
                      {liveConfig.headerLogoText || 'BACHPAN PK'}
                    </h3>
                    <p className={`text-[7px] uppercase tracking-[0.25em] -mt-0.5 ${
                      isCustomerDark ? 'text-neutral-400' : 'text-neutral-500'
                    }`}>
                      {liveConfig.headerTagline || 'PREMIUM KIDS WEAR'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Search className="w-3.5 h-3.5 opacity-70" />
                    <ShoppingBag className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </div>

                {/* 3. Preview Hero Section */}
                {liveConfig.showHeroBanner && (
                  <div 
                    style={{
                      height: `${Math.round((liveConfig.heroBannerHeight || 680) * 0.45)}px`,
                    }}
                    className="relative w-full overflow-hidden flex items-center justify-center text-center bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800"
                  >
                    {liveConfig.heroBannerMediaType === 'video' ? (
                      <video
                        src={liveConfig.heroBannerVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        style={{
                          transform: `scale(${(liveConfig.heroBannerScale || 100) / 100})`,
                          objectPosition: liveConfig.heroBannerFocalPoint || 'center',
                        }}
                      />
                    ) : (
                      <img
                        src={liveConfig.heroBannerImageUrl || 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=2000&q=85'}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                        style={{
                          transform: `scale(${(liveConfig.heroBannerScale || 100) / 100})`,
                          objectPosition: liveConfig.heroBannerFocalPoint || 'center',
                        }}
                      />
                    )}

                    {/* Dark gradient overlay for typography */}
                    <div className="absolute inset-0 bg-black/45" />

                    {/* Overlay Text */}
                    <div className="relative z-10 px-4 max-w-sm text-white space-y-1">
                      <span className="text-[8px] uppercase tracking-[0.28em] font-medium text-amber-200 block">
                        {liveConfig.heroBannerTag || 'Tiny ones, big firsts'}
                      </span>
                      <h4 className="font-serif text-sm sm:text-base font-normal leading-tight">
                        {liveConfig.heroBannerTitle || 'Thoughtfully Made For Childhood Memories'}
                      </h4>
                      <p className="text-[8px] font-light text-neutral-200 line-clamp-2 leading-relaxed">
                        {liveConfig.heroBannerSubtitle || 'Hand-tailored festive Baba Suits, fairy-tale chiffon frocks, and organic newborn essentials.'}
                      </p>
                      <div className="pt-1">
                        <span className="px-3 py-0.5 bg-[#C89299] text-white text-[8px] uppercase tracking-wider rounded-full shadow-2xs font-medium inline-block">
                          Shop New In
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Preview Trust Badges Bar */}
                {(liveConfig.showTrustBadgesBar ?? true) && (
                  <div className={`py-2 px-3 border-b grid grid-cols-3 divide-x text-[8px] ${
                    isCustomerDark ? 'bg-[#18181b] border-neutral-800 divide-neutral-800 text-neutral-200' : 'bg-[#FAF6F0] border-neutral-200 divide-neutral-200 text-neutral-800'
                  }`}>
                    <div className="flex items-center justify-center gap-1.5 px-1 truncate">
                      <Banknote className="w-3 h-3 text-[#C89299] shrink-0" />
                      <span className="font-serif font-medium truncate">{liveConfig.trustBadge1Title || 'COD Available'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 px-1 truncate">
                      <Truck className="w-3 h-3 text-[#C89299] shrink-0" />
                      <span className="font-serif font-medium truncate">{liveConfig.trustBadge2Title || 'PostEx Tracking'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 px-1 truncate">
                      <Camera className="w-3 h-3 text-[#C89299] shrink-0" />
                      <span className="font-serif font-medium truncate">{liveConfig.trustBadge3Title || 'Real Photo'}</span>
                    </div>
                  </div>
                )}

                {/* 5. Preview Categories 5-Column Grid */}
                {(liveConfig.showCategoryGrid ?? true) && (
                  <div className="p-3 space-y-2 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="text-center">
                      <span className="text-[7px] uppercase tracking-[0.25em] text-neutral-400 block">Curated Wardrobes</span>
                      <h5 className={`font-serif text-xs font-normal ${isCustomerDark ? 'text-white' : 'text-neutral-900'}`}>
                        {liveConfig.categorySectionTitle || 'Shop by category'}
                      </h5>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { title: 'Bodysuits', img: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80' },
                        { title: 'Sets', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=400&q=80' },
                        { title: 'Blankets', img: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=400&q=80' },
                        { title: 'Diaper Bags', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80' },
                        { title: 'Frocks', img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80' }
                      ].map((c) => (
                        <div key={c.title} className="relative aspect-[3/4] rounded-[6px] overflow-hidden bg-neutral-200">
                          <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <span className="absolute bottom-1 left-1 right-1 text-[8px] font-serif text-white truncate font-medium">
                            {c.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5b. Simulated Sponsor Banner Slot Preview */}
                {liveConfig.showSponsorBanner && (
                  <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 bg-[#C89299]/5">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-10 rounded-2xs overflow-hidden shrink-0 bg-neutral-200">
                        <img 
                          src={liveConfig.sponsorBannerImageUrl || 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80'} 
                          alt="Sponsor" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[7px] uppercase font-bold tracking-wider text-[#C89299] block truncate">
                          {liveConfig.sponsorBannerBadge || 'Partner Atelier Selection'}
                        </span>
                        <h6 className={`font-serif text-[10px] font-medium leading-tight truncate ${isCustomerDark ? 'text-white' : 'text-neutral-900'}`}>
                          {liveConfig.sponsorBannerTitle || 'Handcrafted Silver Keepsakes'}
                        </h6>
                        <p className="text-[7px] text-neutral-400 line-clamp-1 leading-none mt-0.5">
                          {liveConfig.sponsorBannerSubtitle}
                        </p>
                      </div>
                      <span className="text-[8px] px-2 py-0.5 rounded-full bg-[#C89299] text-white shrink-0 font-medium">
                        {liveConfig.sponsorBannerCtaText || 'Explore'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 6. Preview Product Cards Sample Grid */}
                <div className="p-3 space-y-2 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className={`font-serif text-xs ${isCustomerDark ? 'text-white' : 'text-neutral-900'}`}>
                      {liveConfig.newArrivalsSectionTitle || 'New Arrivals · Fresh In'}
                    </span>
                    <span className="text-[8px] text-[#C89299] font-medium flex items-center gap-0.5">
                      View all <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {products.slice(0, 3).map((p) => {
                      const regPrice = p.originalPrice || Math.round((p.price * 1.35) / 50) * 50;
                      return (
                        <div key={p.id} className="space-y-1">
                          <div className="aspect-[3/4] rounded-[6px] overflow-hidden bg-neutral-200">
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <p className={`text-[8px] font-light truncate ${isCustomerDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                            {p.title}
                          </p>
                          <div className="flex items-baseline gap-1">
                            <span className={`font-serif text-[9px] font-bold ${isCustomerDark ? 'text-white' : 'text-neutral-900'}`}>
                              Rs. {p.price.toLocaleString()}
                            </span>
                            <span className="text-[7px] text-neutral-400 line-through">
                              Rs. {regPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Floating WhatsApp preview */}
                <div className="p-2 border-t flex items-center justify-between text-[8px] text-neutral-400 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <MessageCircle className="w-3 h-3" />
                    <span>{liveConfig.whatsappButtonLabel || 'Size Concierge · WhatsApp Advice'}</span>
                  </div>
                  <span>{liveConfig.whatsappNumber || '03001234567'}</span>
                </div>

                {/* Maintenance Banner Preview (If On) */}
                {liveConfig.maintenanceMode && (
                  <div className="absolute inset-0 z-50 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-2">
                    <ShieldAlert className="w-8 h-8 text-amber-500 animate-pulse" />
                    <h5 className="font-serif text-base">Atelier Under Construction</h5>
                    <p className="text-[10px] text-neutral-300 max-w-xs leading-relaxed">
                      We are curating our newest collection. Store is temporarily locked for visitors while changes are being published.
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Bottom preview info footer */}
            <div className={`p-2.5 border-t flex items-center justify-between text-[11px] ${
              darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-600'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>Synchronized with live JavaScript state variables</span>
              </div>
              <button
                type="button"
                onClick={handlePublish}
                disabled={saving}
                className="text-[#C89299] hover:underline font-semibold cursor-pointer"
              >
                Click "Publish Live Changes" to deploy to visitors →
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
