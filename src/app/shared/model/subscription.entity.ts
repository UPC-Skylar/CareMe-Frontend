export interface Subscription {
  id: string;
  userId: string;
  planType: 'premium' | 'promax';
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
}
