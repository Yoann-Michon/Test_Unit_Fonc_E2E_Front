import { IBooking } from "./Booking.interface";

export interface IUser {
  id?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  password?: string;
  role?: "USER" | "ADMIN";
  bookings?: IBooking[];
}
