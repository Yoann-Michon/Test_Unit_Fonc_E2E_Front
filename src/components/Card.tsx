import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import { IHotel } from "../models/Hotel.interface";

interface HotelCardProps {
  hotel: IHotel;
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
  return (
    <Card sx={{ maxWidth: 345, width: 300 }}>
      <CardMedia
        component="img"
        alt={hotel.name}
        height="140"
        image={hotel.picture_list[0] || "https://via.placeholder.com/150"}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {hotel.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {hotel.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">{`${hotel.price} $/night`}</Button>
        <Button size="small">See More</Button>
      </CardActions>
    </Card>
  );
};