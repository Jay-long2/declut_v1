// User/Shipping types
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipCode: string;
  phone: string;
  county?: string; // For Kenyan addresses
}

// Product/Item types
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

// Order types
export interface OrderData {
  shippingInfo: ShippingInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: 'card' | 'mpesa' | 'paypal';
  cardDetails?: CardDetails;
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
}

// Database types (matching Supabase schema)
export interface DbOrder {
  id?: string;
  order_id: string;
  buyer_id?: string;
  customer_email: string;
  customer_name: string;
  shipping_address: ShippingInfo;
  items: CartItem[];
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered';
  transaction_ref?: string;
  environmental_impact?: EnvironmentalImpact;
  created_at?: string;
}

export interface DbOrderItem {
  id?: string;
  order_id: string;
  product_id: number;
  price: number;
  quantity: number;
}

export interface DbAddress {
  id?: string;
  user_id: string;
  county: string;
  town: string;
  street: string;
  phone: string;
  is_default?: boolean;
}

export interface EnvironmentalImpact {
  co2_offset_kg: number;
  water_saved_l: number;
  plastic_saved_g: number;
  items_saved: number;
}

// PayHero API types
export interface PayHeroPaymentRequest {
  amount: number;
  currency: string;
  email: string;
  phone_number: string;
  transaction_reference: string;
  callback_url: string;
  redirect_url?: string;
  cancel_url?: string;
  metadata: Record<string, any>;
}

export interface PayHeroPaymentResponse {
  success: boolean;
  transaction_id?: string;
  transaction_ref?: string;
  checkout_url?: string;
  redirect_url?: string;
  message?: string;
  status?: string;
}

export interface PayHeroWebhookPayload {
  transaction_ref: string;
  transaction_id?: string;
  status: 'successful' | 'failed' | 'pending' | 'cancelled';
  amount: number;
  currency: string;
  transaction_reference: string;
  metadata?: Record<string, any>;
  payment_method?: string;
  phone_number?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  paymentUrl?: string;
  orderId?: string;
  orderReference?: string;
}

// Context types
export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

// src/lib/types.ts - Add these to your existing types

// Update ShippingInfo interface
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipCode: string;
  phone: string;
  county?: string;
  email?: string;  // ← ADD THIS (optional)
}

// Update OrderData interface
export interface OrderData {
  shippingInfo: ShippingInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: 'card' | 'mpesa' | 'paypal';
  cardDetails?: CardDetails;
  userId?: string;  // ← ADD THIS (optional)
  // Add these if not already there
  orderReference?: string;
}