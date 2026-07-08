import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, ArrowUp, Send, MessageSquare, GitCompare } from 'lucide-react';

// Core layout components
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import ComparePanel from './components/ComparePanel';
import Notification, { ToastMessage } from './components/Notification';
import SEOHead from './components/SEOHead';

// Page views
import Home from './views/Home';
import Catalog from './views/Catalog';
import ProductDetails from './views/ProductDetails';
import InstallmentPage from './views/InstallmentPage';
import TradeInPage from './views/TradeInPage';
import OrderStatusPage from './views/OrderStatusPage';
import StaticPages from './views/StaticPages';

// Data types & assets
import { Product, Language, Theme, ActivePage, CartItem, OrderTrack } from './types';
import { mockOrders } from './data/orders';
import { translations } from './data/translations';

export default function App() {
  // --- 1. LOCAL PERSISTENT STATES ---
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('tv_lang');
    return (saved === 'uz' || saved === 'ru') ? saved : 'uz';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('tv_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tv_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('tv_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem('tv_compare');
    return saved ? JSON.parse(saved) : [];
  });

  const [mockOrdersList, setMockOrdersList] = useState<OrderTrack[]>(() => {
    const saved = localStorage.getItem('tv_orders');
    return saved ? JSON.parse(saved) : mockOrders;
  });

  // --- 2. TRANSITIONAL STATES ---
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSupportMenuOpen, setIsSupportMenuOpen] = useState(false);

  const t = translations[lang];

  // --- 3. PERSISTENCE & THEME SYNC EFFECTS ---
  useEffect(() => {
    localStorage.setItem('tv_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('tv_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tv_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tv_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('tv_compare', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('tv_orders', JSON.stringify(mockOrdersList));
  }, [mockOrdersList]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, selectedProductId]);

  // --- 4. TOAST NOTIFICATION ACTIONS ---
  const addToast = (text: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- 5. CART ACTIONS ---
  const handleAddToCart = (product: Product, storage: string, color: string) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedStorage === storage &&
        item.selectedColor === color
    );

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([
        ...cart,
        { product, quantity: 1, selectedStorage: storage, selectedColor: color },
      ]);
    }

    addToast(
      lang === 'uz'
        ? `${product.name} savatga qo‘shildi!`
        : `${product.name} добавлен в корзину!`,
      'success'
    );
  };

  const handleUpdateQty = (idx: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(idx);
      return;
    }
    const newCart = [...cart];
    newCart[idx].quantity = qty;
    setCart(newCart);
  };

  const handleRemoveCartItem = (idx: number) => {
    const removedItem = cart[idx];
    setCart(cart.filter((_, i) => i !== idx));
    if (removedItem) {
      addToast(
        lang === 'uz'
          ? `${removedItem.product.name} savatdan olindi.`
          : `${removedItem.product.name} удален из корзины.`,
        'info'
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckoutSuccess = (orderId: string) => {
    // Generate active order tracking record
    const totalValue = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const itemNames = cart.map((i) => `${i.product.name} (${i.selectedStorage})`).join(', ');

    const newRecord: OrderTrack = {
      id: orderId,
      customerName: 'Premium Customer',
      phoneNumber: '998901234567',
      productName: itemNames,
      totalPrice: totalValue,
      paymentMethod: 'cash',
      status: 'sent',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      history: [
        {
          status: 'sent',
          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
          descriptionUz: 'Buyurtmangiz savat orqali muvaffaqiyatli topshirildi. Operator bog‘lanishini kuting.',
          descriptionRu: 'Ваш заказ успешно оформлен через корзину. Ожидайте звонка оператора.',
        },
      ],
    };

    setMockOrdersList((prev) => [newRecord, ...prev]);

    addToast(
      lang === 'uz'
        ? `Buyurtma muvaffaqiyatli rasmiylashtirildi! ID: ${orderId}`
        : `Заказ успешно оформлен! ID: ${orderId}`,
      'success'
    );

    // Switch to order-status page directly to trace it!
    setActivePage('order-status');
  };

  // --- 6. FAVORITE ACTIONS ---
  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fId) => fId !== id));
      addToast(
        lang === 'uz' ? 'Saralanganlardan o‘chirildi' : 'Удалено из избранного',
        'info'
      );
    } else {
      setFavorites([...favorites, id]);
      addToast(
        lang === 'uz' ? 'Saralanganlarga qo‘shildi' : 'Добавлено в избранное',
        'success'
      );
    }
  };

  // --- 7. COMPARE ACTIONS ---
  const handleToggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter((cId) => cId !== id));
      addToast(
        lang === 'uz' ? 'Taqqoslashdan o‘chirildi' : 'Удалено из сравнения',
        'info'
      );
    } else {
      if (compareList.length >= 3) {
        addToast(
          lang === 'uz'
            ? 'Maksimal 3 ta smartfonni solishtirish mumkin.'
            : 'Можно сравнить максимум 3 смартфона.',
          'error'
        );
        return;
      }
      setCompareList([...compareList, id]);
      addToast(
        lang === 'uz' ? 'Taqqoslashga qo‘shildi' : 'Добавлено в сравнение',
        'success'
      );
    }
  };

  const handleClearCompare = () => {
    setCompareList([]);
    addToast(
      lang === 'uz' ? 'Taqqoslash ro‘yxati tozalandi' : 'Список сравнения очищен',
      'info'
    );
  };

  const handleRemoveCompareItem = (id: string) => {
    setCompareList(compareList.filter((cId) => cId !== id));
  };

  // --- 8. DYNAMIC VIEW SWITCHING RENDERING ---
  const renderActiveView = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home
            lang={lang}
            setActivePage={setActivePage}
            setSelectedProductId={setSelectedProductId}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onQuickView={setQuickViewProduct}
          />
        );
      case 'catalog':
        return (
          <Catalog
            key="catalog-all"
            initialCategory="all"
            lang={lang}
            setActivePage={setActivePage}
            setSelectedProductId={setSelectedProductId}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onQuickView={setQuickViewProduct}
          />
        );
      case 'accessories':
        return (
          <Catalog
            key="catalog-accessories"
            initialCategory="accessories"
            lang={lang}
            setActivePage={setActivePage}
            setSelectedProductId={setSelectedProductId}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onQuickView={setQuickViewProduct}
          />
        );
      case 'product-details':
        return (
          <ProductDetails
            productId={selectedProductId}
            lang={lang}
            setActivePage={setActivePage}
            setSelectedProductId={setSelectedProductId}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onAddToast={addToast}
          />
        );
      case 'installment':
        return (
          <InstallmentPage
            lang={lang}
            onAddToast={addToast}
            onAddMockOrder={(newOrder) => setMockOrdersList((prev) => [newOrder, ...prev])}
          />
        );
      case 'trade-in':
        return (
          <TradeInPage
            lang={lang}
            onAddToast={addToast}
            onAddMockOrder={(newOrder) => setMockOrdersList((prev) => [newOrder, ...prev])}
          />
        );
      case 'order-status':
        return (
          <OrderStatusPage
            lang={lang}
            mockOrdersList={mockOrdersList}
          />
        );
      case 'about':
      case 'contacts':
      case 'delivery':
      case 'warranty':
      case 'privacy':
      case 'terms':
        return (
          <StaticPages
            pageType={activePage}
            lang={lang}
            onAddToast={addToast}
          />
        );
      default:
        return (
          <Home
            lang={lang}
            setActivePage={setActivePage}
            setSelectedProductId={setSelectedProductId}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onQuickView={setQuickViewProduct}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors duration-300 flex flex-col font-sans select-none antialiased">
      {/* Dynamic Search Engine Metadata Optimization Injector */}
      <SEOHead page={activePage} lang={lang} />

      {/* Primary Navigation System */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        setSelectedProductId={setSelectedProductId}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        favorites={favorites}
        compareList={compareList}
      />

      {/* Main View Transition Frame */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage + (selectedProductId || '')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Interactive Comparison Ribbon (Shows up at screen footer when products are selected) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-6 z-30">
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setIsCompareOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 uppercase tracking-wider font-mono"
          >
            <GitCompare className="w-4.5 h-4.5" />
            <span>
              {lang === 'uz' ? 'Solishtirish' : 'Сравнить'} ({compareList.length})
            </span>
          </motion.button>
        </div>
      )}

      {/* Primary Footer System */}
      <Footer
        setActivePage={setActivePage}
        setSelectedProductId={setSelectedProductId}
        lang={lang}
        onSubscribe={(msg) => addToast(msg, 'success')}
      />

      {/* UI Panels & Overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        lang={lang}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        lang={lang}
        onAddToCart={handleAddToCart}
        onViewFullDetails={(id) => {
          setSelectedProductId(id);
          setActivePage('product-details');
        }}
      />

      {isCompareOpen && (
        <ComparePanel
          compareList={compareList}
          lang={lang}
          onRemove={handleRemoveCompareItem}
          onClear={handleClearCompare}
          onClose={() => setIsCompareOpen(false)}
        />
      )}

      {/* iOS-Style Toast Manager */}
      <Notification toasts={toasts} removeToast={removeToast} />

      {/* Floating Customer Support Action Widget & Back-To-Top */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
        {/* Support Menu Expandable Option Bubbles */}
        <AnimatePresence>
          {isSupportMenuOpen && (
            <div className="flex flex-col items-end gap-2 mb-1">
              {/* Telegram support link */}
              <motion.a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.8 }}
                className="flex items-center gap-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg border border-white/10 uppercase tracking-wider font-mono"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram Support</span>
              </motion.a>

              {/* Direct call support link */}
              <motion.a
                href="tel:+998901234567"
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg border border-neutral-800 uppercase tracking-wider font-mono"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+998 90 123 45 67</span>
              </motion.a>
            </div>
          )}
        </AnimatePresence>

        {/* Floating Support Hub Toggle & Scroll-To-Top Ribbon */}
        <div className="flex gap-3">
          {/* Back to top button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-3.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 shadow-xl transition-all"
                title={t.supportBackToTop}
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Primary Hub button */}
          <button
            onClick={() => setIsSupportMenuOpen(!isSupportMenuOpen)}
            className="p-4 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Toggle support menu"
          >
            <MessageSquare className="w-5.5 h-5.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
