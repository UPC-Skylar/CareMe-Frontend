export interface History {
  id: string;
  userId: string;
  caregiverId: string;
  date: string;
  duration: string;
  status: 'completed' | 'cancelled' | 'pending';
  amount: number;
  currency: string;
  description: string;
}
