export type ProductVariant = 'black' | 'white';

export interface OrderForm {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  variant: ProductVariant;
  quantity: number;
  paymentMethod: 'cod' | 'bank_transfer';
  notes?: string;
}

export interface ConfirmedOrder {
  orderId: string;
  timestamp: string;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: string;
}
