"use client";
import {
  convertMedia,
  type ConvertMediaProgress,
  type ResizeOperation,
} from "@remotion/webcodecs";
import { useDropzone } from "react-dropzone";
import { Trash2, UploadIcon, FileVideo, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCallback, useState } from "react";
import React from "react";
import { webFileReader } from "@remotion/media-parser/web-file";
import { set } from "zod";
const MAX_FILE_SIZE = 120 * 1024 * 1024; // 120MB in bytes

interface VideoFile extends File {
  preview: string;
  file: File;
}
interface VideoState {
  originalPreview: string;
  webmPreview: string;
  webmResizedPreview: string;
}
interface ProcessedVideos {
  fullSize: Blob;
  preview: Blob;
}

type ConversionState = "idle" | "processing" | "done" | "error";

interface ConversionStates {
  webm: ConversionState;
  resized: ConversionState;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function VideoUpload() {
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [videoUrls, setVideoUrls] = useState<VideoState>({
    originalPreview: "",
    webmPreview: "",
    webmResizedPreview: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [conversionStates, setConversionStates] = useState<ConversionStates>({
    webm: "idle",
    resized: "idle",
  });

  console.log({ videoFile, videoUrls, isProcessing, uploadProgress, error });

  const validateVideo = useCallback((file: File): boolean => {
    // Implementation coming soon
    return true;
  }, []);

  const generateVideoPreview = useCallback((file: File): string => {
    // Implementation coming soon
    return "";
  }, []);

  const handleUpload = async (file: File) => {
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
          "Cache-Control": "public, max-age=31536000",
          "Content-Disposition": `attachment; filename="${file.name}"`,
        },
        
      });

      return readUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const handleVideoSelect = useCallback(
    async (file: File) => {
      try {
        if (!validateVideo(file)) {
          throw new Error(
            `Invalid video file. Maximum size: ${formatFileSize(MAX_FILE_SIZE)}`,
          );
        }

        setVideoFile({
          ...file,
          preview: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        } as VideoFile);

        setVideoUrls((prev) => ({
          ...prev,

          originalPreview: URL.createObjectURL(file),
        }));
        setConversionStates({ webm: "processing", resized: "processing" });

        const webmConversion = convertMedia({
          src: file,
          container: "webm",
          reader: webFileReader,
        })
          .then(async (result) => {
            const blob = await result.save();
            setVideoUrls((prev) => ({
              ...prev,
              webmPreview: URL.createObjectURL(blob),
            }));
            setConversionStates((prev) => ({ ...prev, webm: "done" }));
            return blob;
          })
          .catch(() => {
            setConversionStates((prev) => ({ ...prev, webm: "error" }));
          });

        const resizedConversion = convertMedia({
          src: file,
          container: "mp4",
          resize: { mode: "scale", scale: 0.5 },
          reader: webFileReader,
        })
          .then(async (result) => {
            const blob = await result.save();
            setVideoUrls((prev) => ({
              ...prev,
              webmResizedPreview: URL.createObjectURL(blob),
            }));
            setConversionStates((prev) => ({ ...prev, resized: "done" }));
            return blob;
          })
          .catch(() => {
            setConversionStates((prev) => ({ ...prev, resized: "error" }));
          });

        await Promise.allSettled([webmConversion, resizedConversion]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error processing video");
        // handleError(err);
      }
    },
    [validateVideo],
  );

  const handleBackgroundUpload = useCallback(async () => {
    if (!videoFile) return;
    console.log("handleBackgroundUpload ... ", new Date().toLocaleTimeString());

    try {
      // Check which version is ready and upload it
      if (conversionStates.webm === "done" && videoUrls.webmPreview) {
        console.log("Uploading full version...");

        const response = await fetch(videoUrls.webmPreview);
        const webmBlob = await response.blob();
        const webmUrl = await handleUpload(
          new File([webmBlob], "webm-version.webm", { type: "video/webm" }),
        );
        console.log("Full version uploaded:", webmUrl);
      }

      if (conversionStates.resized === "done" && videoUrls.webmResizedPreview) {
        console.log("Uploading preview version...");
        const response = await fetch(videoUrls.webmResizedPreview);
        const resizedBlob = await response.blob();
        const previewUrl = await handleUpload(
          new File([resizedBlob], "preview-version.mp4", { type: "video/mp4" }),
        );
        console.log("Preview version uploaded:", previewUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }, [videoFile, conversionStates, videoUrls]);

  /*   const handleVideoSelect = useCallback(
    async (file: File) => {
      try {
        if (!validateVideo(file)) {
          throw new Error(
            `Invalid video file. Maximum size: ${formatFileSize(MAX_FILE_SIZE)}`,
          );
        }

        setError("");
        setIsProcessing(true);

        // Set original preview
        const originalUrl = URL.createObjectURL(file);
        setVideoFile({
          ...file,
          preview: originalUrl,
          name: file.name,
          size: file.size,
        } as VideoFile);

        setVideoUrls((prev) => ({
          ...prev,
          originalPreview: originalUrl,
        }));

        console.log("Processing video...", new Date().toLocaleTimeString());

        // Convert to WebM without resize
        const onlyWebmResult = await convertMedia({
          src: file,
          container: "webm",
          reader: webFileReader,
          onProgress: (progress) => {
            console.log({ onlyWebmResult: progress.overallProgress });
          },
        });
        console.log({ result: onlyWebmResult });

        const _file = await onlyWebmResult.save();
        setVideoUrls((prev) => ({
          ...prev,
          webmPreview: URL.createObjectURL(_file),
        }));

        const webMAndResize = await convertMedia({
          src: _file,
          container: "mp4",
          resize: {
            mode: "scale",
            scale: 0.5,
          },
          reader: webFileReader,
          onProgress: (progress) => {
            console.log({ webMAndResize: progress.overallProgress });
          },
        });

        console.log("Processed video...", new Date().toLocaleTimeString());

        const _file2 = await webMAndResize.save();
        setVideoUrls((prev) => ({
          ...prev,
          webmResizedPreview: URL.createObjectURL(_file2),
        }));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error processing video";
        setError(errorMessage);
        console.error("Video processing failed:", err);
        setVideoFile(null);
        setVideoUrls({
          originalPreview: "",
          webmPreview: "",
          webmResizedPreview: "",
        });
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [validateVideo],
  );
 */
  const download = useCallback(async () => {}, []);

  const cleanupVideoPreview = useCallback(() => {
    // Implementation coming soon
  }, []);

  const processVideo = useCallback(() => {}, []);

  const convertToWebM = useCallback(async (video: File): Promise<Blob> => {
    // Implementation coming soon
    return new Blob();
  }, []);

  const resizeVideo = useCallback(
    async (video: File, maxHeight: number): Promise<Blob> => {
      // Implementation coming soon
      return new Blob();
    },
    [],
  );

  const uploadToS3 = useCallback(
    async (video: Blob, type: "full" | "preview"): Promise<string> => {
      // Implementation coming soon
      return "";
    },
    [],
  );

  const trackUploadProgress = useCallback((progress: number) => {
    setUploadProgress(progress);
  }, []);

  const handleRemoveVideo = useCallback(() => {
    if (videoFile) {
      URL.revokeObjectURL(videoFile.preview);
    }
    setVideoFile(null);
    setVideoUrls({
      originalPreview: "",
      webmPreview: "",
      webmResizedPreview: "",
    });
    setUploadProgress(0);
    setError("");
  }, [videoFile]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]; // Only take the first file
      if (file) {
        handleVideoSelect(file);
      }
    },
    [handleVideoSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  React.useEffect(() => {
    return () => {
      cleanupVideoPreview();
    };
  }, [cleanupVideoPreview]);

  return (
    <div className="space-y-4">
      {!videoFile ? (
        <div
          {...getRootProps()}
          className={`flex aspect-video h-96 cursor-pointer items-center justify-center rounded-lg border border-dashed p-4 text-center transition-colors hover:bg-muted/50 ${
            isDragActive
              ? "border-primary bg-muted/50"
              : "border-muted-foreground/25 bg-muted/25"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <FileVideo
              className="h-12 w-12 text-muted-foreground"
              strokeWidth={1}
            />
            <p className="text-sm">
              Drop your video or{" "}
              <span className="font-medium text-primary">browse</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative max-w-max overflow-hidden rounded-lg border border-border">
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2 z-10 rounded-full bg-background/80 hover:bg-background/90"
            onClick={handleRemoveVideo}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="relative flex gap-4 overflow-x-scroll">
            <video
              src={videoUrls.originalPreview}
              className="aspect-video h-80 w-full bg-black object-contain"
              controls
            />
            {videoUrls.webmPreview && (
              <video
                src={videoUrls.webmPreview}
                className="aspect-video h-80 w-full bg-black object-contain"
                controls
              />
            )}
            {videoUrls.webmResizedPreview && (
              <video
                src={videoUrls.webmResizedPreview}
                className="aspect-video h-80 w-full bg-black object-contain"
                controls
              />
            )}
          </div>
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="mt-2 text-sm">Processing video...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {videoFile && !isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{videoFile.name}</span>
            <span>{formatFileSize(videoFile.size)}</span>
          </div>

          {uploadProgress > 0 && (
            <Progress value={uploadProgress} className="h-1" />
          )}

          <Button
            className="w-full"
            onClick={handleBackgroundUpload}
            disabled={isProcessing || uploadProgress > 0}
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            {uploadProgress > 0
              ? `Uploading... ${uploadProgress}%`
              : "Upload Video"}
          </Button>
        </div>
      )}
    </div>
  );
}
