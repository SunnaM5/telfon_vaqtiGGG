import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  XOctagon,
  Search,
  Grid,
  Filter,
} from 'lucide-react';
import { Product, Language, ActivePage } from '../types';
import { translations } from '../data/translations';
import { phoneProducts } from '../data/phones';
import PhoneCard from '../components/PhoneCard';

interface CatalogProps {
  lang: Language;
  setActivePage: (page: ActivePage) => void;
  setSelectedProductId: (id: string | null) => void;
  onAddToCart: (p: Product, storage: string, color: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  compareList: string[];
  onToggleCompare: (id: string) => void;
  onQuickView: (product: Product) => void;
  initialCategory?: 'phones' | 'accessories' | 'all';
  key?: string;
}

export default function Catalog({
  lang,
  setActivePage,
  setSelectedProductId,
  onAddToCart,
  favorites,
  onToggleFavorite,
  compareList,
  onToggleCompare,
  onQuickView,
  initialCategory = 'all',
}: CatalogProps) {
  const t = translations[lang];

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<'phones' | 'accessories' | 'all'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 25000000 });
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'popular' | 'cheap' | 'expensive' | 'rating'>('popular');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Available Filter Options gathered dynamically
  const brands = useMemo(() => {
    const list = phoneProducts.map((p) => p.brand);
    return Array.from(new Set(list));
  }, []);

  const ramOptions = ['8GB', '12GB', '16GB'];
  const storageOptions = ['128GB', '256GB', '512GB', '1TB'];
  
  const colorsList = useMemo(() => {
    const list: { name: string; hex: string }[] = [];
    const seen = new Set<string>();
    phoneProducts.forEach((p) => {
      p.colors.forEach((c) => {
        if (!seen.has(c.name)) {
          seen.add(c.name);
          list.push(c);
        }
      });
    });
    return list;
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + ' ' + t.currencyShort;
  };

  // Filter and Sort Engine
  const filteredProducts = useMemo(() => {
    let result = [...phoneProducts];

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Brands
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Price Range
    result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);

    // RAM
    if (selectedRam.length > 0) {
      result = result.filter((p) => p.ram.some((r) => selectedRam.includes(r)));
    }

    // Storage
    if (selectedStorage.length > 0) {
      result = result.filter((p) => p.storage.some((st) => selectedStorage.includes(st)));
    }

    // Availability
    if (onlyAvailable) {
      result = result.filter((p) => p.availability);
    }

    // Colors
    if (selectedColors.length > 0) {
      result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c.name)));
    }

    // Sorting
    switch (sortBy) {
      case 'cheap':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'expensive':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
    }

    return result;
  }, [
    selectedCategory,
    searchQuery,
    selectedBrands,
    priceRange,
    selectedRam,
    selectedStorage,
    onlyAvailable,
    selectedColors,
    sortBy,
  ]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleRam = (ram: string) => {
    setSelectedRam((prev) =>
      prev.includes(ram) ? prev.filter((r) => r !== ram) : [...prev, ram]
    );
  };

  const toggleStorage = (st: string) => {
    setSelectedStorage((prev) =>
      prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 25000000 });
    setSelectedRam([]);
    setSelectedStorage([]);
    setOnlyAvailable(false);
    setSelectedColors([]);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24">
      {/* Top Breadcrumb Header and Banner */}
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 font-mono tracking-wider uppercase block">
            {t.appName} • {t.navCatalog}
          </span>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            {selectedCategory === 'accessories'
              ? t.navAccessories
              : selectedCategory === 'phones'
              ? lang === 'uz' ? 'Smartfonlar va telefonlar' : 'Смартфоны и телефоны'
              : t.navCatalog}
          </h1>
        </div>

        {/* Category Tabs & Quick Search */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-neutral-50 dark:bg-neutral-900/40 p-3 rounded-2xl border border-neutral-150 dark:border-neutral-800/40">
          {/* Tabs */}
          <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200/10">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {t.allCategories}
            </button>
            <button
              onClick={() => setSelectedCategory('phones')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                selectedCategory === 'phones'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {lang === 'uz' ? 'Telefonlar' : 'Телефоны'}
            </button>
            <button
              onClick={() => setSelectedCategory('accessories')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                selectedCategory === 'accessories'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {t.navAccessories}
            </button>
          </div>

          {/* Local quick search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs py-3 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        {/* Sort and Filters Bar controls */}
        <div className="flex justify-between items-center bg-white dark:bg-neutral-950/20 py-2">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 font-mono">
            {t.foundProducts}: {filteredProducts.length}
          </span>

          <div className="flex gap-2">
            {/* Mobile filter button */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-700 dark:text-neutral-300 flex items-center gap-2 text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>{t.filterTitle}</span>
            </button>

            {/* Sort Dropdown Selector */}
            <div className="relative group/sort">
              <button className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-700 dark:text-neutral-300 flex items-center gap-2 text-xs font-bold bg-white dark:bg-neutral-900">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>
                  {sortBy === 'popular'
                    ? t.sortPopular
                    : sortBy === 'cheap'
                    ? t.sortCheapFirst
                    : sortBy === 'expensive'
                    ? t.sortExpensiveFirst
                    : t.sortRating}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden scale-90 opacity-0 pointer-events-none group-hover/sort:scale-100 group-hover/sort:opacity-100 group-hover/sort:pointer-events-auto transition-all duration-200 z-20">
                <button
                  onClick={() => setSortBy('popular')}
                  className={`w-full px-4 py-2.5 text-left text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                    sortBy === 'popular' ? 'text-blue-500' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {t.sortPopular}
                </button>
                <button
                  onClick={() => setSortBy('cheap')}
                  className={`w-full px-4 py-2.5 text-left text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                    sortBy === 'cheap' ? 'text-blue-500' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {t.sortCheapFirst}
                </button>
                <button
                  onClick={() => setSortBy('expensive')}
                  className={`w-full px-4 py-2.5 text-left text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                    sortBy === 'expensive' ? 'text-blue-500' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {t.sortExpensiveFirst}
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`w-full px-4 py-2.5 text-left text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                    sortBy === 'rating' ? 'text-blue-500' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {t.sortRating}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Area: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block space-y-6 p-6 rounded-[28px] bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 h-fit">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
              {t.filterTitle}
            </h3>
            {(selectedBrands.length > 0 ||
              priceRange.min > 0 ||
              priceRange.max < 25000000 ||
              selectedRam.length > 0 ||
              selectedStorage.length > 0 ||
              onlyAvailable ||
              selectedColors.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1 font-mono uppercase"
              >
                {lang === 'uz' ? 'Tozalash' : 'Сбросить'}
              </button>
            )}
          </div>

          {/* Brand block */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
              {t.filterBrand}
            </h4>
            <div className="space-y-1.5">
              {brands.map((b) => (
                <label key={b} className="flex items-center gap-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => toggleBrand(b)}
                    className="w-4.5 h-4.5 rounded border-neutral-300 dark:border-neutral-800 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price ranges */}
          <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
              {t.filterPrice}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold text-neutral-400 font-mono">MIN</span>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-full text-xs p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold text-neutral-400 font-mono">MAX</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-full text-xs p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* RAM block (only relevant for phones category) */}
          {selectedCategory !== 'accessories' && (
            <div className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                {t.filterRam}
              </h4>
              <div className="space-y-1.5">
                {ramOptions.map((r) => (
                  <label key={r} className="flex items-center gap-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRam.includes(r)}
                      onChange={() => toggleRam(r)}
                      className="w-4.5 h-4.5 rounded border-neutral-300 dark:border-neutral-800 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ROM block (only relevant for phones) */}
          {selectedCategory !== 'accessories' && (
            <div className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                {t.filterStorage}
              </h4>
              <div className="space-y-1.5">
                {storageOptions.map((st) => (
                  <label key={st} className="flex items-center gap-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStorage.includes(st)}
                      onChange={() => toggleStorage(st)}
                      className="w-4.5 h-4.5 rounded border-neutral-300 dark:border-neutral-800 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{st}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Colors Filter */}
          <div className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
              {t.filterColor}
            </h4>
            <div className="flex flex-wrap gap-2">
              {colorsList.map((c) => (
                <button
                  key={c.name}
                  onClick={() => toggleColor(c.name)}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    selectedColors.includes(c.name)
                      ? 'ring-2 ring-offset-2 ring-blue-500 scale-105'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Only Available checkbox */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <label className="flex items-center gap-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={() => setOnlyAvailable(!onlyAvailable)}
                className="w-4.5 h-4.5 rounded border-neutral-300 dark:border-neutral-800 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>{t.filterAvailability}</span>
            </label>
          </div>
        </aside>

        {/* RESULTS GRID AREA */}
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p) => (
                  <PhoneCard
                    key={p.id}
                    product={p}
                    lang={lang}
                    onAddToCart={onAddToCart}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={favorites.includes(p.id)}
                    onToggleCompare={onToggleCompare}
                    isCompared={compareList.includes(p.id)}
                    onQuickView={onQuickView}
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setActivePage('product-details');
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-850 p-16 rounded-[32px] text-center space-y-4 max-w-lg mx-auto mt-12">
              <XOctagon className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto animate-pulse" />
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                  {t.noResults}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {lang === 'uz'
                    ? 'Siz tanlagan filtrlar bo‘yicha hech qanday mahsulot topilmadi. Filtr kiritishlarini o‘zgartiring yoki filtrlarni tozalang.'
                    : 'По вашим критериям товары не найдены. Попробуйте изменить параметры или сбросить все фильтры.'}
                </p>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl transition-colors"
              >
                {t.clearAllFilters}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTERS SLIDEOVER OVERLAY */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md lg:hidden flex justify-start"
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-xs h-full bg-white dark:bg-neutral-950 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-100 dark:border-neutral-900">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                    {t.filterTitle}
                  </h3>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Brand */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                    {t.filterBrand}
                  </h4>
                  <div className="space-y-1.5">
                    {brands.map((b) => (
                      <label key={b} className="flex items-center gap-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b)}
                          onChange={() => toggleBrand(b)}
                          className="w-4.5 h-4.5 rounded border-neutral-300 dark:border-neutral-800 text-blue-600 focus:ring-0"
                        />
                        <span>{b}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                    {t.filterPrice}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="text-xs p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-center"
                    />
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="text-xs p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-center"
                    />
                  </div>
                </div>

                {/* Color */}
                <div className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                    {t.filterColor}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {colorsList.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => toggleColor(c.name)}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          selectedColors.includes(c.name)
                            ? 'ring-2 ring-offset-2 ring-blue-500 scale-105'
                            : 'border-neutral-200 dark:border-neutral-800'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900 space-y-2">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl"
                >
                  {t.applyFilters}
                </button>
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsMobileFiltersOpen(false);
                  }}
                  className="w-full py-3 border border-neutral-200 dark:border-neutral-800 text-neutral-500 text-xs font-bold rounded-xl"
                >
                  {t.clearAllFilters}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
