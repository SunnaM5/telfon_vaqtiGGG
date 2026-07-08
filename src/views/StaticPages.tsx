import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  ShieldCheck,
  Truck,
  Heart,
  Globe,
  Award,
  Send,
  CheckCircle,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface StaticPagesProps {
  pageType: 'about' | 'contacts' | 'delivery' | 'warranty' | 'privacy' | 'terms';
  lang: Language;
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export default function StaticPages({ pageType, lang, onAddToast }: StaticPagesProps) {
  const t = translations[lang];

  // Contact form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [formSent, setFormSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setFormSent(true);
    onAddToast(
      lang === 'uz' ? 'Xabaringiz qabul qilindi, tez orada bog‘lanamiz!' : 'Ваше сообщение принято, скоро мы свяжемся с вами!',
      'success'
    );
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24 space-y-16">
      {/* 1. ABOUT US VIEW */}
      {pageType === 'about' && (
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase tracking-widest font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>{lang === 'uz' ? 'Biz haqimizda' : 'О нас'}</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              {lang === 'uz' ? 'Telefon Vaqti — O‘zbekistondagi №1 Premium Store' : 'Telefon Vaqti — Премиум магазин №1 в Узбекистане'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
              {lang === 'uz'
                ? 'Biz 2018-yildan beri mijozlarimizga jahonning yetakchi brendlariga tegishli smartfon va aksessuarlarni rasmiy kafolat bilan, qulay shartlarda yetkazib bermoqdamiz.'
                : 'С 2018 года мы поставляем нашим клиентам оригинальные смартфоны и аксессуары от ведущих мировых брендов с официальной гарантией и на удобных условиях.'}
            </p>
          </div>

          {/* Bento-grid Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                {lang === 'uz' ? 'Halollik va Shaffoflik' : 'Честность и прозрачность'}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                {lang === 'uz'
                  ? 'Barcha muddatli to‘lov shartlarimiz yashirin foizlarsiz, ustama haq va penyalarsiz shaffof rasmiylashtiriladi.'
                  : 'Все наши условия рассрочки оформляются прозрачно, без скрытых процентов, наценок и пени.'}
              </p>
            </div>

            <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                {lang === 'uz' ? 'Mijozga Yo‘naltirilganlik' : 'Ориентация на клиента'}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                {lang === 'uz'
                  ? 'Biz Toshkent shahri ichida 2 soat ichida buyurtmangizni mutlaqo bepul uyingizgacha yetkazib beramiz.'
                  : 'Мы доставим ваш заказ прямо до двери в течение 2 часов по всему Ташкенту абсолютно бесплатно.'}
              </p>
            </div>

            <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                {lang === 'uz' ? 'Sifat Nazorati' : 'Контроль качества'}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                {lang === 'uz'
                  ? 'Har bir smartfon sotilishidan oldin to‘liq IMEI ro‘yxatidan o‘tganligi va butunligi tekshiriladi.'
                  : 'Каждый смартфон перед продажей тщательно проверяется на целостность комплектации и регистрацию IMEI.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTACTS VIEW */}
      {pageType === 'contacts' && (
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase tracking-widest font-mono">
              <Phone className="w-3.5 h-3.5" />
              <span>{lang === 'uz' ? 'Aloqa' : 'Контакты'}</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              {lang === 'uz' ? 'Biz bilan Bog‘laning' : 'Свяжитесь с нами'}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left coordinate lists */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-800/60 space-y-6">
                <div className="flex gap-4 items-start">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                      {lang === 'uz' ? 'Bosh Ofis / Shou-rum' : 'Главный Шоу-рум'}
                    </p>
                    <p className="text-neutral-500 leading-relaxed font-medium">
                      {lang === 'uz'
                        ? 'Toshkent shahri, Yunusobod tumani, Amir Temur ko‘chasi, 12-uy'
                        : 'г. Ташкент, Юнусабадский район, улица Амира Темура, дом 12'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Phone className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                      {lang === 'uz' ? 'Yagona Aloqa Markazi' : 'Колл-центр'}
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 font-mono font-bold text-sm">
                      +998 (71) 200-45-45
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Clock className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                      {lang === 'uz' ? 'Ish Vaqti' : 'Режим работы'}
                    </p>
                    <p className="text-neutral-500 leading-relaxed font-medium">
                      {lang === 'uz' ? 'Har kuni: 09:00 dan 21:00 gacha' : 'Каждый день: с 09:00 до 21:00'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Mail className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                      {lang === 'uz' ? 'Elektron Pochta' : 'Электронная почта'}
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 font-mono">
                      support@telefonvaqti.uz
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 p-6 sm:p-10 rounded-[32px] space-y-6">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                {lang === 'uz' ? 'Savolingiz bormi? Yozing:' : 'Есть вопросы? Напишите нам:'}
              </h3>

              {formSent ? (
                <div className="p-8 text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">
                    {lang === 'uz' ? 'Rahmat! Xabaringiz yuborildi.' : 'Спасибо! Ваше сообщение отправлено.'}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {lang === 'uz' ? 'Menejerlarimiz qisqa fursatda bog‘lanishadi.' : 'Наши операторы свяжутся с вами в ближайшее время.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                        {lang === 'uz' ? 'Ismingiz' : 'Ваше имя'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs py-3 px-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                        {lang === 'uz' ? 'Telefon raqamingiz' : 'Номер телефона'}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="998901234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs py-3 px-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      {lang === 'uz' ? 'Xabar matni' : 'Текст сообщения'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-xs py-3 px-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-750 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>{lang === 'uz' ? 'Xabarni yuborish' : 'Отправить сообщение'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. DELIVERY DETAILS VIEW */}
      {pageType === 'delivery' && (
        <div className="space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase tracking-widest font-mono">
              <Truck className="w-3.5 h-3.5" />
              <span>{lang === 'uz' ? 'Yetkazib berish' : 'Доставка'}</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              {lang === 'uz' ? 'Tez va Bepul Yetkazib berish' : 'Быстрая и бесплатная доставка'}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 space-y-4">
              <h4 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                {lang === 'uz' ? 'Toshkent shahri bo‘ylab yetkazib berish' : 'Доставка по Ташкенту'}
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium pl-1">
                <li>• {lang === 'uz' ? 'Yetkazib berish mutlaqo BEPUL.' : 'Доставка абсолютно БЕСПЛАТНАЯ.'}</li>
                <li>• {lang === 'uz' ? 'Muddati: 2 soat ichida.' : 'Срок: в течение 2 часов.'}</li>
                <li>• {lang === 'uz' ? 'To‘lov: kuryerga olgandan so‘ng (Naqd/Karta/Muddatli to‘lov).' : 'Оплата: после получения курьеру (наличные/карта).'}</li>
              </ul>
            </div>

            <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 space-y-4">
              <h4 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                {lang === 'uz' ? 'Viloyatlarga yetkazib berish' : 'Доставка по регионам Узбекистана'}
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium pl-1">
                <li>• {lang === 'uz' ? 'O‘zbekiston bo‘ylab uyingizgacha BEPUL kuryerlik yetkazib berish.' : 'Бесплатная курьерская доставка по всему Узбекистану.'}</li>
                <li>• {lang === 'uz' ? 'Muddati: 24 soat ichida.' : 'Срок: в течение 24 часов.'}</li>
                <li>• {lang === 'uz' ? 'Barcha jo‘natmalar to‘liq sug‘urta qilinadi.' : 'Все посылки полностью застрахованы.'}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. WARRANTY VIEW */}
      {pageType === 'warranty' && (
        <div className="space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase tracking-widest font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'uz' ? 'Rasmiy Kafolat' : 'Официальная гарантия'}</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              {lang === 'uz' ? '1 Yildan 2 Yilgacha Rasmiy Kafolat' : 'Официальная гарантия от 1 до 2 лет'}
            </h1>
          </div>

          <div className="p-8 sm:p-12 rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800/40 space-y-6 max-w-3xl mx-auto">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
              {lang === 'uz'
                ? 'Bizda sotiladigan barcha smartfonlar brendlarning O‘zbekistondagi rasmiy vakolatxonalari hamda hamkor servis markazlari tomonidan 1 yil muddatga kafolatlanadi. Muammo kelib chiqqan holatda quyidagi shartlar asosida xizmat ko‘rsatiladi:'
                : 'Все смартфоны в нашем магазине имеют гарантию 1 год от официальных представительств брендов и авторизованных сервисных центров в Узбекистане. Сервисное обслуживание предоставляется на следующих условиях:'}
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-2xl">
                <h5 className="text-xs font-bold text-neutral-950 dark:text-white uppercase tracking-wider font-mono">
                  {lang === 'uz' ? 'Qaytarish va Almashtirish' : 'Возврат и обмен'}
                </h5>
                <p className="text-[11px] text-neutral-400 mt-1 leading-normal">
                  {lang === 'uz'
                    ? 'Zavod defekti aniqlangan taqdirda, mahsulot sotib olingan kundan boshlab 14 kun ichida bepul almashtirib beriladi yoki to‘liq qaytariladi.'
                    : 'В случае выявления заводского брака товар подлежит бесплатному обмену или полному возврату средств в течение 14 дней с момента покупки.'}
                </p>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-2xl">
                <h5 className="text-xs font-bold text-neutral-950 dark:text-white uppercase tracking-wider font-mono">
                  {lang === 'uz' ? 'Kafolat xizmati talablari' : 'Условия гарантийного ремонта'}
                </h5>
                <p className="text-[11px] text-neutral-400 mt-1 leading-normal">
                  {lang === 'uz'
                    ? 'Kafolat taloni va sotib olinganligi to‘g‘risidagi kvitansiya mavjud bo‘lishi lozim. Tashqi mexanik shikastlanishlar va suv kirishi kafolat holati hisoblanmaydi.'
                    : 'Для ремонта требуется гарантийный талон и чек покупки. Механические повреждения корпуса или попадание жидкости не являются гарантийным случаем.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PRIVACY POLICY */}
      {pageType === 'privacy' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            {lang === 'uz' ? 'Maxfiylik Siyosati' : 'Политика конфиденциальности'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            {lang === 'uz'
              ? 'Telefon Vaqti onlayn-do‘koni mijozlarning shaxsiy ma’lumotlari xavfsizligini ta’minlashga yuqori mas’uliyat bilan yondashadi. Ushbu Maxfiylik siyosati biz to‘playdigan shaxsiy ma’lumotlarni qanday qayta ishlashimiz, saqlashimiz va himoya qilishimiz haqida ma’lumot beradi.'
              : 'Интернет-магазин Telefon Vaqti с высокой ответственностью подходит к безопасности личных данных клиентов. Настоящая Политика конфиденциальности содержит информацию о том, как мы собираем, обрабатываем, храним и защищаем личную информацию.'}
          </p>
          <div className="space-y-4 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            <h4 className="font-bold text-neutral-900 dark:text-white">{lang === 'uz' ? '1. Ma’lumotlarni yig‘ish' : '1. Сбор личных данных'}</h4>
            <p>{lang === 'uz' ? 'Siz buyurtma berganingizda, muddatli to‘lovga ariza topshirganingizda yoki saytimizda ro‘yxatdan o‘tganingizda, biz sizning ismingiz, telefon raqamingiz, pasport ma’lumotlaringiz kabi ma’lumotlarni to‘playmiz.' : 'Когда вы оформляете заказ или подаете заявку на рассрочку, мы собираем ваше имя, контактный номер телефона, паспортные данные и информацию об официальном доходе.'}</p>
          </div>
        </div>
      )}

      {/* 6. TERMS OF USE */}
      {pageType === 'terms' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            {lang === 'uz' ? 'Foydalanish Shartlari' : 'Условия использования'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            {lang === 'uz'
              ? 'Telefon Vaqti saytidan foydalanish orqali siz ushbu shartlar va qoidalarga to‘liq rozilik bildirasiz.'
              : 'Используя данный сайт, вы полностью соглашаетесь с настоящими правилами и условиями предоставления услуг.'}
          </p>
          <div className="space-y-4 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            <h4 className="font-bold text-neutral-900 dark:text-white">{lang === 'uz' ? '1. Umumiy qoidalar' : '1. Общие положения'}</h4>
            <p>{lang === 'uz' ? 'Saytdagi barcha narxlar, texnik parametrlar faqat axborot berish xarakteriga ega va ommaviy oferta hisoblanmaydi.' : 'Все представленные цены и технические характеристики носят справочный характер и могут быть изменены до оформления договора купли-продажи.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
