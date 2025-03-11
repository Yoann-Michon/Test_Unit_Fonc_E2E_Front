import { IHotel } from "./Hotel.interface";
import { IUser } from "./User.interface";

export interface IBooking {
  id?: string; 
  checkInDate: Date; 
  checkOutDate: Date;
  user?: IUser;
  hotel?: IHotel;
}