
export interface IClassInstance {
  id: number;
  date: string;
  teacher: string;
  comment?: string;
}


export interface IBooking {
  id: string; 
  email: string;
  class_id: number;
  type: string;
  price: number;
  day: string;
  booking_date: Date; 
}


export interface IYogaClass {
  id: number;
  day: string;
  time: string;
  capacity: number;
  duration: string;
  price: number;
  type: string;
  description?: string;
  instances: IClassInstance[];
}
  
