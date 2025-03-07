import { IUser } from "./User.interface"
import { IHotel } from "./Hotel.interface"

export interface IBooking {
  id: string; 
  checkInDate: Date; 
  checkOutDate: Date; 
  createdAt: Date; 
  user: IUser; 
  hotel: IHotel;
}