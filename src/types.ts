export interface GiftItem {
  id: string;
  name: string;
  description: string;
  category: string;
  bookedBy?: string | null;
  isBooked: boolean;
  createdAt?: any;
}
