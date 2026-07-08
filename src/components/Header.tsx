import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  GitCompare,
  TrendingUp,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { ActivePage, Language, Theme, Product, CartItem } from '../types';
import { translations } from '../data/translations';
import { phoneProducts } from '../data/phones';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  setSelectedProductId: (id: string | null) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  favorites: string[];
  compareList: string[];
}

export default function Header({
  activePage,
  setActivePage,
  setSelectedProductId,
  lang,
  setLang,
  theme,
  setTheme,
  cart,
  setIsCartOpen,
  favorites,
  compareList,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'iPhone 15 Pro Max',
    'S24 Ultra',
    'Redmi Note 13',
  ]);

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + ' ' + t.currencyShort;
  };

  const navItems = [
    { page: 'home', label: t.navHome },
    { page: 'catalog', label: t.navCatalog },
    { page: 'installment', label: t.navInstallment },
    { page: 'trade-in', label: t.navTradeIn },
    { page: 'accessories', label: t.navAccessories },
    { page: 'promotions', label: t.navPromotions },
    { page: 'order-status', label: t.navOrderStatus },
  ] as { page: ActivePage; label: string }[];

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleSearchResultClick = (product: Product) => {
    setSelectedProductId(product.id);
    setActivePage('product-details');
    setIsSearchOpen(false);
    setSearchQuery('');
    
    // Add to recent searches
    if (!recentSearches.includes(product.name)) {
      setRecentSearches([product.name, ...recentSearches.slice(0, 4)]);
    }
  };

  const filteredProducts = searchQuery
    ? phoneProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Top Banner with store status */}
      <div className="bg-neutral-950 text-white text-[11px] py-1.5 px-4 flex justify-between items-center border-b border-white/5 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-neutral-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-500" />
            <span className="hidden sm:inline">{t.footerAddress}</span>
            <span className="inline sm:hidden">Tashkent, UZ</span>
          </span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>09:00 - 21:00</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:+998901234567" className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>+998 90 123 45 67</span>
          </a>
        </div>
      </div>

      <header
        className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 mx-auto w-[95%] max-w-7xl rounded-2xl border ${
          isScrolled
            ? 'bg-neutral-950/70 backdrop-blur-md shadow-lg border-white/5 py-3 shadow-glow-cyan'
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Logo */}
          <div
            onClick={() => {
              setActivePage('home');
              setSelectedProductId(null);
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              T
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white block leading-none">
                {t.appName}
              </span>
              <span className="text-[9px] font-medium tracking-widest text-neutral-500 dark:text-neutral-400 uppercase leading-none mt-1 block">
                VAQTI
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    setActivePage(item.page);
                    setSelectedProductId(null);
                  }}
                  className={`relative px-4 py-2 rounded-lg text-[13px] font-medium tracking-tight transition-all duration-200 ${
                    isActive
                      ? 'text-blue-600 dark:text-cyan-400 font-semibold'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon */}
            <button
              onClick={handleSearchClick}
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Compare Badge */}
            {compareList.length > 0 && (
              <button
                onClick={() => setActivePage('catalog')}
                className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors relative"
                aria-label="Compare"
              >
                <GitCompare className="w-[18px] h-[18px]" />
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* Favorite Icon */}
            <button
              onClick={() => setActivePage('catalog')}
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors relative"
              aria-label="Favorites"
            >
              <Heart className={`w-[18px] h-[18px] ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-[18px] h-[18px]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative group/lang">
              <button className="flex items-center gap-1 p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-[12px] font-semibold">
                <Globe className="w-[15px] h-[15px]" />
                <span className="uppercase">{lang}</span>
              </button>
              <div className="absolute right-0 mt-1.5 w-24 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden scale-90 opacity-0 pointer-events-none group-hover/lang:scale-100 group-hover/lang:opacity-100 group-hover/lang:pointer-events-auto transition-all duration-200">
                <button
                  onClick={() => setLang('uz')}
                  className={`w-full px-3 py-2 text-left text-[12px] font-medium transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                    lang === 'uz' ? 'text-blue-500 font-semibold' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  O‘zbekcha
                </button>
                <button
                  onClick={() => setLang('ru')}
                  className={`w-full px-3 py-2 text-left text-[12px] font-medium transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                    lang === 'ru' ? 'text-blue-500 font-semibold' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  Русский
                </button>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Theme toggle"
            >
              {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-sm h-full bg-white dark:bg-neutral-950 p-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="mt-20">
                <div className="flex justify-between items-center pb-6 border-b border-neutral-100 dark:border-neutral-900">
                  <span className="text-sm font-semibold tracking-wide uppercase text-neutral-400">Menyu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-1 mt-6">
                  {navItems.map((item) => {
                    const isActive = activePage === item.page;
                    return (
                      <button
                        key={item.page}
                        onClick={() => {
                          setActivePage(item.page);
                          setSelectedProductId(null);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`px-4 py-3.5 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors ${
                          isActive
                            ? 'bg-blue-600/10 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400'
                            : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Drawer Footer Contacts */}
              <div className="border-t border-neutral-100 dark:border-neutral-900 pt-6">
                <p className="text-xs text-neutral-400">{t.appName} – Premium Store</p>
                <div className="mt-3 flex flex-col gap-2">
                  <a href="tel:+998901234567" className="text-xs text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <span>+998 90 123 45 67</span>
                  </a>
                  <p className="text-xs text-neutral-500 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{t.footerAddress}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Instant Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-lg flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: -25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -25 }}
              className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-2xl border border-neutral-200/20 dark:border-neutral-800 shadow-2xl overflow-hidden"
            >
              {/* Search input field */}
              <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
                <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-neutral-900 dark:text-white placeholder-neutral-400 text-base font-medium focus:outline-none focus:ring-0"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-1 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions / Results Panel */}
              <div className="p-6 max-h-[420px] overflow-y-auto">
                {searchQuery === '' ? (
                  <div className="space-y-6">
                    {/* Suggested tags */}
                    <div>
                      <h4 className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase mb-3 flex items-center gap-1.5 font-mono">
                        <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                        {t.searchSuggestions}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {['iPhone', 'Samsung', 'Xiaomi', 'Nothing', 'AirPods', 'Watch'].map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchQuery(term)}
                            className="px-3.5 py-1.5 rounded-full bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors border border-neutral-200/10"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent searches */}
                    <div>
                      <h4 className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase mb-3 font-mono">
                        {t.recentSearches}
                      </h4>
                      <div className="space-y-1.5">
                        {recentSearches.map((term, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSearchQuery(term)}
                            className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center gap-2.5 transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{term}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {filteredProducts.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase mb-3 font-mono">
                          {t.foundProducts} ({filteredProducts.length})
                        </h4>
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                          {filteredProducts.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => handleSearchResultClick(p)}
                              className="flex items-center gap-4 py-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-xl px-2 transition-all duration-150 group"
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover border border-neutral-100 dark:border-neutral-800 group-hover:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                                  {p.name}
                                </h4>
                                <p className="text-xs text-neutral-400 font-medium mt-0.5">
                                  {p.brand} • {p.storage[0]}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                                  {formatPrice(p.price)}
                                </span>
                                {p.oldPrice && (
                                  <span className="text-[10px] text-neutral-400 line-through">
                                    {formatPrice(p.oldPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 space-y-2">
                        <MessageSquare className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto" />
                        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                          {t.noResults}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {lang === 'uz' ? 'Iltimos, so‘zni boshqacha yozib ko‘ring' : 'Пожалуйста, попробуйте изменить запрос'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
