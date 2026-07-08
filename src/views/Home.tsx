import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ChevronDown,
  Gift,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { Product, Language, ActivePage } from '../types';
import { translations } from '../data/translations';
import { phoneProducts } from '../data/phones';
import PhoneCard from '../components/PhoneCard';

interface HomeProps {
  lang: Language;
  setActivePage: (page: ActivePage) => void;
  setSelectedProductId: (id: string | null) => void;
  onAddToCart: (p: Product, storage: string, color: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  compareList: string[];
  onToggleCompare: (id: string) => void;
  onQuickView: (product: Product) => void;
}

export default function Home({
  lang,
  setActivePage,
  setSelectedProductId,
  onAddToCart,
  favorites,
  onToggleFavorite,
  compareList,
  onToggleCompare,
  onQuickView,
}: HomeProps) {
  const t = translations[lang];
  const popularPhones = phoneProducts.slice(0, 4);

  // Counter values for statistics animation
  const [stats, setStats] = useState({ customers: 0, stores: 0, warranty: 0, hours: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        customers: 48, // 48K+
        stores: 12,
        warranty: 2,
        hours: 2,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Brands list for slider
  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Nothing', 'Google', 'OnePlus', 'HONOR', 'POCO'];

  // Testimonials
  const testimonials = [
    {
      name: 'Sherzod Alimov',
      city: 'Toshkent',
      commentUz: 'Telefon Vaqti do‘konidan ikkinchi marta telefon xarid qilyapman. Muddatli to‘lov shartlari juda qulay va barcha jarayon 10-15 daqiqa ichida hal bo‘ladi. Rahmat!',
      commentRu: 'Покупаю телефон в Telefon Vaqti уже второй раз. Условия рассрочки очень удобные, весь процесс занимает 10-15 минут. Спасибо!',
      rating: 5,
    },
    {
      name: 'Elena Pack',
      city: 'Samarqand',
      commentUz: 'Toshkentdan Samarqandgacha buyurtmamni atigi bir kunda tekin yetkazib berishdi. Telefon qadoqlanishi ideal holatda, kafolat taloni bor.',
      commentRu: 'Доставили заказ из Ташкента в Самарканд всего за один день бесплатно. Упаковка телефона в идеальном состоянии, есть гарантийный талон.',
      rating: 5,
    },
    {
      name: 'Sardorbek Rahimov',
      city: 'Farg‘ona',
      commentUz: 'Trade-In dasturi orqali eski iPhone 12 modelimni topshirib, yangi 15 Pro Max modelini muddatli to‘lov orqali oldim. Baholash oqilona bo‘ldi.',
      commentRu: 'По программе Trade-In сдал старый iPhone 12 и получил новый 15 Pro Max в рассрочку. Оценка была очень справедливой и разумной.',
      rating: 5,
    },
  ];

  // Homepage FAQ
  const faqs = [
    {
      qUz: 'Telefonlarni muddatli to‘lovga olish uchun qanday hujjatlar talab qilinadi?',
      qRu: 'Какие документы требуются для покупки телефонов в рассрочку?',
      aUz: 'Muddatli to‘lovga xarid qilish uchun faqat pasport (yoki ID-karta) hamda oxirgi 3-6 oylik tushumlarga ega bo‘lgan plastik karta kerak bo‘ladi. Boshlang‘ich to‘lov 0%!',
      aRu: 'Для покупки в рассрочку вам понадобятся только паспорт (или ID-карта) и активная пластиковая карта с поступлениями за последние 3-6 месяцев. Первый взнос 0%!',
    },
    {
      qUz: 'Trade-In dasturi qanday ishlaydi?',
      qRu: 'Как работает программа Trade-In?',
      aUz: 'Siz eski telefoningizni bizning do‘konga olib kelasiz, mutaxassisimiz uni 10 daqiqada texnik baholaydi. Baholangan summa yangi telefon narxidan chegiriladi. Qolgan qismini naqd to‘lash yoki muddatli to‘lovga rasmiylashtirish mumkin.',
      aRu: 'Вы приносите свой старый телефон в наш магазин, наш специалист проводит техническую оценку за 10 минут. Оцененная сумма вычитается из стоимости нового телефона. Остаток можно оплатить наличными или оформить в рассрочку.',
    },
    {
      qUz: 'Yetkazib berish shartlari qanday?',
      qRu: 'Каковы условия доставки?',
      aUz: 'Toshkent shahri ichida yetkazib berish bepul va 2 soat ichida amalga oshiriladi. O‘zbekistonning boshqa viloyatlariga kuryerlik xizmati orqali 24 soat ichida uyingizgacha bepul yetkaziladi.',
      aRu: 'Доставка по городу Ташкент бесплатная и осуществляется в течение 2 часов. В другие регионы Узбекистана заказ доставляется бесплатно до вашей двери в течение 24 часов курьерской службой.',
    },
  ];

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-32 overflow-hidden bg-transparent">
        {/* Decorative backdrop gradients */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:bg-cyan-500/15 dark:text-cyan-400 text-xs font-bold font-mono tracking-wide"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'uz' ? '0% Boshlang‘ich to‘lov' : '0% Первый взнос'}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-[1.1]"
            >
              {t.heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              {t.heroSubtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => setActivePage('catalog')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15 transition-transform hover:scale-105 active:scale-95"
              >
                <span>{t.heroCtaBuy}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActivePage('trade-in')}
                className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-750 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 border border-neutral-800"
              >
                <span>{t.heroCtaTrade}</span>
              </button>
            </motion.div>
          </div>

          {/* Hero Right Visual phone device frame mockup */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ type: 'spring', damping: 20, stiffness: 80, delay: 0.2 }}
              className="w-full max-w-xs aspect-[9/18.5] bg-neutral-900 rounded-[55px] border-[12px] border-neutral-950 shadow-2xl relative overflow-hidden ring-1 ring-white/10"
            >
              {/* Dynamic Island Speaker notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-20 flex items-center justify-between px-4">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-950 border border-cyan-800" />
              </div>

              {/* Inside Display screen UI mock */}
              <div className="absolute inset-0 bg-neutral-950 p-6 flex flex-col justify-between pt-16">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                    <span>TELEFON VAQTI</span>
                    <span>10:30 AM</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest font-mono block">Premium Store</span>
                    <h4 className="text-base font-black text-white tracking-tight leading-tight">iPhone 15 Pro Max</h4>
                  </div>
                </div>

                <div className="relative aspect-square w-full my-4 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80"
                    alt="iPhone inside mockup"
                    className="object-contain w-full h-full max-h-48 drop-shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="bg-neutral-900/60 border border-white/5 p-3 rounded-2xl space-y-1.5 backdrop-blur-md">
                  <div className="flex justify-between text-[10px] font-bold text-neutral-400">
                    <span>{lang === 'uz' ? 'Muddatli to‘lov' : 'Рассрочка'}</span>
                    <span className="text-emerald-400">12 {lang === 'uz' ? 'oy' : 'мес'}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-extrabold text-white">1 750 000 {t.currencyShort}</span>
                    <span className="text-[9px] text-neutral-500">/{lang === 'uz' ? 'oyiga' : 'в мес'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 p-8 sm:p-12 rounded-[32px] shadow-sm">
          <div className="text-center space-y-2">
            <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white font-mono tracking-tight bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              {stats.customers}K+
            </h3>
            <p className="text-xs sm:text-sm font-bold text-neutral-500 dark:text-neutral-400">
              {t.statsSatisfiedCustomers}
            </p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white font-mono tracking-tight bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              {stats.stores}+
            </h3>
            <p className="text-xs sm:text-sm font-bold text-neutral-500 dark:text-neutral-400">
              {t.statsStores}
            </p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white font-mono tracking-tight bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              {stats.warranty} {lang === 'uz' ? 'Yillik' : 'Года'}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-neutral-500 dark:text-neutral-400">
              {t.statsWarrantyYears}
            </p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white font-mono tracking-tight bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              {stats.hours} {lang === 'uz' ? 'soat' : 'часа'}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-neutral-500 dark:text-neutral-400">
              {t.statsDeliveryTime}
            </p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-bold text-cyan-500 uppercase tracking-widest font-mono">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>{lang === 'uz' ? 'Hozir trendda' : 'В тренде'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              {t.popularPhones}
            </h2>
          </div>
          <button
            onClick={() => setActivePage('catalog')}
            className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularPhones.map((product) => (
            <PhoneCard
              key={product.id}
              product={product}
              lang={lang}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.includes(product.id)}
              onToggleCompare={onToggleCompare}
              isCompared={compareList.includes(product.id)}
              onQuickView={onQuickView}
              onClick={() => {
                setSelectedProductId(product.id);
                setActivePage('product-details');
              }}
            />
          ))}
        </div>
      </section>

      {/* 4. BRAND CAROUSEL SLIDER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6 overflow-hidden">
        <h4 className="text-[10px] font-bold text-center uppercase tracking-widest text-neutral-400 font-mono">
          {t.partnersTitle}
        </h4>
        <div className="flex gap-4 sm:gap-8 justify-between items-center py-6 border-y border-neutral-150 dark:border-neutral-900 overflow-x-auto scrollbar-hide">
          {brands.map((brand) => (
            <div
              key={brand}
              className="text-sm font-black text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors uppercase tracking-widest font-mono px-4"
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* 5. PREMIUM TRADE-IN BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/5 p-8 sm:p-12 rounded-[40px] shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Backdrop blur rings */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Left info content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-widest text-cyan-400 uppercase font-mono">
              <Gift className="w-3.5 h-3.5" />
              <span>Yangi xizmat</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {t.tradeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-medium max-w-xl">
              {t.tradeSubtitle} {lang === 'uz' ? 'Eski telefoningizning baholash summasini istalgan yangi flagmanning boshlang‘ich to‘loviga kiritishingiz mumkin!' : 'Вы можете внести оценочную стоимость старого устройства в качестве первоначального взноса за любой новый флагман!'}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setActivePage('trade-in')}
                className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-600 text-neutral-950 font-bold rounded-2xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <span>{lang === 'uz' ? 'Qiymatini baholash' : 'Оценить стоимость'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right graphics visual layout */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-xs aspect-video bg-neutral-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between">
              <span className="text-[10px] font-bold text-neutral-500 font-mono">VALUATION SCHEME</span>
              <div className="flex justify-between items-center my-2">
                <div className="text-center">
                  <span className="text-[10px] text-neutral-400 block font-mono">iPhone 12 Pro</span>
                  <span className="text-xs font-bold text-neutral-300 block font-mono">5 200 000 UZS</span>
                </div>
                <div className="w-10 h-[2px] bg-cyan-500/50 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-cyan-400 block font-mono">iPhone 15 Pro</span>
                  <span className="text-xs font-bold text-white block font-mono">18 500 000 UZS</span>
                </div>
              </div>
              <div className="text-center border-t border-white/5 pt-3">
                <span className="text-[9px] text-neutral-400 block font-mono">{lang === 'uz' ? 'Qo‘shimcha to‘lov' : 'Доплата / Разница'}</span>
                <span className="text-sm font-black text-emerald-400 font-mono">13 300 000 UZS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ADVANTAGES SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[10px] font-black text-blue-600 dark:text-cyan-400 uppercase tracking-widest font-mono block">
            {lang === 'uz' ? 'MUKAMMAL XIZMAT' : 'ПРЕВОСХОДНЫЙ СЕРВИС'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            {t.whyChooseUs}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            {t.whyChooseUsSub}
          </p>
        </div>

        {/* Advantages cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
              {lang === 'uz' ? '100% Rasmiy original mahsulotlar' : '100% Официальная оригинальная продукция'}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {lang === 'uz' ? 'Kompaniyamizda sotiladigan barcha smartfonlar bojxonadan to‘liq o‘tgan va rasmiy kafolat bilan ta’minlanadi.' : 'Все смартфоны в нашем магазине полностью растаможены и обеспечиваются официальной гарантией бренда.'}
            </p>
          </div>

          <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
              {lang === 'uz' ? 'Tezkor kuryer xizmati' : 'Молниеносная курьерская доставка'}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {lang === 'uz' ? 'Toshkent bo‘ylab buyurtmalarni buyurtma qilingandan so‘ng 2 soat ichida mutlaqo bepul kuryer orqali yetkazib beramiz.' : 'Мы доставим ваш заказ по Ташкенту в течение 2 часов абсолютно бесплатно прямо в руки.'}
            </p>
          </div>

          <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
              {lang === 'uz' ? 'Muddatli to‘lovni silliq tasdiqlash' : 'Легкое одобрение рассрочки'}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {lang === 'uz' ? 'Hech qanday bankka borib yurmasdan, ofis va uyingizdan turib 15 daqiqa ichida smartfoningizni muddatli to‘lovga oling.' : 'Без очередей и визитов в банки, оформите любой смартфон в рассрочку за 15 минут онлайн прямо с дивана.'}
            </p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="bg-neutral-50 dark:bg-neutral-950 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-mono block">
              {lang === 'uz' ? 'MAMLUN HARIDORLAR' : 'ДОВОЛЬНЫЕ КЛИЕНТЫ'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              {t.reviewsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
              {t.reviewsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((review, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 p-6 rounded-[28px] space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">{review.name}</h4>
                    <span className="text-[10px] text-neutral-400 font-bold font-mono">{review.city}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {lang === 'uz' ? review.commentUz : review.commentRu}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-500 font-mono">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'uz' ? 'Tasdiqlangan Xaridor' : 'Проверенный Покупатель'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest font-mono block">
            {lang === 'uz' ? 'YORDAM' : 'ПОМОЩЬ'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            {t.faqTitle}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border border-neutral-200/60 dark:border-neutral-800/80 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full py-5 px-6 flex justify-between items-center text-left text-sm font-extrabold text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors"
                >
                  <span>{lang === 'uz' ? faq.qUz : faq.qRu}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800">
                    {lang === 'uz' ? faq.aUz : faq.aRu}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
