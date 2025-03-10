export interface IBooking {
  id?: string; 
  checkInDate: Date; 
  checkOutDate: Date;
  userId: string; 
  hotelId: string;
}