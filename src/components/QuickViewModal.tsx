import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingBag, Eye, Calendar, Sparkles } from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../data/translations';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  lang: Language;
  onAddToCart: (p: Product, storage: string, color: string) => void;
  onViewFullDetails: (id: string) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  lang,
  onAddToCart,
  onViewFullDetails,
}: QuickViewModalProps) {
  if (!product) return null;

  const t = translations[lang];
  const [selectedStorage, setSelectedStorage] = useState(product.storage[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [installmentMonths, setInstallmentMonths] = useState(12);

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + ' ' + t.currencyShort;
  };

  // Simple math for installment:
  // 3 months: base / 3 + 3% fee
  // 6 months: base / 6 + 6% fee
  // 9 months: base / 9 + 9% fee
  // 12 months: base / 12 + 12% fee
  const calculateInstallment = (months: number) => {
    const interestRates: Record<number, number> = { 3: 1.03, 6: 1.06, 9: 1.09, 12: 1.12 };
    const rate = interestRates[months] || 1;
    const totalWithInterest = product.price * rate;
    return Math.round(totalWithInterest / months);
  };

  const monthlyPayment = calculateInstallment(installmentMonths);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Gallery Preview Left */}
            <div className="md:col-span-5 bg-neutral-50 dark:bg-neutral-950/40 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-900/50 flex flex-col justify-center items-center aspect-square relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-[85%] h-[85%] object-cover"
                referrerPolicy="no-referrer"
              />
              {product.discount && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  -{product.discount}% {t.cardDiscount}
                </span>
              )}
            </div>

            {/* Info details Right */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase font-mono">
                  {product.brand}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight mt-1">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
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
                    {product.rating} ({product.reviewsCount} {t.prodReviews})
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {product.description}
              </p>

              {/* Colors selection */}
              {product.colors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                    {t.prodSelectColor}: <span className="text-neutral-400">{selectedColor}</span>
                  </h4>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border transition-all ${
                          selectedColor === c.name
                            ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-neutral-900 scale-105'
                            : 'border-neutral-200/20 dark:border-neutral-800'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Storage selection */}
              {product.storage[0] !== 'N/A' && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                    {t.prodSelectStorage}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.storage.map((st) => (
                      <button
                        key={st}
                        onClick={() => setSelectedStorage(st)}
                        className={`text-xs px-4 py-2 rounded-xl font-bold border transition-all ${
                          selectedStorage === st
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10'
                            : 'bg-transparent text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Installment Calculator widget */}
              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-900 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    {t.instCalculator}
                  </span>
                  <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {lang === 'uz' ? '0% Boshlang‘ich to‘lov' : '0% Первый взнос'}
                  </span>
                </div>

                {/* Term switcher */}
                <div className="grid grid-cols-4 gap-1 bg-white dark:bg-neutral-900 p-1 rounded-2xl border border-neutral-200/10">
                  {[3, 6, 9, 12].map((m) => (
                    <button
                      key={m}
                      onClick={() => setInstallmentMonths(m)}
                      className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-all ${
                        installmentMonths === m
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {m} {lang === 'uz' ? 'oy' : 'мес'}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-end pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase font-mono">
                      {t.instMonthlyPayment}
                    </span>
                    <span className="text-lg font-black text-neutral-900 dark:text-white font-mono">
                      {monthlyPayment.toLocaleString('uz-UZ')} {t.currencyShort}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase font-mono">
                      {t.instTotalPrice}
                    </span>
                    <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 font-mono">
                      {(monthlyPayment * installmentMonths).toLocaleString('uz-UZ')} {t.currencyShort}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    onAddToCart(product, selectedStorage, selectedColor);
                    onClose();
                  }}
                  disabled={!product.availability}
                  className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                    product.availability
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/15'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t.prodBuyCash}</span>
                  <span className="font-mono text-sm ml-1">({formatPrice(product.price)})</span>
                </button>

                <button
                  onClick={() => {
                    onViewFullDetails(product.id);
                    onClose();
                  }}
                  className="py-4 px-6 rounded-2xl bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-750 text-white font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Eye className="w-5 h-5" />
                  <span>{lang === 'uz' ? 'Batafsil ma’lumot' : 'Подробнее'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
