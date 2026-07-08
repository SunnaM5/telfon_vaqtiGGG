import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCw,
  ArrowRight,
  Sparkles,
  FileText,
  User,
  Phone,
  MessageSquare,
  CheckCircle,
  Clock,
  Smartphone,
  Gauge,
  HelpCircle,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { phoneProducts } from '../data/phones';

interface TradeInPageProps {
  lang: Language;
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  onAddMockOrder: (order: any) => void;
  setActivePage?: (page: any) => void;
}

export default function TradeInPage({ lang, onAddToast, onAddMockOrder, setActivePage }: TradeInPageProps) {
  const t = translations[lang];

  // Old Phone State
  const [oldBrand, setOldBrand] = useState('Apple');
  const [oldModel, setOldModel] = useState('iPhone 12');
  const [oldStorage, setOldStorage] = useState('128GB');
  const [oldCondition, setOldCondition] = useState<'perfect' | 'good' | 'average' | 'poor'>('good');
  const [batteryHealth, setBatteryHealth] = useState(85);

  // New Phone Choice
  const [newProductIdx, setNewProductIdx] = useState(0);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [comments, setComments] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const newProduct = phoneProducts[newProductIdx] || phoneProducts[0];

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + ' ' + t.currencyShort;
  };

  // List of old phones for selection
  const oldPhoneModels: Record<string, string[]> = {
    Apple: ['iPhone 11', 'iPhone 11 Pro', 'iPhone 12', 'iPhone 12 Pro Max', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 14 Pro Max'],
    Samsung: ['Galaxy S20', 'Galaxy S21 Ultra', 'Galaxy S22', 'Galaxy S22 Ultra', 'Galaxy S23', 'Galaxy A54'],
    Xiaomi: ['Redmi Note 10', 'Redmi Note 11 Pro', 'Xiaomi 12T', 'Xiaomi 13 Ultra', 'POCO F5'],
  };

  const oldModels = oldPhoneModels[oldBrand] || oldPhoneModels['Apple'];

  // Valuation algorithm
  const estimatedOldValue = useMemo(() => {
    // Base prices for models:
    let base = 3000000;
    if (oldModel.includes('14')) base = 11000000;
    else if (oldModel.includes('13 Pro')) base = 8500000;
    else if (oldModel.includes('13')) base = 6500000;
    else if (oldModel.includes('12 Pro Max')) base = 6200000;
    else if (oldModel.includes('12')) base = 4800000;
    else if (oldModel.includes('11')) base = 3500000;
    else if (oldModel.includes('S23')) base = 8800000;
    else if (oldModel.includes('S22 Ultra')) base = 7500000;
    else if (oldModel.includes('S22')) base = 5200000;
    else if (oldModel.includes('S21')) base = 3800000;
    else if (oldModel.includes('13 Ultra')) base = 7200000;
    else if (oldModel.includes('12T')) base = 3300000;

    // Storage multiplier
    let storageMultiplier = 1;
    if (oldStorage === '256GB') storageMultiplier = 1.1;
    if (oldStorage === '512GB') storageMultiplier = 1.25;

    // Condition multiplier
    const conditionMultipliers = {
      perfect: 1.0,
      good: 0.85,
      average: 0.7,
      poor: 0.45,
    };
    const condMult = conditionMultipliers[oldCondition] || 0.85;

    // Battery health penalty
    let batteryMult = 1.0;
    if (batteryHealth < 80) batteryMult = 0.85;
    else if (batteryHealth < 90) batteryMult = 0.95;

    return Math.round(base * storageMultiplier * condMult * batteryMult);
  }, [oldModel, oldStorage, oldCondition, batteryHealth]);

  const remainingToPay = useMemo(() => {
    const diff = newProduct.price - estimatedOldValue;
    return diff > 0 ? diff : 0;
  }, [newProduct.price, estimatedOldValue]);

  // Remaining installments 12 months fee
  const remainingInstallmentMonthly = useMemo(() => {
    return Math.round((remainingToPay * 1.12) / 12);
  }, [remainingToPay]);

  const handleTradeInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) return;

    const randomAppId = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `TR-${randomAppId}`;

    const newRecord = {
      id: generatedId,
      customerName: fullName,
      phoneNumber: phoneNumber.replace(/\D/g, ''),
      productName: `${newProduct.name} (Trade-In almashtirish: ${oldBrand} ${oldModel})`,
      totalPrice: remainingToPay,
      paymentMethod: 'cash',
      status: 'sent',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      history: [
        {
          status: 'sent',
          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
          descriptionUz: `Trade-In arizangiz qabul qilindi. Sizning eski telefoningiz taxminiy ${estimatedOldValue.toLocaleString()} so‘mga baholandi. Qolgan summa farqi: ${remainingToPay.toLocaleString()} so‘m.`,
          descriptionRu: `Ваша заявка на Trade-In принята. Ваш старый телефон оценен примерно в ${estimatedOldValue.toLocaleString()} сум. Разница к доплате: ${remainingToPay.toLocaleString()} сум.`,
        },
      ],
    };

    onAddMockOrder(newRecord);
    setSubmittedId(generatedId);
    onAddToast(
      lang === 'uz' ? 'Trade-In arizangiz qabul qilindi!' : 'Ваша заявка на Trade-In принята!',
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24 space-y-16">
      {/* 1. HEADER */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black tracking-widest uppercase font-mono">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Trade-In 2.0</span>
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-[1.1]">
          {t.tradeTitle}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-2xl mx-auto">
          {t.tradeSubtitle}
        </p>
      </div>

      {/* 2. HOW IT WORKS WORKFLOW */}
      <div className="space-y-8 pt-4">
        <h3 className="text-xl font-black text-center text-neutral-900 dark:text-white">
          {t.tradeHowItWorks}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-800/60 space-y-2">
            <h4 className="text-xs font-bold text-blue-600 dark:text-cyan-400 font-mono">STEP 01</h4>
            <h5 className="text-sm font-extrabold text-neutral-900 dark:text-white">{t.tradeStep1Title}</h5>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">{t.tradeStep1Desc}</p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-800/60 space-y-2">
            <h4 className="text-xs font-bold text-blue-600 dark:text-cyan-400 font-mono">STEP 02</h4>
            <h5 className="text-sm font-extrabold text-neutral-900 dark:text-white">{t.tradeStep2Title}</h5>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">{t.tradeStep2Desc}</p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-800/60 space-y-2">
            <h4 className="text-xs font-bold text-blue-600 dark:text-cyan-400 font-mono">STEP 03</h4>
            <h5 className="text-sm font-extrabold text-neutral-900 dark:text-white">{t.tradeStep3Title}</h5>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">{t.tradeStep3Desc}</p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-800/60 space-y-2">
            <h4 className="text-xs font-bold text-blue-600 dark:text-cyan-400 font-mono">STEP 04</h4>
            <h5 className="text-sm font-extrabold text-neutral-900 dark:text-white">{t.tradeStep4Title}</h5>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">{t.tradeStep4Desc}</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!submittedId ? (
          /* Main Interactive Calculator */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          >
            {/* Left side: Valuation Config */}
            <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 p-6 sm:p-12 rounded-[32px] space-y-8 shadow-sm">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-cyan-500" />
                <span>{t.tradeCalcTitle}</span>
              </h3>

              <div className="space-y-4">
                {/* Brand and model row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      {lang === 'uz' ? 'Eski telefon brendi' : 'Марка старого телефона'}
                    </label>
                    <select
                      value={oldBrand}
                      onChange={(e) => {
                        setOldBrand(e.target.value);
                        setOldModel(oldPhoneModels[e.target.value][0]);
                      }}
                      className="w-full text-xs py-3 px-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white font-semibold"
                    >
                      <option value="Apple">Apple</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Xiaomi">Xiaomi</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      {lang === 'uz' ? 'Eski telefon modeli' : 'Модель старого телефона'}
                    </label>
                    <select
                      value={oldModel}
                      onChange={(e) => setOldModel(e.target.value)}
                      className="w-full text-xs py-3 px-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white font-semibold"
                    >
                      {oldModels.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Storage selection old */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono block">
                    {lang === 'uz' ? 'Eski telefon xotirasi' : 'Память старого телефона'}
                  </label>
                  <div className="flex gap-2">
                    {['64GB', '128GB', '256GB', '512GB'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setOldStorage(st)}
                        className={`text-xs px-4 py-2.5 rounded-xl border font-bold transition-all ${
                          oldStorage === st
                            ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950'
                            : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cosmetic condition */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono block">
                    {t.tradeCondition}
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: 'perfect', label: t.tradeConditionPerfect },
                      { key: 'good', label: t.tradeConditionGood },
                      { key: 'average', label: t.tradeConditionAverage },
                      { key: 'poor', label: t.tradeConditionPoor },
                    ].map((cond) => (
                      <button
                        key={cond.key}
                        type="button"
                        onClick={() => setOldCondition(cond.key as any)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                          oldCondition === cond.key
                            ? 'bg-blue-600/10 text-blue-600 border-blue-500/30 font-bold'
                            : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                        }`}
                      >
                        <span>{cond.label}</span>
                        {oldCondition === cond.key && <span className="text-[9px] font-black uppercase font-mono tracking-widest text-blue-500">Active</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Battery health */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono flex items-center gap-1">
                      <Gauge className="w-4 h-4 text-cyan-500" />
                      <span>{t.tradeBatteryHealth}</span>
                    </label>
                    <span className="text-xs font-extrabold text-neutral-900 dark:text-white font-mono">{batteryHealth}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    value={batteryHealth}
                    onChange={(e) => setBatteryHealth(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Right side: New product select and calculation outcome */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 p-6 sm:p-8 rounded-[32px] space-y-6 shadow-sm">
                <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span>{t.tradeNewPhoneToBuy}</span>
                </h3>

                {/* Choose target new phone */}
                <div className="space-y-1.5">
                  <select
                    value={newProductIdx}
                    onChange={(e) => setNewProductIdx(Number(e.target.value))}
                    className="w-full text-xs py-3.5 pl-4 pr-10 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white font-semibold appearance-none cursor-pointer"
                  >
                    {phoneProducts.map((p, idx) => (
                      <option key={p.id} value={idx}>
                        {p.name} • {formatPrice(p.price)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calculated outcome layout */}
                <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-900 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-bold">{t.tradeEstimatedValue}:</span>
                    <span className="font-extrabold text-neutral-800 dark:text-neutral-200 font-mono">
                      +{estimatedOldValue.toLocaleString('uz-UZ')} {t.currencyShort}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-bold">{lang === 'uz' ? 'Yangi telefon narxi' : 'Цена нового телефона'}:</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
                      {newProduct.price.toLocaleString('uz-UZ')} {t.currencyShort}
                    </span>
                  </div>

                  <div className="border-t border-neutral-200/50 dark:border-neutral-800/50 pt-4 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                        {t.tradeRemainingToPay}:
                      </span>
                      <span className="text-xl font-black text-rose-500 font-mono">
                        {remainingToPay.toLocaleString('uz-UZ')} {t.currencyShort}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-[10px] font-bold text-neutral-400">
                        {t.tradeRemainingInstallment}:
                      </span>
                      <span className="text-xs font-extrabold text-emerald-500 font-mono">
                        {remainingInstallmentMonthly.toLocaleString('uz-UZ')} {t.currencyShort}/oy
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission contact Form card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 p-6 sm:p-8 rounded-[32px] space-y-4 shadow-sm">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                  {t.tradeFormTitle}
                </h4>

                <form onSubmit={handleTradeInSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      {t.instFullName}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        required
                        placeholder="Shuhrat Uldashev"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full text-xs py-3 pl-10 pr-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      {t.instPhone}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                      <input
                        type="tel"
                        required
                        placeholder="998901234567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full text-xs py-3 pl-10 pr-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      {lang === 'uz' ? 'Qo‘shimcha izohlar (Seriya raqami yoki holati)' : 'Дополнительные комментарии (Серийный номер или состояние)'}
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="IMEI: 3568..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="w-full text-xs py-3 pl-10 pr-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-600 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{t.tradeSubmitBtn}</span>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Success message page TradeIn */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 p-8 sm:p-16 rounded-[40px] text-center space-y-6 max-w-xl mx-auto shadow-2xl relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {lang === 'uz' ? 'Trade-In Arizasi Qabul Qilindi!' : 'Заявка на Trade-In Принята!'}
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto">
                {t.tradeSuccessMessage} <strong className="text-blue-600 dark:text-cyan-400 text-sm font-mono">{submittedId}</strong>
              </p>
            </div>

            {/* Steps detailed helper */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950/40 rounded-2xl border border-neutral-150 dark:border-neutral-900 text-left text-[11px] leading-relaxed space-y-2 text-neutral-500">
              <p className="font-bold text-neutral-700 dark:text-neutral-300">
                {lang === 'uz' ? 'Keyingi qadamlar:' : 'Следующие шаги:'}
              </p>
              <p>1. {lang === 'uz' ? 'Bizning Trade-In menejerimiz 10-15 daqiqa ichida siz bilan bog‘lanib suhbatlashadi.' : 'Наш Trade-In менеджер свяжется с вами в течение 10-15 минут для обсуждения деталей.'}</p>
              <p>2. {lang === 'uz' ? 'O‘zingiz bilan pasport va eski telefonni olib istalgan rasmiy filialimizga kelishingiz so‘raladi.' : 'Вам нужно будет прийти в один из наших официальных филиалов с паспортом и старым телефоном.'}</p>
              <p>3. {lang === 'uz' ? '10 daqiqalik apparat tekshiruvidan so‘ng yangi telefoningizni olib ketishingiz mumkin!' : 'После 10-минутной аппаратной проверки вы сможете забрать свой новый телефон!'}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={() => {
                  setSubmittedId(null);
                  setFullName('');
                  setPhoneNumber('');
                  setComments('');
                }}
                className="px-6 py-3.5 bg-neutral-950 text-white dark:bg-neutral-800 font-bold text-xs rounded-xl"
              >
                {lang === 'uz' ? 'Qayta hisoblash' : 'Рассчитать заново'}
              </button>
              <button
                onClick={() => setActivePage?.('order-status')}
                className="px-6 py-3.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow"
              >
                {t.navOrderStatus}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
