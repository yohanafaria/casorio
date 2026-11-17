export type GiftCategory = 'Todas' | 'Lua de mel';

export type GiftAvailabilityStatus = 'available' | 'reserved' | 'sold_out';

export interface Gift {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: Exclude<GiftCategory, 'Todas'>;
  image: string;
  price: number;
  availableQuantity: number;
  allowPartialContribution: boolean;
  suggestedContributions?: number[];
  active: boolean;
  badge?: string;
  musicalNote?: string;
}

export interface CartItem {
  gift: Gift;
  quantity: number;
  isPartialContribution: boolean;
  customAmount?: number; // Quando allowPartialContribution = true e o convidado escolhe valor parcial
}

export type OrderStatus =
  | 'created'
  | 'awaiting_payment'
  | 'pending_confirmation'
  | 'paid_confirmed_by_backend'
  | 'rejected'
  | 'cancelled';

export interface OrderItemPayload {
  giftId: string;
  giftName: string;
  quantity: number;
  unitPrice: number;
  isPartialContribution: boolean;
  totalItemPrice: number;
}

export interface Order {
  id: string;
  items: OrderItemPayload[];
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message?: string;
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export type PaymentStatus =
  | 'pending'
  | 'in_process'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export interface Payment {
  orderId: string;
  paymentId: string;
  status: PaymentStatus;
  statusDetail: string;
  amount: number;
  paymentMethod: 'pix' | 'credit_card' | 'boleto' | 'mercado_pago_brick';
  createdAt: string;
  verifiedByBackend: boolean;
  preferenceId?: string;
}

export interface Companion {
  name: string;
  dietaryRestrictions?: string;
}

export interface RSVPSubmission {
  id: string;
  token: string;
  fullName: string;
  email: string;
  phone: string;
  inviteCode?: string;
  attending: 'yes' | 'no';
  companionsCount: number;
  companions: Companion[];
  dietaryRestrictions?: string;
  notes?: string;
  consentAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateRSVPPayload = Omit<RSVPSubmission, 'id' | 'token' | 'createdAt' | 'updatedAt'>;
export type UpdateRSVPPayload = Partial<CreateRSVPPayload>;
