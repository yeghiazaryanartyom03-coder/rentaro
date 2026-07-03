export interface Car{
  id: string;  
  brand: string;
  model: string;
  year: number;
  priceAMD: number;
  fuel?: string | null;
  transmission?: string | null;
  body?: string | null;
  color: string
  engine?: string | null;
  horsePower?: number | null;
  quantity: number;
  description?: string | null;
  seats?: number | null;
  createdAt: Date;
  images?: Image[];
  bookings?: Booking[]
}

export interface Image {
  id: string;
  url: string;
  carId: string;
}

export interface Booking {
  id: string;
  carId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  startDate: Date;
  endDate: Date;
  status: string; 
  createdAt: Date;
}