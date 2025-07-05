
export interface IClassInstance {
  id: number;
  date: string;
  teacher: string;
  comment?: string;
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
  
  export interface IBooking {
    id: number;                 
    email: string;              
    class_instance_id: number;  
    booking_date: string;       
  }
  