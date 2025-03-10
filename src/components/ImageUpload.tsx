import { useState, ChangeEvent } from "react";
import { Box, Button, Typography, CircularProgress, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ImageFile, ImageUploadProps } from "../models/Image.inteface";




const MAX_IMAGES = 10;
const MAX_SIZE_MB = 5;
const VALID_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const validFiles = files.filter(file => {
      const isValidType = VALID_TYPES.includes(file.type);
      const isValidSize = file.size <= MAX_SIZE_MB * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length + images.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const newImages = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));

    setImages(prevImages => [...prevImages, ...newImages]);
    onUpload([...images.map(img => img.file), ...validFiles]);
    setError(null);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      URL.revokeObjectURL(newImages[index].url); // Free up memory
      newImages.splice(index, 1);
      onUpload(newImages.map(img => img.file));
      return newImages;
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload your pictures
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {images.length} / {MAX_IMAGES} images selected
          {images.length === 0 && " (JPEG, PNG, WebP, max 5MB each)"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {images.map((image, index) => (
          <Box 
            key={index} 
            sx={{ 
              position: "relative", 
              width: 100, 
              height: 100, 
              border: "1px solid #ddd", 
              borderRadius: 1 
            }}
          >
            <img 
              src={image.url} 
              alt={`Preview ${index}`} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
            <IconButton
              size="small"
              sx={{ 
                position: "absolute", 
                top: -8, 
                right: -8, 
                bgcolor: "background.paper", 
                "&:hover": { bgcolor: "error.light", color: "white" } 
              }}
              onClick={() => handleRemoveImage(index)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          variant="outlined"
          component="label"
          disabled={uploading || images.length >= MAX_IMAGES}
        >
          {uploading ? "Uploading..." : "Select Images"}
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleImageUpload}
            hidden
          />
        </Button>

        {uploading && (
          <CircularProgress size={24} sx={{ ml: 2 }} />
        )}
      </Box>
    </Box>
  );
}