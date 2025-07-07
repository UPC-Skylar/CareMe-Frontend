export interface Support {
  id: string;
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'pending' | 'resolved' | 'in-progress';
}
