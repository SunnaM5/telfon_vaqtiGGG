import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Sparkles, Phone, User, MapPin } from 'lucide-react';
import { CartItem, Language } from '../types';
import { translations } from '../data/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  cart: CartItem[];
  onUpdateQty: (idx: number, qty: number) => void;
  onRemoveItem: (idx: number) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (orderId: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  lang,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
}: CartDrawerProps) {
  const t = translations[lang];
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Checkout Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'installment'>('cash');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const delivery = 0; // Free
  const total = subtotal + delivery;

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + ' ' + t.currencyShort;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) return;

    // Generate a random high-fidelity order number
    const randomOrderId = Math.floor(1000 + Math.random() * 9000);
    onCheckoutSuccess(`ORD-${randomOrderId}`);
    setIsCheckingOut(false);
    onClearCart();
    onClose();

    // Reset Form
    setFullName('');
    setPhone('');
    setAddress('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex justify-end"
          onClick={onClose}
        >
          {/* Main Slide panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-full max-w-md h-full bg-white dark:bg-neutral-950 shadow-2xl p-6 flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-4 border-b border-neutral-150 dark:border-neutral-900 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <h3 className="text-base font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  {isCheckingOut ? t.checkoutTitle : t.cartTitle}
                </h3>
                <span className="bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-xs font-bold px-2 py-0.5 rounded-full font-mono">
                  {cart.length}
                </span>
              </div>
              <button
                onClick={() => {
                  if (isCheckingOut) {
                    setIsCheckingOut(false);
                  } else {
                    onClose();
                  }
                }}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Middle Content */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 && !isCheckingOut ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 dark:text-neutral-700 animate-bounce" />
                  <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                    {t.cartEmpty}
                  </p>
                  <button
                    onClick={onClose}
                    className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                  >
                    {t.heroCtaBuy} →
                  </button>
                </div>
              ) : isCheckingOut ? (
                /* Checkout Form Panel */
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono">
                      {t.instFullName}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        required
                        placeholder="Shuhrat Uldashev"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full text-xs py-3.5 pl-10 pr-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono">
                      {t.instPhone}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                      <input
                        type="tel"
                        required
                        placeholder="998 90 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs py-3.5 pl-10 pr-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono">
                      {lang === 'uz' ? 'Manzilingiz' : 'Ваш адрес'}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        required
                        placeholder={lang === 'uz' ? 'Toshkent sh., Chilonzor tumani, Qatortol, 24-uy' : 'г. Ташкент, Чиланзарский р-н, ул. Катартал, д. 24'}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full text-xs py-3.5 pl-10 pr-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono">
                      {lang === 'uz' ? 'To‘lov uslubi' : 'Способ оплаты'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-3 rounded-xl border text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'cash'
                            ? 'bg-blue-600/10 text-blue-600 border-blue-500/30'
                            : 'bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>{t.prodBuyCash}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('installment')}
                        className={`p-3 rounded-xl border text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'installment'
                            ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30'
                            : 'bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{t.prodApplyInstallment}</span>
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* Shopping List Item Panel */
                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedStorage}`}
                      className="flex gap-4 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/10 dark:border-neutral-800/30 relative group"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-xl border border-neutral-100 dark:border-neutral-800"
                        referrerPolicy="no-referrer"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-neutral-400 font-bold mt-0.5 uppercase font-mono">
                          {item.selectedStorage} • {item.selectedColor}
                        </p>
                        <p className="text-xs font-black text-neutral-900 dark:text-white mt-1.5 font-mono">
                          {formatPrice(item.product.price)}
                        </p>

                        {/* Qty selectors */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => onUpdateQty(idx, item.quantity - 1)}
                            className="p-1 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200/25 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-neutral-900 dark:text-white font-mono w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(idx, item.quantity + 1)}
                            className="p-1 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200/25 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Trash bin */}
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="absolute top-3.5 right-3.5 text-neutral-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Checkout details Panel */}
            {cart.length > 0 && (
              <div className="border-t border-neutral-100 dark:border-neutral-900 pt-4 space-y-4 shrink-0 bg-white dark:bg-neutral-950">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-500 dark:text-neutral-400 font-medium">
                    <span>{t.cartSubtotal}</span>
                    <span className="font-mono">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500 dark:text-neutral-400 font-medium">
                    <span>{t.cartDelivery}</span>
                    <span className="text-emerald-500 font-bold font-sans uppercase">{t.cartDeliveryFree}</span>
                  </div>
                  <div className="flex justify-between text-neutral-900 dark:text-white font-black text-sm pt-1 border-t border-neutral-100 dark:border-neutral-900/60">
                    <span>{t.cartTotal}</span>
                    <span className="font-mono text-base">{formatPrice(total)}</span>
                  </div>
                </div>

                {isCheckingOut ? (
                  <button
                    type="submit"
                    form="checkout-form"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/15"
                  >
                    <span>{lang === 'uz' ? 'Tasdiqlash va yuborish' : 'Подтвердить и отправить'}</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onClearCart()}
                      className="px-4 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      title={t.cartClear}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsCheckingOut(true)}
                      className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <span>{t.cartCheckoutBtn}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
