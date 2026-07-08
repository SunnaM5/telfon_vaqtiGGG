import React, { useState } from 'react';
import { ActivePage, Language } from '../types';
import { translations } from '../data/translations';
import { Mail, Phone, MapPin, Clock, Send, SendHorizontal, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  setSelectedProductId: (id: string | null) => void;
  lang: Language;
  onSubscribe: (msg: string) => void;
}

export default function Footer({ setActivePage, setSelectedProductId, lang, onSubscribe }: FooterProps) {
  const [email, setEmail] = useState('');
  const t = translations[lang];

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubscribe(t.subscribeSuccess);
    setEmail('');
  };

  const companyLinks: { page: ActivePage; label: string }[] = [
    { page: 'about', label: t.navAbout },
    { page: 'contacts', label: t.navContacts },
    { page: 'promotions', label: t.navPromotions },
  ];

  const supportLinks: { page: ActivePage; label: string }[] = [
    { page: 'faq', label: t.navFaq },
    { page: 'delivery', label: t.navDelivery },
    { page: 'warranty', label: t.navWarranty },
  ];

  const legalLinks: { page: ActivePage; label: string }[] = [
    { page: 'privacy', label: t.navPrivacy },
    { page: 'terms', label: t.navTerms },
  ];

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-20 pb-8 border-t border-neutral-900 overflow-hidden relative">
      {/* Absolute background decoration element */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Superior USP Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-neutral-900">
          <div className="flex gap-4 items-start">
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800/50 text-cyan-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">{t.navDelivery}</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {lang === 'uz' ? 'Toshkent bo‘ylab 2 soatda, viloyatlarga 1 kunda eng ishonchli yetkazib berish.' : 'Самая надежная доставка по Ташкенту за 2 часа, в регионы за 1 день.'}
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800/50 text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">{t.navWarranty}</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {lang === 'uz' ? 'Barcha telefonlarga 1 yillik rasmiy servis kafolati beriladi.' : 'На все телефоны предоставляется 1 год официальной сервисной гарантии.'}
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800/50 text-purple-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">Trade-In 2.0</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {lang === 'uz' ? 'Eski telefoningizni adolatli baholash bilan yangisiga almashtiring.' : 'Обменяйте свой старый телефон на новый с честной оценкой стоимости.'}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Links and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16">
          {/* Logo and Brand */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActivePage('home'); setSelectedProductId(null); }}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-lg">
                T
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block leading-none">
                  {t.appName}
                </span>
                <span className="text-[9px] font-medium tracking-widest text-neutral-400 uppercase leading-none mt-1 block">
                  VAQTI
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {t.heroSubtitle}
            </p>
            <div className="space-y-3 pt-2">
              <p className="text-xs flex items-center gap-2.5 text-neutral-400">
                <Phone className="w-4 h-4 text-cyan-400" />
                <a href="tel:+998901234567" className="hover:text-white transition-colors">+998 90 123 45 67</a>
              </p>
              <p className="text-xs flex items-start gap-2.5 text-neutral-400">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{t.footerAddress}</span>
              </p>
              <p className="text-xs flex items-center gap-2.5 text-neutral-400">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{t.footerWorkingHours}</span>
              </p>
            </div>
          </div>

          {/* Quick links columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {t.footerNavCompany}
              </h4>
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.page}>
                    <button
                      onClick={() => { setActivePage(link.page); setSelectedProductId(null); }}
                      className="text-xs text-neutral-400 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {t.footerNavSupport}
              </h4>
              <ul className="space-y-2.5">
                {supportLinks.map((link) => (
                  <li key={link.page}>
                    <button
                      onClick={() => { setActivePage(link.page); setSelectedProductId(null); }}
                      className="text-xs text-neutral-400 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter section */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {t.newsletterTitle}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {t.newsletterSubtitle}
            </p>
            <form onSubmit={handleSubscribeSubmit} className="flex gap-2 relative mt-3">
              <input
                type="email"
                required
                placeholder={t.newsletterPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs py-3 px-4 rounded-xl bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-cyan-500 text-white placeholder-neutral-500"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow-md shadow-cyan-500/10 shrink-0"
              >
                <SendHorizontal className="w-4 h-4" />
              </button>
            </form>
            <div className="flex gap-4 pt-4">
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 border border-neutral-800/50 hover:border-cyan-500 rounded-xl text-neutral-400 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
                </svg>
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 border border-neutral-800/50 hover:border-cyan-500 rounded-xl text-neutral-400 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Legal links footer info */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p className="text-center md:text-left">{t.copyright}</p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => { setActivePage(link.page); setSelectedProductId(null); }}
                className="hover:text-neutral-300 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
