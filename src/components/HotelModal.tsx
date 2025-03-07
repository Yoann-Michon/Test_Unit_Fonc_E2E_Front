import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  styled,
  OutlinedInput,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloseIcon from "@mui/icons-material/Close";
import useImageUpload from "./ImageUpload";
import { AlertColor } from "@mui/material";
import { HotelSchema } from "../schema/HotelSchema";
import { Hotel } from "../models/Hotel.interface";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#fff",
  borderRadius: "8px",
  padding: "24px",
  width: "90%",
  maxWidth: "800px",
  maxHeight: "90vh",
  overflow: "auto",
  position: "relative",
}));

const ImagePreview = styled(Box)({
  width: "100%",
  height: "200px",
  border: "2px dashed #ccc",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "16px",
  cursor: "pointer",
  "&:hover": {
    borderColor: "#666",
  },
});

interface HotelModalProps {
  isAdmin: boolean;
}

export const HotelModal = ({ isAdmin }: HotelModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Hotel>({
    name: "",
    location: "",
    price: 0,
    description: "",
    picture_list: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const currencies = ["USD", "EUR", "GBP", "JPY"];
  const [currency, setCurrency] = useState("USD");

  const { images, handleImageUpload } = useImageUpload();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      price: 0,
      description: "",
      picture_list: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const { error } = HotelSchema.validate(formData, { abortEarly: false });

    if (error) {
      const newErrors: { [key: string]: string } = {};

      error.details.forEach((detail) => {
        const fieldName = detail.path[0];
        newErrors[fieldName] = detail.message;
      });

      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setSnackbar({
        open: true,
        message: "Hotel information saved successfully!",
        severity: "success",
      });
      handleClose();
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Add Hotel
      </Button>

      <StyledModal
        open={open}
        onClose={handleClose}
        aria-labelledby="hotel-modal-title"
        aria-describedby="hotel-modal-description"
      >
        <ModalContent>
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>

          <Typography
            variant="h5"
            component="h2"
            id="hotel-modal-title"
            gutterBottom
          >
            Add Hotel Information
          </Typography>

          <Box component="form" sx={{ mt: 2 }}>
            <ImagePreview
              sx={{
                backgroundImage: images[0] ? `url(${images[0].url})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!images.length && (
                <Box sx={{ textAlign: "center" }}>
                  <FileUploadIcon fontSize="large" />
                  <Typography>Drag & Drop or Click to Upload Image</Typography>
                </Box>
              )}
              <input
                type="file"
                id="image-upload"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </ImagePreview>

            <TextField
              fullWidth
              label="Hotel Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              required
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="price">Price</InputLabel>
                <OutlinedInput
                  id="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  startAdornment={
                    <InputAdornment position="start">{currency}</InputAdornment>
                  }
                  error={!!errors.price}
                  label="Price"
                />
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  label="Currency"
                >
                  {currencies.map((curr) => (
                    <MenuItem key={curr} value={curr}>
                      {curr}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              error={!!errors.description}
              helperText={errors.description}
              margin="normal"
            />

            <Box
              sx={{
                mt: 3,
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={Object.keys(errors).length > 0}
              >
                Save
              </Button>
            </Box>
          </Box>
        </ModalContent>
      </StyledModal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};