import { IBooking } from "./Booking.interface";

export interface IHotel {
  id?: string;
  name: string;
  location: string;
  picture_list: string;
  description: string;
  price: number;
  bookings?: IBooking[];
}
