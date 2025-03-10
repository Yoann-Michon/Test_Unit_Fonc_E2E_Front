import { IBooking } from "./Booking.interface";

export interface IUser {
  id?: string;
  firstname?: string;
  lastname?: string;
  pseudo?:string;
  email: string;
  password?: string;
  role?: "USER" | "ADMIN";
  bookings?: IBooking[];
}
