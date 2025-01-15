import React, { useCallback, useEffect, useState } from "react";

type DropzoneProps = {
  onFilesDrop: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
};

const Dropzone: React.FC<DropzoneProps> = ({
  onFilesDrop,
  multiple = false,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      return files.filter((file) => {
        if (!file.type.match(accept)) {
          setError(`Only ${accept} files are allowed.`);
          return false;
        }
        if (file.size > maxSize) {
          setError(`File size should not exceed ${maxSize / (1024 * 1024)}MB.`);
          return false;
        }
        return true;
      });
    },
    [accept, maxSize],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setError(null);

      if (e.dataTransfer) {
        const { files } = e.dataTransfer;
        const validFiles = validateFiles(Array.from(files));

        if (validFiles.length) {
          onFilesDrop(multiple ? validFiles : [validFiles[0]]);
        }
      }
    },
    [multiple, onFilesDrop, validateFiles],
  );

  useEffect(() => {
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [handleDragOver, handleDragLeave, handleDrop]);

  if (!isDragging) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center border bg-blue-500 bg-opacity-50">
      <p className="text-2xl font-bold text-white">Drop files here</p>
      {error && (
        <div className="absolute bottom-4 left-4 right-4 rounded bg-red-500 p-2 text-white">
          {error}
        </div>
      )}
    </div>
  );
};

export default Dropzone;
