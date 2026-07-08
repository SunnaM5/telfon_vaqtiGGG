import { useEffect } from 'react';
import { ActivePage, Language } from '../types';
import { translations } from '../data/translations';

interface SEOProps {
  page: ActivePage;
  lang: Language;
  productName?: string;
  productPrice?: number;
  productDesc?: string;
  productImage?: string;
}

export default function SEOHead({
  page,
  lang,
  productName,
  productPrice,
  productDesc,
  productImage,
}: SEOProps) {
  const t = translations[lang];

  useEffect(() => {
    // 1. Set document title and description based on page
    let title = `${t.appName} | ${t.appSlogan}`;
    let desc = t.heroSubtitle;

    switch (page) {
      case 'home':
        title = `${t.appName} | ${t.appSlogan}`;
        desc = t.heroSubtitle;
        break;
      case 'catalog':
        title = `${t.navCatalog} | ${t.appName}`;
        desc = lang === 'uz' 
          ? 'O‘zbekistondagi eng so‘nggi smartfonlar va original aksessuarlar katalogi. Bo‘lib to‘lash va tezkor yetkazib berish.' 
          : 'Каталог новейших смартфонов и оригинальных аксессуаров в Узбекистане. Рассрочка и быстрая доставка.';
        break;
      case 'product-details':
        if (productName) {
          title = `${productName} ${lang === 'uz' ? 'muddatli to‘lovga sotib olish' : 'купить в рассрочку'} | ${t.appName}`;
          desc = productDesc || `${productName} ${lang === 'uz' ? 'eng arzon narxlarda, kafolat va muddatli to‘lov asosida sotib oling' : 'купить по лучшей цене с гарантией и рассрочкой'}`;
        }
        break;
      case 'installment':
        title = `${t.navInstallment} | ${t.appName}`;
        desc = t.instSubtitle;
        break;
      case 'trade-in':
        title = `${t.navTradeIn} | ${t.appName}`;
        desc = t.tradeSubtitle;
        break;
      case 'accessories':
        title = `${t.navAccessories} | ${t.appName}`;
        desc = lang === 'uz' ? 'Telefon g‘iloflari, quloqchinlar va zaryadlovchilar to‘plami.' : 'Коллекция чехлов, наушников и зарядных устройств.';
        break;
      case 'promotions':
        title = `${t.navPromotions} | ${t.appName}`;
        desc = t.newsletterSubtitle;
        break;
      case 'order-status':
        title = `${t.navOrderStatus} | ${t.appName}`;
        desc = t.trackSubtitle;
        break;
      case 'about':
        title = `${t.navAbout} | ${t.appName}`;
        desc = lang === 'uz' ? 'Telefon Vaqti - O‘zbekistondagi yetakchi va ishonchli mobil texnikalar do‘koni.' : 'Telefon Vaqti - ведущий и надежный магазин мобильной техники в Узбекистане.';
        break;
      case 'contacts':
        title = `${t.navContacts} | ${t.appName}`;
        desc = lang === 'uz' ? 'Biz bilan bog‘lanish, manzilimiz va aloqa raqamlarimiz.' : 'Свяжитесь с нами, наш адрес и контактные номера.';
        break;
      case 'delivery':
        title = `${t.navDelivery} | ${t.appName}`;
        desc = lang === 'uz' ? 'O‘zbekiston bo‘ylab tezkor va bepul yetkazib berish shartlari.' : 'Условия быстрой и бесплатной доставки по всему Узбекистану.';
        break;
      case 'warranty':
        title = `${t.navWarranty} | ${t.appName}`;
        desc = lang === 'uz' ? '1 yillik rasmiy kafolat va servis xizmati kafolatlari.' : '1 год официальной гарантии и условия сервисного обслуживания.';
        break;
      case 'faq':
        title = `${t.navFaq} | ${t.appName}`;
        desc = t.faqTitle;
        break;
      case 'privacy':
        title = `${t.navPrivacy} | ${t.appName}`;
        desc = lang === 'uz' ? 'Shaxsiy ma’lumotlarni himoya qilish siyosati.' : 'Политика конфиденциальности и защиты персональных данных.';
        break;
      case 'terms':
        title = `${t.navTerms} | ${t.appName}`;
        desc = lang === 'uz' ? 'Foydalanish shartlari va do‘kon qoidalari.' : 'Условия использования и правила магазина.';
        break;
      default:
        title = `${t.appName}`;
    }

    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);

    // 2. Generate and inject structured JSON-LD data
    const existingScript = document.getElementById('seo-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    const schemas: any[] = [];

    // Organization Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': t.appName,
      'url': window.location.origin,
      'logo': `${window.location.origin}/logo.png`,
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+998-90-123-45-67',
        'contactType': 'customer service',
        'areaServed': 'UZ',
        'availableLanguage': ['Uzbek', 'Russian']
      }
    });

    // LocalBusiness Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': t.appName,
      'image': productImage || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      '@id': window.location.href,
      'url': window.location.origin,
      'telephone': '+998-90-123-45-67',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Chilonzor tumani, Qatortol ko‘chasi, 24-uy',
        'addressLocality': 'Tashkent',
        'addressCountry': 'UZ'
      },
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        'opens': '09:00',
        'closes': '21:00'
      }
    });

    // Page Specific Schemas
    if (page === 'product-details' && productName && productPrice) {
      // Product Schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': productName,
        'image': productImage || '',
        'description': desc,
        'offers': {
          '@type': 'Offer',
          'url': window.location.href,
          'priceCurrency': 'UZS',
          'price': productPrice,
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': 'https://schema.org/InStock'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'reviewCount': '148'
        }
      });
    }

    if (page === 'faq') {
      // FAQ Schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': lang === 'uz' ? 'Muddatli to‘lovga qanday hujjatlar kerak?' : 'Какие документы нужны для рассрочки?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': lang === 'uz' 
                ? 'Muddatli to‘lov uchun faqatgina shaxsni tasdiqlovchi pasport yoki ID karta hamda faol plastik karta talab qilinadi.'
                : 'Для оформления рассрочки требуется только паспорт или ID-карта, удостоверяющие личность, а также активная пластиковая карта.'
            }
          },
          {
            '@type': 'Question',
            'name': lang === 'uz' ? 'Yetkazib berish shartlari qanday?' : 'Каковы условия доставки?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': lang === 'uz'
                ? 'Toshkent shahri bo‘ylab yetkazib berish bepul va 2 soat ichida amalga oshiriladi. Viloyatlarga yetkazib berish 1 ish kuni davomida amalga oshiriladi.'
                : 'Доставка по Ташкенту бесплатная и осуществляется в течение 2 часов. Доставка в регионы осуществляется в течение 1 рабочего дня.'
            }
          }
        ]
      });
    }

    const script = document.createElement('script');
    script.id = 'seo-jsonld';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schemas);
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById('seo-jsonld');
      if (s) {
        s.remove();
      }
    };
  }, [page, lang, productName, productPrice, productDesc, productImage]);

  return null;
}
