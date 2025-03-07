import { useState, ChangeEvent } from "react";

interface ImageFile {
  url: string;
  file: File;
}

const useImageUpload = () => {
  const [images, setImages] = useState<ImageFile[]>([]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length) {
      const newImages = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setImages(prevImages => [...prevImages, ...newImages]);
    }
  };

  return { images, handleImageUpload };
};

export default useImageUpload;
