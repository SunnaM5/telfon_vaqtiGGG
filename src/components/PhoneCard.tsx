import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, GitCompare, ShoppingCart, Eye, Star } from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../data/translations';

interface PhoneCardProps {
  product: Product;
  lang: Language;
  onAddToCart: (p: Product, storage: string, color: string) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  onToggleCompare: (id: string) => void;
  isCompared: boolean;
  onQuickView: (product: Product) => void;
  onClick: () => void;
  key?: string;
}

export default function PhoneCard({
  product,
  lang,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  onToggleCompare,
  isCompared,
  onQuickView,
  onClick,
}: PhoneCardProps) {
  const t = translations[lang];
  const [activeColorIdx, setActiveColorIdx] = useState(0);

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + ' ' + t.currencyShort;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-150/10 dark:border-white/5 rounded-3xl overflow-hidden p-4 relative flex flex-col justify-between group shadow-sm hover:shadow-glow-cyan transition-all duration-300"
    >
      {/* Discount Tag */}
      {product.discount && (
        <span className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full z-10 uppercase tracking-wider shadow-sm">
          -{product.discount}% {t.cardDiscount}
        </span>
      )}

      {/* Action Buttons Overlay */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className={`p-2.5 rounded-full backdrop-blur-md border shadow-lg transition-all ${
            isFavorite
              ? 'bg-rose-500 text-white border-rose-500/20'
              : 'bg-white/95 dark:bg-neutral-900/95 text-neutral-600 dark:text-neutral-300 border-neutral-200/20 hover:text-rose-500 dark:hover:text-rose-400'
          }`}
          title={t.cardFavorite}
        >
          <Heart className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(product.id);
          }}
          className={`p-2.5 rounded-full backdrop-blur-md border shadow-lg transition-all ${
            isCompared
              ? 'bg-cyan-500 text-white border-cyan-500/20'
              : 'bg-white/95 dark:bg-neutral-900/95 text-neutral-600 dark:text-neutral-300 border-neutral-200/20 hover:text-cyan-500 dark:hover:text-cyan-400'
          }`}
          title={t.cardCompare}
        >
          <GitCompare className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="p-2.5 rounded-full bg-white/95 dark:bg-neutral-900/95 text-neutral-600 dark:text-neutral-300 border border-neutral-200/20 shadow-lg hover:text-blue-500 dark:hover:text-blue-400 transition-all"
          title={t.cardQuickView}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Main product clickable area */}
      <div onClick={onClick} className="cursor-pointer flex-grow flex flex-col justify-between">
        {/* Product Image */}
        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-neutral-950/40 border border-neutral-150/5 dark:border-white/5 flex items-center justify-center relative">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-[82%] h-[82%] transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Availability pill */}
          <div className="absolute bottom-3 left-3">
            <span
              className={`text-[9px] font-bold tracking-wide px-2 py-0.5 rounded-full uppercase ${
                product.availability
                  ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20'
              }`}
            >
              {product.availability ? t.cardAvailabilityInStock : t.cardAvailabilityOutOfStock}
            </span>
          </div>
        </div>

        {/* Info content */}
        <div className="mt-4 space-y-2">
          {/* Brand and Specs */}
          <div className="flex justify-between items-center text-[11px] font-bold text-neutral-400 dark:text-neutral-500 font-mono">
            <span>{product.brand.toUpperCase()}</span>
            <span className="flex items-center gap-1">
              {product.storage[0]}
              {product.ram[0] !== 'N/A' && ` / ${product.ram[0]}`}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1 tracking-tight group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-200 dark:text-neutral-800'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 font-mono">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>

          {/* Color pickers */}
          <div className="flex gap-1.5 pt-1">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveColorIdx(idx);
                }}
                className={`micro-btn w-3.5 h-3.5 rounded-full border transition-all ${
                  activeColorIdx === idx
                    ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-neutral-950 scale-110'
                    : 'border-neutral-200/20 dark:border-neutral-800'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom price and CTA */}
      <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-between items-end gap-3">
        {/* Price layout */}
        <div className="space-y-1">
          {product.oldPrice && (
            <span className="text-xs text-neutral-400 line-through block font-mono">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <span className="text-base font-black text-neutral-950 dark:text-white block tracking-tight font-sans">
            {formatPrice(product.price)}
          </span>

          {/* Installment Badge */}
          <div className="inline-block bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md mt-1">
            <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-300 font-mono">
              {product.installment12.toLocaleString('uz-UZ')} {t.currencyShort} • 12 {t.cardInstallmentFrom}
            </span>
          </div>
        </div>

        {/* CTA Cart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (product.availability) {
              onAddToCart(
                product,
                product.storage[0],
                product.colors[activeColorIdx]?.name || product.colors[0].name
              );
            }
          }}
          disabled={!product.availability}
          className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
            product.availability
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/15 hover:scale-105 active:scale-95'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
          }`}
          title={t.cardAddedToCart}
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
