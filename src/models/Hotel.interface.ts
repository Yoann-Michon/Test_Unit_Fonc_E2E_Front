import { IBooking } from "./Booking.interface";

export interface IHotel {
  id?: string;
  name: string;
  street: string;
  location: string;
  picture_list?: string[];
  description?: string;
  price: number;
  bookings?: IBooking[];
}
