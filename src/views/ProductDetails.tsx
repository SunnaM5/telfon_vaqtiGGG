import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  ShieldCheck,
  Truck,
  Heart,
  GitCompare,
  ShoppingBag,
  Sparkles,
  RefreshCw,
  Plus,
  Send,
  MessageSquare,
  BadgeAlert,
} from 'lucide-react';
import { Product, Language, ActivePage } from '../types';
import { translations } from '../data/translations';
import { phoneProducts } from '../data/phones';

interface ProductDetailsProps {
  productId: string | null;
  lang: Language;
  setActivePage: (page: ActivePage) => void;
  setSelectedProductId: (id: string | null) => void;
  onAddToCart: (p: Product, storage: string, color: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  compareList: string[];
  onToggleCompare: (id: string) => void;
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export default function ProductDetails({
  productId,
  lang,
  setActivePage,
  setSelectedProductId,
  onAddToCart,
  favorites,
  onToggleFavorite,
  compareList,
  onToggleCompare,
  onAddToast,
}: ProductDetailsProps) {
  const t = translations[lang];

  // Retrieve matching product
  const product = useMemo(() => {
    return phoneProducts.find((p) => p.id === productId) || phoneProducts[0];
  }, [productId]);

  // Gallery Active Image
  const [activeImage, setActiveImage] = useState(product.images[0] || product.image);

  // Specifications Tab Selection
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'reviews'>('specs');

  // Selected Option States
  const [selectedStorage, setSelectedStorage] = useState(product.storage[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');

  // Add review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState(product.reviews);

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + ' ' + t.currencyShort;
  };

  // Find other products for recommendations
  const relatedProducts = useMemo(() => {
    return phoneProducts.filter((p) => p.id !== product.id).slice(0, 4);
  }, [product.id]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newReview = {
      id: Math.random().toString(),
      userName: reviewName,
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment,
    };

    setLocalReviews([newReview, ...localReviews]);
    onAddToast(lang === 'uz' ? 'Fikringiz muvaffaqiyatli qo‘shildi!' : 'Ваш отзыв успешно добавлен!', 'success');

    // Reset review form
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
  };

  const isFavorite = favorites.includes(product.id);
  const isCompared = compareList.includes(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24 space-y-16">
      {/* Dynamic SEO Tag (handled in root, but matches) */}
      
      {/* Top Breadcrumbs */}
      <div className="text-xs font-bold text-neutral-400 font-mono tracking-wider uppercase">
        <span className="cursor-pointer hover:text-neutral-950" onClick={() => setActivePage('home')}>
          {t.navHome}
        </span>
        <span className="mx-2">•</span>
        <span className="cursor-pointer hover:text-neutral-950" onClick={() => setActivePage('catalog')}>
          {t.navCatalog}
        </span>
        <span className="mx-2">•</span>
        <span className="text-neutral-600 dark:text-neutral-300">{product.name}</span>
      </div>

      {/* Grid structure: Left gallery, Right controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square w-full rounded-3xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-900/60 flex items-center justify-center p-8 relative overflow-hidden">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={activeImage}
              alt={product.name}
              className="w-[85%] h-[85%] object-contain"
              referrerPolicy="no-referrer"
            />
            {product.discount && (
              <span className="absolute top-6 left-6 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                -{product.discount}% {t.cardDiscount}
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl p-2 border bg-neutral-50 dark:bg-neutral-950/20 flex items-center justify-center transition-all ${
                    activeImage === img
                      ? 'border-blue-600 ring-2 ring-blue-500/20 dark:ring-offset-neutral-950'
                      : 'border-neutral-200/60 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Purchasing Specs & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase font-mono block">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight mt-1">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-200 dark:text-neutral-800'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 font-mono">
                {product.rating} ({localReviews.length} {t.prodReviews})
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl font-medium">
            {product.description}
          </p>

          {/* Option Color Pickers */}
          {product.colors.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                {t.prodSelectColor}: <span className="text-neutral-400 font-bold">{selectedColor}</span>
              </h4>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-8 h-8 rounded-full border transition-all ${
                      selectedColor === c.name
                        ? 'ring-2 ring-offset-2 ring-blue-500 scale-105'
                        : 'border-neutral-200 dark:border-neutral-800'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Option Storage Pickers */}
          {product.storage[0] !== 'N/A' && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                {t.prodSelectStorage}:
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {product.storage.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStorage(st)}
                    className={`text-xs px-5 py-3 rounded-xl font-black border transition-all ${
                      selectedStorage === st
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/10'
                        : 'bg-transparent text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Panel */}
          <div className="p-6 rounded-[28px] bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-800/60 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Cash Price */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-400 block uppercase font-mono">
                {lang === 'uz' ? 'Naqd xarid narxi' : 'Стоимость за наличные'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-neutral-950 dark:text-white font-sans tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-xs text-neutral-400 line-through font-mono">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Installment Price */}
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/10 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 block uppercase font-mono">
                {lang === 'uz' ? 'Muddatli to‘lov (12 oy)' : 'В рассрочку на 12 мес'}
              </span>
              <span className="text-lg font-black text-blue-600 dark:text-cyan-400 block font-mono">
                {product.installment12.toLocaleString('uz-UZ')} {t.currencyShort} <span className="text-xs text-neutral-400">/{lang === 'uz' ? 'oyiga' : 'в мес'}</span>
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => onAddToCart(product, selectedStorage, selectedColor)}
              disabled={!product.availability}
              className={`flex-1 py-4.5 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all ${
                product.availability
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/15 hover:scale-105 active:scale-95'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{t.prodBuyCash}</span>
            </button>

            <button
              onClick={() => setActivePage('installment')}
              className="flex-1 py-4.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-750 font-bold flex items-center justify-center gap-2.5 transition-transform hover:scale-105 active:scale-95 border border-neutral-800"
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{t.prodApplyInstallment}</span>
            </button>
          </div>

          {/* Extra utility badges */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-150 dark:border-neutral-900/60 text-xs text-neutral-500 font-medium">
            <button
              onClick={() => onToggleFavorite(product.id)}
              className="flex items-center gap-2 hover:text-rose-500 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{lang === 'uz' ? 'Saralanganlarga qo‘shish' : 'В избранное'}</span>
            </button>
            <button
              onClick={() => onToggleCompare(product.id)}
              className="flex items-center gap-2 hover:text-cyan-500 transition-colors"
            >
              <GitCompare className={`w-4 h-4 ${isCompared ? 'text-cyan-500' : ''}`} />
              <span>{lang === 'uz' ? 'Solishtirish ro‘yxati' : 'Сравнить'}</span>
            </button>
            <button
              onClick={() => setActivePage('trade-in')}
              className="flex items-center gap-2 hover:text-purple-500 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" />
              <span>{t.prodTradeInCta}</span>
            </button>
          </div>

          {/* USP Badges */}
          <div className="grid grid-cols-2 gap-4 pt-4 bg-neutral-50 dark:bg-neutral-950/40 p-4 rounded-2xl border border-neutral-150 dark:border-neutral-900/40">
            <div className="flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">
                {t.prodWarrantyText}
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <Truck className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">
                {t.prodDeliveryText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs segment: Specifications, Description, Reviews */}
      <div className="pt-8">
        <div className="flex border-b border-neutral-150 dark:border-neutral-900">
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {t.prodSpecifications}
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'desc'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {t.prodDescription}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {t.prodReviews} ({localReviews.length})
          </button>
        </div>

        {/* Tab panels rendering */}
        <div className="py-6">
          {activeTab === 'specs' && (
            <div className="bg-white dark:bg-neutral-950/20 rounded-3xl border border-neutral-150 dark:border-neutral-850 overflow-hidden max-w-3xl">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <tbody>
                  {product.specifications.map((spec, idx) => (
                    <tr
                      key={spec.label}
                      className={`border-b border-neutral-100 dark:border-neutral-900 ${
                        idx % 2 === 0 ? 'bg-neutral-50/50 dark:bg-neutral-900/20' : ''
                      }`}
                    >
                      <td className="p-4 font-bold text-neutral-400 dark:text-neutral-500 w-1/3">
                        {spec.label}
                      </td>
                      <td className="p-4 font-semibold text-neutral-800 dark:text-neutral-200">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'desc' && (
            <div className="max-w-3xl space-y-4">
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                {product.description}
              </p>
              {product.features.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                    {lang === 'uz' ? 'Xususiyatlari:' : 'Преимущества:'}
                  </h4>
                  <ul className="list-disc list-inside text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5 font-medium pl-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Review Lists */}
              <div className="lg:col-span-7 space-y-6">
                {localReviews.length === 0 ? (
                  <p className="text-xs text-neutral-400 font-bold">{t.prodNoReviews}</p>
                ) : (
                  <div className="space-y-6">
                    {localReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-800/60 space-y-2"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <div>
                            <h5 className="font-extrabold text-neutral-900 dark:text-white">
                              {rev.userName}
                            </h5>
                            <span className="text-[10px] text-neutral-400 font-bold font-mono">
                              {rev.date}
                            </span>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating ? 'fill-current' : 'text-neutral-200 dark:text-neutral-800'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add review form right side */}
              <div className="lg:col-span-5 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-150 dark:border-neutral-800/40 space-y-4">
                <h4 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                  {t.prodAddReview}
                </h4>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      {lang === 'uz' ? 'Ismingiz' : 'Ваше имя'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sherzod"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full text-xs py-3 px-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white"
                    />
                  </div>

                  {/* Star selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono block">
                      {t.prodYourRating}
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating ? 'fill-current' : 'text-neutral-200 dark:text-neutral-800'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      {t.prodYourComment}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full text-xs py-3 px-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-750 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.prodSubmitReview}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related/Recommended Products */}
      <div className="pt-8 space-y-6">
        <h3 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
          {t.prodRelatedProducts}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProductId(p.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 rounded-2xl overflow-hidden p-4 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-lg transition-all"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-36 h-36 mx-auto object-contain transition-transform group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="mt-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                  {p.brand}
                </span>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {p.name}
                </h4>
                <p className="text-xs font-black text-neutral-900 dark:text-white font-mono">
                  {formatPrice(p.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
