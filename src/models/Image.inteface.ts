export interface ImageFile {
  url: string;
  file: File;
}
export interface ImageUploadProps {
  onUpload: (files: File[]) => void;
  initialImages: string[];
}
