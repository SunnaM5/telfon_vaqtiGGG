import { OrderTrack } from '../types';

export const mockOrders: OrderTrack[] = [
  {
    id: 'TV-4819',
    customerName: 'Shuhrat Uldashev',
    phoneNumber: '998901234567',
    productName: 'iPhone 15 Pro Max 256GB (Titanium Gray)',
    totalPrice: 18500000,
    paymentMethod: 'installment',
    status: 'approved',
    date: '2026-07-07 10:30',
    history: [
      {
        status: 'sent',
        date: '2026-07-07 10:32',
        descriptionUz: 'Arizangiz muvaffaqiyatli qabul qilindi va tizimda ro‘yxatga olindi.',
        descriptionRu: 'Ваша заявка успешно принята и зарегистрирована в системе.',
      },
      {
        status: 'called',
        date: '2026-07-07 10:45',
        descriptionUz: 'Kompaniya menejeri Shoxrux siz bilan bog‘lanib, ma’lumotlarni tasdiqladi.',
        descriptionRu: 'Менеджер компании Шохрух связался с вами и подтвердил данные.',
      },
      {
        status: 'approved',
        date: '2026-07-07 11:15',
        descriptionUz: 'Tabriklaymiz! Bank hamkorlarimiz tomonidan muddatli to‘lov arizangiz to‘liq tasdiqlandi.',
        descriptionRu: 'Поздравляем! Ваша заявка на рассрочку была полностью одобрена нашими банками-партнерами.',
      },
    ],
  },
  {
    id: 'TV-2026',
    customerName: 'Sardor Akhmedov',
    phoneNumber: '998935556677',
    productName: 'Samsung Galaxy S24 Ultra 256GB (Titanium Black)',
    totalPrice: 16200000,
    paymentMethod: 'cash',
    status: 'ready',
    date: '2026-07-08 08:00',
    history: [
      {
        status: 'sent',
        date: '2026-07-08 08:05',
        descriptionUz: 'Buyurtma naqd pulda to‘lash sharti bilan qabul qilindi.',
        descriptionRu: 'Заказ принят с условием оплаты наличными.',
      },
      {
        status: 'called',
        date: '2026-07-08 08:15',
        descriptionUz: 'Buyurtma telefon orqali tasdiqlandi, yetkazib berish manzili belgilandi.',
        descriptionRu: 'Заказ подтвержден по телефону, адрес доставки согласован.',
      },
      {
        status: 'approved',
        date: '2026-07-08 08:30',
        descriptionUz: 'Moliyaviy hisob-kitob tasdiqlandi. Kuryer buyurtmani topshirish uchun yo‘lga chiqdi.',
        descriptionRu: 'Финансовый расчет подтвержден. Курьер выехал для передачи заказа.',
      },
      {
        status: 'preparing',
        date: '2026-07-08 08:45',
        descriptionUz: 'Mahsulot tekshirildi, kafolat taloni rasmiylashtirildi va qadoqlandi.',
        descriptionRu: 'Товар проверен, оформлен гарантийный талон и упакован.',
      },
      {
        status: 'ready',
        date: '2026-07-08 09:10',
        descriptionUz: 'Kuryer yo‘lda, taxminiy yetib borish vaqti 40 daqiqa.',
        descriptionRu: 'Курьер в пути, примерное время прибытия 40 минут.',
      },
    ],
  },
];
