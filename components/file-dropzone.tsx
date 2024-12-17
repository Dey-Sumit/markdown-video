"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Trash2, UploadIcon, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileWithPreview extends File {
  preview: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function calculateTotalSize(files: File[]): string {
  const totalBytes = files.reduce((acc, file) => acc + file.size, 0);
  return formatFileSize(totalBytes);
}

export function FileDropzone() {
  const [files, setFiles] = React.useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = React.useState(false);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    maxFiles: 10,
  });

  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.preview !== fileToRemove.preview),
    );
    URL.revokeObjectURL(fileToRemove.preview);
  };

  const handleIndividualFileUpload = async (file: File) => {
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          size: file.size,
          contentType: file.type,
        }),
      });

      const { presignedUrl, readUrl } = await response.json();

      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      return readUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const uploadPromises = files.map(handleIndividualFileUpload);
      const urls = await Promise.allSettled(uploadPromises);
      console.log("Uploaded URLs:", urls);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <section className="space-y-4">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border border-dashed p-4 text-center transition-colors hover:bg-muted/50 ${
          isDragActive
            ? "border-primary bg-muted/50"
            : "border-muted-foreground/25 bg-muted/25"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Icon />
          <p className="text-sm">
            Drop your files or{" "}
            <span className="font-medium text-primary">browse</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Images and videos only
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((file) => (
            <div
              key={file.preview}
              className="flex gap-2 rounded-lg border border-border/50 bg-muted/25 p-2 transition-colors"
            >
              <div className="shrink-0">
                {file.type.startsWith("image/") ? (
                  <div className="size-10 overflow-hidden rounded-sm">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <FileVideo
                    strokeWidth={1}
                    className="-ml-1 size-10 text-muted-foreground"
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="truncate text-xs font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {file.type.split("/")[1].toUpperCase()} •{" "}
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full transition-colors hover:bg-destructive/30 hover:text-destructive"
                onClick={() => removeFile(file)}
              >
                <Trash2 className="size-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        className="w-full text-xs"
        variant="bezel"
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
      >
        <UploadIcon className="mr-2 h-4 w-4" />
        {uploading
          ? "Uploading..."
          : `Upload Files (${calculateTotalSize(files)})`}
      </Button>
    </section>
  );
}

const Icon = () => (
  <svg
    className="mx-auto w-12 text-gray-400 dark:text-neutral-400"
    width="70"
    height="46"
    viewBox="0 0 70 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.05172 9.36853L17.2131 7.5083V41.3608L12.3018 42.3947C9.01306 43.0871 5.79705 40.9434 5.17081 37.6414L1.14319 16.4049C0.515988 13.0978 2.73148 9.92191 6.05172 9.36853Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      className="fill-white stroke-gray-400 dark:fill-neutral-800 dark:stroke-neutral-500"
    ></path>
    <path
      d="M63.9483 9.36853L52.7869 7.5083V41.3608L57.6982 42.3947C60.9869 43.0871 64.203 40.9434 64.8292 37.6414L68.8568 16.4049C69.484 13.0978 67.2685 9.92191 63.9483 9.36853Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      className="fill-white stroke-gray-400 dark:fill-neutral-800 dark:stroke-neutral-500"
    ></path>
    <rect
      x="17.0656"
      y="1.62305"
      width="35.8689"
      height="42.7541"
      rx="5"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      className="fill-white stroke-gray-400 dark:fill-neutral-800 dark:stroke-neutral-500"
    ></rect>
    <path
      d="M47.9344 44.3772H22.0655C19.3041 44.3772 17.0656 42.1386 17.0656 39.3772L17.0656 35.9161L29.4724 22.7682L38.9825 33.7121C39.7832 34.6335 41.2154 34.629 42.0102 33.7025L47.2456 27.5996L52.9344 33.7209V39.3772C52.9344 42.1386 50.6958 44.3772 47.9344 44.3772Z"
      stroke="currentColor"
      strokeWidth="2"
      className="stroke-gray-400 dark:stroke-neutral-500"
    ></path>
    <circle
      cx="39.5902"
      cy="14.9672"
      r="4.16393"
      stroke="currentColor"
      strokeWidth="2"
      className="stroke-gray-400 dark:stroke-neutral-500"
    ></circle>
  </svg>
);
