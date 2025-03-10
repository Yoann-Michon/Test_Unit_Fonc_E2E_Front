import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ImageCarouselProps {
  list: string[];
}

export const Carousel = ({ list }: ImageCarouselProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setTimeout(() => {
      setActiveStep((prevStep) => (prevStep + 1) % list.length);
    }, 200);
  };

  const handleBack = () => {
    setTimeout(() => {
      setActiveStep((prevStep) => (prevStep - 1 + list.length) % list.length);
    }, 200);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "800px",
        aspectRatio: "16/9",
        overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(-${activeStep * 100}%)`,
        }}
      >
        {list.map((src, index) => (
          <Box
            key={index}
            component="img"
            src={src}
            alt={`Image ${index + 1}`}
            sx={{
              minWidth: "100%",
              height: "100%",
              objectFit: "cover",
              aspectRatio: "16/9",
            }}
          />
        ))}
      </Box>

      <IconButton
        onClick={handleBack}
        sx={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <ArrowForwardIcon />
      </IconButton>
    </Box>
  );
};
