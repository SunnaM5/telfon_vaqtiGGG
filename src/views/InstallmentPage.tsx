import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Calendar,
  CheckCircle,
  FileText,
  Clock,
  ShieldCheck,
  Smartphone,
  ChevronDown,
  User,
  Phone,
  Briefcase,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { phoneProducts } from '../data/phones';

interface InstallmentPageProps {
  lang: Language;
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  onAddMockOrder: (order: any) => void;
  setActivePage?: (page: any) => void;
}

export default function InstallmentPage({ lang, onAddToast, onAddMockOrder, setActivePage }: InstallmentPageProps) {
  const t = translations[lang];

  // Calculator State
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState(12);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passport, setPassport] = useState('');
  const [workPlace, setWorkPlace] = useState('');
  const [agree, setAgree] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const product = phoneProducts[selectedProductIdx] || phoneProducts[0];

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + ' ' + t.currencyShort;
  };

  const monthlyPayment = useMemo(() => {
    const interestRates: Record<number, number> = { 3: 1.03, 6: 1.06, 9: 1.09, 12: 1.12 };
    const rate = interestRates[selectedMonths] || 1;
    const totalWithInterest = product.price * rate;
    return Math.round(totalWithInterest / selectedMonths);
  }, [product.price, selectedMonths]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      onAddToast(
        lang === 'uz' ? 'Iltimos, shartlarga rozilik bildiring' : 'Пожалуйста, согласитесь с условиями',
        'error'
      );
      return;
    }

    const randomAppId = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `TV-${randomAppId}`;

    // Add a tracking record dynamically so they can search it on the track order page!
    const newRecord = {
      id: generatedId,
      customerName: fullName,
      phoneNumber: phoneNumber.replace(/\D/g, ''),
      productName: `${product.name} (${selectedMonths} oy muddatli to‘lov)`,
      totalPrice: monthlyPayment * selectedMonths,
      paymentMethod: 'installment',
      status: 'sent',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      history: [
        {
          status: 'sent',
          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
          descriptionUz: 'Sizning muddatli to‘lovga arizangiz muvaffaqiyatli qabul qilindi. Hozirda skoring tekshiruvidan o‘tmoqda.',
          descriptionRu: 'Ваша заявка на рассрочку успешно принята. В настоящее время она проходит скоринговую проверку.',
        },
      ],
    };

    onAddMockOrder(newRecord);
    setSubmittedId(generatedId);
    onAddToast(
      lang === 'uz' ? 'Sizning arizangiz muvaffaqiyatli qabul qilindi!' : 'Ваша заявка успешно принята!',
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24 space-y-16">
      {/* 1. HEADER */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-black tracking-widest uppercase font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'uz' ? 'Qulay To‘lov' : 'Удобная оплата'}</span>
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-[1.1]">
          {t.instTitle}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-2xl mx-auto">
          {t.instSubtitle}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!submittedId ? (
          /* Main Form & Calculator */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          >
            {/* Left Column: Interactive Calculator */}
            <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 p-6 sm:p-8 rounded-[32px] space-y-6 shadow-sm">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-500" />
                <span>{t.instCalculator}</span>
              </h3>

              {/* Product Select dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono block">
                  {lang === 'uz' ? 'Smartfonni tanlang' : 'Выберите смартфон'}
                </label>
                <div className="relative">
                  <select
                    value={selectedProductIdx}
                    onChange={(e) => setSelectedProductIdx(Number(e.target.value))}
                    className="w-full text-xs py-3.5 pl-4 pr-10 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white font-semibold appearance-none cursor-pointer"
                  >
                    {phoneProducts.map((p, idx) => (
                      <option key={p.id} value={idx}>
                        {p.name} • {formatPrice(p.price)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-4 w-4.5 h-4.5 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* Term Month Cards */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono block">
                  {t.instPeriod}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 6, 9, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMonths(m)}
                      className={`py-3.5 px-2 text-xs font-black rounded-xl border transition-all ${
                        selectedMonths === m
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10'
                          : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                      }`}
                    >
                      {m} {lang === 'uz' ? 'oy' : 'мес'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculation Preview */}
              <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-900 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-bold">{lang === 'uz' ? 'Mahsulot' : 'Товар'}</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[200px]">
                    {product.name}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-bold">{lang === 'uz' ? 'Muddati' : 'Срок'}</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedMonths} {lang === 'uz' ? 'oy' : 'месяцев'}
                  </span>
                </div>
                <div className="border-t border-neutral-200/50 dark:border-neutral-800/50 pt-3 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                    {t.instMonthlyPayment}:
                  </span>
                  <span className="text-xl font-black text-blue-600 dark:text-cyan-400 font-mono">
                    {monthlyPayment.toLocaleString('uz-UZ')} {t.currencyShort}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold pt-1">
                  <span>{t.instTotalPrice}</span>
                  <span className="font-mono font-semibold">
                    {(monthlyPayment * selectedMonths).toLocaleString('uz-UZ')} {t.currencyShort}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Submission Form */}
            <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 p-6 sm:p-12 rounded-[32px] space-y-8 shadow-sm">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>{t.instFullName}</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
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
                        className="w-full text-xs py-3.5 pl-10 pr-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      {t.instPhone}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                      <input
                        type="tel"
                        required
                        placeholder="998901234567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full text-xs py-3.5 pl-10 pr-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Passport Details */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      {t.instPassport}
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        required
                        placeholder="AA 1234567"
                        value={passport}
                        onChange={(e) => setPassport(e.target.value)}
                        className="w-full text-xs py-3.5 pl-10 pr-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>

                  {/* Workplace and Income */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      {t.instWorkPlace}
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        required
                        placeholder={lang === 'uz' ? 'Usoft MCHJ, 5 000 000 so‘m' : 'ООО Юсофт, 5 000 000 сум'}
                        value={workPlace}
                        onChange={(e) => setWorkPlace(e.target.value)}
                        className="w-full text-xs py-3.5 pl-10 pr-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Passport scanning card mock details */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-neutral-900 dark:text-white">
                      {lang === 'uz' ? 'Onlayn skoring tekshiruvi' : 'Онлайн проверка скоринга'}
                    </p>
                    <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">
                      {lang === 'uz' ? 'Bizning tizimimiz pasport va oylik daromadingizni 15 daqiqa ichida onlayn tekshiradi.' : 'Наша система проверит ваши данные и доход в течение 15 минут в режиме онлайн.'}
                    </p>
                  </div>
                </div>

                {/* Agreement */}
                <label className="flex items-start gap-2.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={() => setAgree(!agree)}
                    className="w-4.5 h-4.5 rounded border-neutral-300 dark:border-neutral-800 text-blue-600 focus:ring-0 mt-0.5"
                  />
                  <span>{t.instTermsAgree}</span>
                </label>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/15"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{t.instSubmitApp}</span>
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          /* Breathtaking Success Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 p-8 sm:p-16 rounded-[40px] text-center space-y-6 max-w-xl mx-auto shadow-2xl relative overflow-hidden"
          >
            {/* Confetti decoration circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl" />

            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {lang === 'uz' ? 'Ariza Muvaffaqiyatli topshirildi!' : 'Заявка успешно подана!'}
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto">
                {t.instAppSuccess} <strong className="text-blue-600 dark:text-cyan-400 text-sm font-mono">{submittedId}</strong>
              </p>
            </div>

            {/* Application review status timeline illustration */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950/40 rounded-2xl border border-neutral-150 dark:border-neutral-900 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'uz' ? 'Ko‘rib chiqish bosqichlari:' : 'Этапы рассмотрения:'}</span>
              </div>
              <ul className="space-y-2.5 pl-2 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">✓</span>
                  <span>{lang === 'uz' ? 'Ariza qabul qilindi' : 'Заявка принята'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-500 text-white text-[9px] font-black flex items-center justify-center animate-ping">●</span>
                  <span>{lang === 'uz' ? 'Kredit skoringi tekshirilmoqda' : 'Проверяется кредитный скоринг'}</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-400 font-normal">
                  <span className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-800 text-[9px] flex items-center justify-center font-mono">3</span>
                  <span>{lang === 'uz' ? 'Menejer qo‘ng‘irog‘i va yakuniy tasdiq' : 'Звонок менеджера и финальное одобрение'}</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={() => {
                  setSubmittedId(null);
                  setFullName('');
                  setPhoneNumber('');
                  setPassport('');
                  setWorkPlace('');
                  setAgree(false);
                }}
                className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-white font-bold text-xs rounded-xl"
              >
                {lang === 'uz' ? 'Yangi ariza topshirish' : 'Подать новую заявку'}
              </button>
              <button
                onClick={() => setActivePage?.('order-status')}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
              >
                {t.navOrderStatus}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ADVANTAGES LIST */}
      <div className="pt-12 border-t border-neutral-150 dark:border-neutral-900 space-y-8">
        <h3 className="text-xl font-black text-center text-neutral-900 dark:text-white">
          {t.instWhyUsTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{t.instAdv1Title}</h4>
            <p className="text-xs text-neutral-400 leading-normal">{t.instAdv1Desc}</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-600 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{t.instAdv2Title}</h4>
            <p className="text-xs text-neutral-400 leading-normal">{t.instAdv2Desc}</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{t.instAdv3Title}</h4>
            <p className="text-xs text-neutral-400 leading-normal">{t.instAdv3Desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
