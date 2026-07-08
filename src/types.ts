export interface Specification {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'phones' | 'accessories';
  storage: string[];
  ram: string[];
  colors: { name: string; hex: string }[];
  price: number; // in UZS
  oldPrice?: number; // in UZS
  discount?: number; // percentage
  installment12: number; // monthly for 12 months in UZS
  availability: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specifications: Specification[];
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedStorage: string;
}

export type ActivePage =
  | 'home'
  | 'catalog'
  | 'product-details'
  | 'installment'
  | 'trade-in'
  | 'accessories'
  | 'promotions'
  | 'about'
  | 'contacts'
  | 'delivery'
  | 'warranty'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'order-status';

export type Language = 'uz' | 'ru';
export type Theme = 'light' | 'dark';

export interface OrderTrack {
  id: string;
  customerName: string;
  phoneNumber: string;
  productName: string;
  totalPrice: number;
  paymentMethod: 'cash' | 'installment';
  status: 'sent' | 'called' | 'approved' | 'preparing' | 'ready' | 'delivered' | 'processing' | 'cancelled';
  date: string;
  history: {
    status: 'sent' | 'called' | 'approved' | 'preparing' | 'ready' | 'delivered' | 'processing' | 'cancelled';
    date: string;
    descriptionUz: string;
    descriptionRu: string;
  }[];
}
