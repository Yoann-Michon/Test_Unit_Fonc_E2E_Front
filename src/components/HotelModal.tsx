import { useState, ChangeEvent, useEffect } from "react";
import { styled } from "@mui/system";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageUpload from "./ImageUpload"; 
import { HotelSchema } from "../schema/HotelSchema";
import { IHotel } from "../models/Hotel.interface";
import {SlideSnackbar} from "./SlideSnackbar";
import { hotelService } from "../services/Hotel.service";

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

interface HotelModalProps {
  onSuccess?: () => void;
  hotelToEdit?: IHotel | null; 
  open: boolean;
  onClose: () => void;
}

export const HotelModal = ({ onSuccess, hotelToEdit, open, onClose }: HotelModalProps) => {
  const [formData, setFormData] = useState<IHotel>({
    name: "",
    location: "",
    price: 0,
    description: "",
    picture_list: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type?: "success" | "error" | "info"; 
  }>({
    open: false,
    message: "",
  });

  useEffect(() => {
    if (hotelToEdit) {
      setFormData(hotelToEdit);
      const filePromises = hotelToEdit.picture_list?.map(async (picUrl) => {
        try {
          return new File([], picUrl, { type: "image/jpeg" });
        } catch (error) {
          console.error("Error creating file from URL:", error);
          return new File([], picUrl);
        }
      }) || [];
      
      Promise.all(filePromises).then(files => {
        setImageFiles(files);
      });
    } else {
      setFormData({
        name: "",
        location: "",
        price: 0,
        description: "",
        picture_list: [],
      });
      setImageFiles([]);
    }
  }, [hotelToEdit]);

  const validateForm = () => {
    const { error } = HotelSchema.validate(formData, { abortEarly: false });

    if (error) {
      const newErrors: { [key: string]: string } = {};
      error.details.forEach((detail) => {
        const fieldName = String(detail.path[0]);
        newErrors[fieldName] = detail.message;
      });

      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleDelete = async (id: string) => {
    try {
      await hotelService.deleteHotel(id);
      setSnackbar({
        open: true,
        message: "Hotel deleted successfully!",
        type: "success",
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "Failed to delete hotel",
        type: "error",
      });
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        if (hotelToEdit) {
          if (hotelToEdit.id) {
            await hotelService.updateHotel(hotelToEdit.id, formData, imageFiles);
          } else {
            throw new Error("Hotel ID is undefined");
          }
          setSnackbar({
            open: true,
            message: "Hotel updated successfully!",
            type: "success",
          });
        } else {
          await hotelService.createHotel(formData, imageFiles);
          setSnackbar({
            open: true,
            message: "Hotel created successfully!",
            type: "success",
          });
        }

        if (onSuccess) onSuccess();
        onClose(); 
      } catch (error) {
        setSnackbar({
          open: true,
          message: error instanceof Error ? error.message : "Failed to save hotel",
          type: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleImageUpload = (files: File[]) => {
    setImageFiles(files);
    setFormData({
      ...formData,
      picture_list: files.length ? files.map(file => URL.createObjectURL(file)) : [],
    });
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const parsedValue = parseFloat(inputValue);
    setFormData({
      ...formData,
      price: inputValue === "" || isNaN(parsedValue) ? 0 : parsedValue,
    });
  };

  return (
    <>
      <StyledModal
        open={open}
        onClose={onClose}
        aria-labelledby="hotel-modal-title"
        aria-describedby="hotel-modal-description"
      >
        <ModalContent>
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={onClose}
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
            {hotelToEdit ? "Edit Hotel Information" : "Add Hotel Information"}
          </Typography>

          <Box component="form" sx={{ mt: 2 }}>
            <ImageUpload onUpload={handleImageUpload} initialImages={formData.picture_list || []} />

            <TextField
              fullWidth
              label="Hotel Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={!!errors.location}
              helperText={errors.location}
              margin="normal"
              required
            />

            <FormControl fullWidth variant="outlined" sx={{ mt: 2, mb: 1 }}>
              <InputLabel htmlFor="price">Price</InputLabel>
              <OutlinedInput
                id="price"
                value={formData.price === 0 ? "" : formData.price}
                onChange={handlePriceChange}
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                startAdornment={<InputAdornment position="start">USD</InputAdornment>}
                error={!!errors.price}
                label="Price"
                placeholder="0"
              />
              {errors.price && <Typography variant="caption" color="error">{errors.price}</Typography>}
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={!!errors.description}
              helperText={errors.description}
              margin="normal"
            />

            <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={onClose}>Cancel</Button>
              {hotelToEdit && (
                <Button variant="outlined" color="error" onClick={() => hotelToEdit?.id && handleDelete(hotelToEdit.id)}>
                  Delete Hotel
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? "Saving..." : hotelToEdit ? "Save Changes" : "Create"}
              </Button>
            </Box>
          </Box>
        </ModalContent>
      </StyledModal>

      <SlideSnackbar 
        open={snackbar.open} 
        message={snackbar.message} 
        severity={snackbar.type || "info"} 
        onClose={() => setSnackbar({ ...snackbar, open: false })} 
      />
    </>
  );
};