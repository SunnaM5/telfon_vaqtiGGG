import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  CheckCircle,
  Truck,
  Package,
  Calendar,
  Phone,
  User,
  CreditCard,
  CircleAlert,
  Loader2,
} from 'lucide-react';
import { Language, OrderTrack } from '../types';
import { translations } from '../data/translations';

interface OrderStatusPageProps {
  lang: Language;
  mockOrdersList: OrderTrack[];
}

export default function OrderStatusPage({ lang, mockOrdersList }: OrderStatusPageProps) {
  const t = translations[lang];

  // Search Queries
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<OrderTrack | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Simulate search latency for high-end feel
    setTimeout(() => {
      const cleanedQuery = searchQuery.trim().toUpperCase();
      const cleanedPhone = searchQuery.replace(/\D/g, '');

      // Search matching order by ID or phone number
      const found = mockOrdersList.find(
        (o) =>
          o.id.toUpperCase() === cleanedQuery ||
          o.phoneNumber.includes(cleanedPhone) ||
          (cleanedPhone && o.phoneNumber === cleanedPhone)
      );

      setSearchedOrder(found || null);
      setIsSearching(false);
    }, 600);
  };

  const getStatusColor = (status: OrderTrack['status']) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400';
      case 'processing':
        return 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400';
      case 'ready':
        return 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400';
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400';
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400';
      default:
        return 'bg-neutral-500/10 text-neutral-600';
    }
  };

  const getStatusText = (status: OrderTrack['status']) => {
    switch (status) {
      case 'sent':
        return lang === 'uz' ? 'Qabul qilindi' : 'Получен';
      case 'processing':
        return lang === 'uz' ? 'Rasmiylashtirilmoqda' : 'Оформляется';
      case 'ready':
        return lang === 'uz' ? 'Yetkazishga tayyor' : 'Готов к доставке';
      case 'delivered':
        return lang === 'uz' ? 'Yetkazib berildi' : 'Доставлен';
      case 'cancelled':
        return lang === 'uz' ? 'Bekor qilindi' : 'Отменен';
      default:
        return status;
    }
  };

  // Step active indexes
  const stepIndex = (status: OrderTrack['status']) => {
    switch (status) {
      case 'sent':
        return 0;
      case 'processing':
        return 1;
      case 'ready':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
      default:
        return -1;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pt-32 pb-24 space-y-12">
      {/* HEADER TITLE */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-black tracking-widest uppercase font-mono">
          <Truck className="w-3.5 h-3.5" />
          <span>{lang === 'uz' ? 'Buyurtmani Kuzatish' : 'Отслеживание заказа'}</span>
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
          {t.trackTitle}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-xl mx-auto">
          {t.trackSubtitle}
        </p>
      </div>

      {/* SEARCH BAR PANEL */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 p-6 sm:p-8 rounded-[32px] shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
              {lang === 'uz' ? 'Buyurtma yoki ariza raqami' : 'Номер заказа или заявки'}
            </label>
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="text"
                  required
                  placeholder={t.trackPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs py-4 pl-11 pr-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white font-semibold font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>{lang === 'uz' ? 'Kuzatish' : 'Отследить'}</span>
              </button>
            </div>
          </div>

          <div className="text-[10px] text-neutral-400 leading-normal flex items-center gap-2">
            <span>{lang === 'uz' ? 'Sinab ko‘ring:' : 'Попробуйте:'}</span>
            <div className="flex gap-1.5 font-mono">
              <button
                type="button"
                onClick={() => setSearchQuery('TV-1002')}
                className="underline hover:text-neutral-600"
              >
                TV-1002
              </button>
              <span>,</span>
              <button
                type="button"
                onClick={() => setSearchQuery('TV-1003')}
                className="underline hover:text-neutral-600"
              >
                TV-1003
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* SEARCH RESULT DETAILS PANEL */}
      <AnimatePresence mode="wait">
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 space-y-3"
          >
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            <p className="text-xs font-bold text-neutral-400 font-mono">
              {lang === 'uz' ? 'Ma’lumotlar bazasidan qidirilmoqda...' : 'Поиск в базе данных...'}
            </p>
          </motion.div>
        )}

        {!isSearching && hasSearched && searchedOrder && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 p-6 sm:p-10 rounded-[32px] shadow"
          >
            {/* Upper status summary header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-extrabold font-mono uppercase">
                  {lang === 'uz' ? 'Buyurtma ID raqami' : 'Идентификатор заказа'}
                </span>
                <h3 className="text-lg font-black text-neutral-950 dark:text-white font-mono">
                  {searchedOrder.id}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider font-mono ${getStatusColor(searchedOrder.status)}`}>
                  {getStatusText(searchedOrder.status)}
                </span>
              </div>
            </div>

            {/* Horizontal Timeline progress visualization */}
            {searchedOrder.status !== 'cancelled' && (
              <div className="py-6 border-b border-neutral-100 dark:border-neutral-800">
                <div className="grid grid-cols-4 gap-2 relative">
                  {/* Backdrop connection line */}
                  <div className="absolute top-[15px] left-[12.5%] right-[12.5%] h-1 bg-neutral-100 dark:bg-neutral-800 z-0" />
                  
                  {/* Dynamic connection active line fill */}
                  <div
                    className="absolute top-[15px] left-[12.5%] h-1 bg-blue-600 transition-all duration-500 z-0"
                    style={{
                      width: `${stepIndex(searchedOrder.status) * 25}%`,
                    }}
                  />

                  {/* Step 1: Received */}
                  <div className="text-center space-y-2 relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-colors ${
                        stepIndex(searchedOrder.status) >= 0
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25'
                          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400'
                      }`}
                    >
                      ✓
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider block font-mono ${
                      stepIndex(searchedOrder.status) >= 0 ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'
                    }`}>
                      {lang === 'uz' ? 'Yuborilgan' : 'Отправлен'}
                    </span>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="text-center space-y-2 relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-colors ${
                        stepIndex(searchedOrder.status) >= 1
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25'
                          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {stepIndex(searchedOrder.status) >= 1 ? '✓' : '2'}
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider block font-mono ${
                      stepIndex(searchedOrder.status) >= 1 ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'
                    }`}>
                      {lang === 'uz' ? 'Rasmiylashtirish' : 'Оформление'}
                    </span>
                  </div>

                  {/* Step 3: Ready */}
                  <div className="text-center space-y-2 relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-colors ${
                        stepIndex(searchedOrder.status) >= 2
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25'
                          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {stepIndex(searchedOrder.status) >= 2 ? '✓' : '3'}
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider block font-mono ${
                      stepIndex(searchedOrder.status) >= 2 ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'
                    }`}>
                      {lang === 'uz' ? 'Kuryerda' : 'У курьера'}
                    </span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="text-center space-y-2 relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-colors ${
                        stepIndex(searchedOrder.status) >= 3
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/25'
                          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {stepIndex(searchedOrder.status) >= 3 ? '✓' : '4'}
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider block font-mono ${
                      stepIndex(searchedOrder.status) >= 3 ? 'text-emerald-500 font-extrabold' : 'text-neutral-400'
                    }`}>
                      {lang === 'uz' ? 'Yetkazildi' : 'Доставлен'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Core client metadata info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">
                  {lang === 'uz' ? 'Xaridor Ma’lumotlari' : 'Данные покупателя'}
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs">
                    <User className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-500">{lang === 'uz' ? 'F.I.SH:' : 'ФИО:'}</span>
                    <strong className="text-neutral-800 dark:text-neutral-200">{searchedOrder.customerName}</strong>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-500">{lang === 'uz' ? 'Telefon:' : 'Телефон:'}</span>
                    <strong className="text-neutral-800 dark:text-neutral-200">+{searchedOrder.phoneNumber}</strong>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-500">{lang === 'uz' ? 'Sana:' : 'Дата:'}</span>
                    <strong className="text-neutral-800 dark:text-neutral-200 font-mono">{searchedOrder.date}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">
                  {lang === 'uz' ? 'Moliyaviy ma’lumotlar' : 'Финансовые детали'}
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 text-xs">
                    <Package className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <span className="text-neutral-500">{lang === 'uz' ? 'Maxsulot:' : 'Товар:'}</span>
                    <strong className="text-neutral-800 dark:text-neutral-200 line-clamp-1">{searchedOrder.productName}</strong>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <CreditCard className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-500">{lang === 'uz' ? 'To‘lov usuli:' : 'Тип оплаты:'}</span>
                    <strong className="text-neutral-800 dark:text-neutral-200 uppercase font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                      {searchedOrder.paymentMethod === 'installment'
                        ? lang === 'uz'
                          ? 'Muddatli to‘lov'
                          : 'Рассрочка'
                        : lang === 'uz'
                        ? 'Naqd / Karta'
                        : 'Наличные / Карта'}
                    </strong>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <CreditCard className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-500">{lang === 'uz' ? 'Umumiy qiymat:' : 'Общая сумма:'}</span>
                    <strong className="text-neutral-900 dark:text-white font-mono text-sm">
                      {searchedOrder.totalPrice.toLocaleString('uz-UZ')} UZS
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical milestone logs */}
            <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">
                {lang === 'uz' ? 'Kuzatuv Tarixi Log' : 'Лог истории отслеживания'}
              </h4>
              <div className="space-y-4 relative pl-4 border-l border-neutral-150 dark:border-neutral-800">
                {searchedOrder.history.map((log, index) => (
                  <div key={index} className="relative space-y-1">
                    {/* Log bullet dot indicator */}
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-neutral-950" />
                    <div className="flex justify-between text-[10px] font-black text-neutral-400 font-mono uppercase">
                      <span>{getStatusText(log.status)}</span>
                      <span>{log.date}</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed font-semibold">
                      {lang === 'uz' ? log.descriptionUz : log.descriptionRu}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {!isSearching && hasSearched && !searchedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 p-12 rounded-[32px] text-center space-y-4 max-w-md mx-auto"
          >
            <CircleAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                {lang === 'uz' ? 'Buyurtma topilmadi' : 'Заказ не найден'}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {lang === 'uz'
                  ? 'Kiritilgan ID raqam yoki telefon raqami bo‘yicha tizimda hech qanday buyurtma aniqlanmadi. Iltimos, ma’lumotlarni qaytadan tekshiring.'
                  : 'По указанному идентификатору или номеру телефона заказов не найдено. Пожалуйста, проверьте правильность ввода.'}
              </p>
            </div>
            <button
              onClick={() => {
                setHasSearched(false);
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-neutral-900 text-white dark:bg-neutral-800 font-bold text-xs rounded-xl"
            >
              {lang === 'uz' ? 'Qayta urinish' : 'Попробовать снова'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
