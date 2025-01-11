"use client";
// Types for event tracking

interface UserEvent {
  type: "mouseDown" | "keyPress";
  timestamp: number;
  details: {
    x?: number;
    y?: number;
    key?: string;
  };
}
// this is a comment

interface RecordingOptions {
  includeAudio?: boolean;
  preferredDisplaySurface?: "browser" | "window" | "monitor";
  systemAudio?: boolean;
}

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * ScreenRecorder Component - Handles screen recording with event tracking
 * Features:
 * - Full screen recording (including external windows)
 * - Mouse down event tracking
 * - Keyboard event tracking
 * - Event data export alongside video
 */
const ScreenRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  console.log({ userEvents });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track mouse down events
  const trackMouseDown = useCallback(
    (e: MouseEvent) => {
      if (recording && startTimeRef.current) {
        const timestamp = Date.now() - startTimeRef.current;
        setUserEvents((prev) => [
          ...prev,
          {
            type: "mouseDown",
            timestamp,
            details: {
              x: e.clientX,
              y: e.clientY,
            },
          },
        ]);
      }
    },
    [recording],
  );
  // this is a keyboard
  // Track keyboard events
  const trackKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (recording && startTimeRef.current) {
        console.log("Key press", e.key);

        const timestamp = Date.now() - startTimeRef.current;
        setUserEvents((prev) => [
          ...prev,
          {
            type: "keyPress",
            timestamp,
            details: {
              key: e.key,
            },
          },
        ]);
      }
    },
    [recording],
  );

  useEffect(() => {
    window.addEventListener("mousedown", trackMouseDown);
    window.addEventListener("keydown", trackKeyPress);

    return () => {
      window.removeEventListener("mousedown", trackMouseDown);
      window.removeEventListener("keydown", trackKeyPress);
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [trackMouseDown, trackKeyPress]);

  const startRecording = async (options: RecordingOptions = {}) => {
    try {
      setError(null);
      setUserEvents([]); // Reset events for new recording

      const displayMediaOptions = {
        video: {
          displaySurface: options.preferredDisplaySurface,
        },
        audio: options.includeAudio ?? true,
        systemAudio: options.systemAudio ? "include" : "exclude",
      };

      const stream =
        await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      setMediaStream(stream);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });
      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now();

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        setError("Recording failed: " + event.error);
        stopRecording();
      };

      mediaRecorder.start(1000); // Collect data every second
      setRecording(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start recording",
      );
      console.error("Error starting screen recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    mediaStream?.getTracks().forEach((track) => track.stop());
    setRecording(false);
    startTimeRef.current = null;
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0) return;

    try {
      // Save video
      const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(videoBlob);
      const videoLink = document.createElement("a");
      videoLink.href = videoUrl;
      videoLink.download = `screen-recording-${new Date().toISOString()}.webm`;
      videoLink.click();
      URL.revokeObjectURL(videoUrl);

      // Save event data
      const eventData = JSON.stringify(userEvents, null, 2);
      const eventBlob = new Blob([eventData], { type: "application/json" });
      const eventUrl = URL.createObjectURL(eventBlob);
      const eventLink = document.createElement("a");
      eventLink.href = eventUrl;
      eventLink.download = `events-${new Date().toISOString()}.json`;
      eventLink.click();
      URL.revokeObjectURL(eventUrl);
    } catch (err) {
      setError("Failed to download recording");
      console.error("Error downloading recording:", err);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardContent className="p-6">
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button
              onClick={() =>
                startRecording({
                  includeAudio: true,
                  preferredDisplaySurface: "monitor",
                  systemAudio: true,
                })
              }
              disabled={recording}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Start Recording
            </Button>
            <Button
              onClick={stopRecording}
              disabled={!recording}
              className="bg-red-500 hover:bg-red-600"
            >
              Stop Recording
            </Button>
            <Button
              onClick={downloadRecording}
              disabled={recordedChunks.length === 0}
              className="bg-green-500 hover:bg-green-600"
            >
              Download Recording
            </Button>
          </div>

          {recordedChunks.length > 0 && (
            <video
              controls
              src={URL.createObjectURL(
                new Blob(recordedChunks, { type: "video/webm" }),
              )}
              className="mt-4 w-full"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScreenRecorder;
