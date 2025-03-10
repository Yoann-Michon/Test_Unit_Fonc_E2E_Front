export interface IBooking {
  id?: string; 
  checkInDate: Date; 
  checkOutDate: Date; 
  createdAt: Date; 
  userId: string; 
  hotelId: string;
}