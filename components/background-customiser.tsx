"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { SidebarBlock } from "./app-sidebar";
import { Button } from "./ui/button";
import { ColorPicker } from "./ui/color-picker";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

interface BackgroundSettings {
  padding: number;
  borderRadius: number;
  inset: number;
}

const gradientPresets = [
  { from: "#ff0000", to: "#00ff00" },
  { from: "#0000ff", to: "#ffff00" },
  { from: "#ff00ff", to: "#00ffff" },
  { from: "#ff8000", to: "#0080ff" },
  { from: "#8000ff", to: "#ff0080" },
  { from: "#00ff80", to: "#8000ff" },
  { from: "#ff0080", to: "#80ff00" },
  { from: "#0080ff", to: "#ff8000" },
  { from: "#80ff00", to: "#ff0080" },
  { from: "#ff00ff", to: "#ffff00" },
  { from: "#00ffff", to: "#ff00ff" },
  { from: "#ffff00", to: "#00ffff" },
  { from: "#ff8080", to: "#8080ff" },
  { from: "#80ff80", to: "#ff8080" },
  { from: "#8080ff", to: "#80ff80" },
  { from: "#ff80ff", to: "#ffff80" },
  { from: "#80ffff", to: "#ff80ff" },
  { from: "#ffff80", to: "#80ffff" },
  { from: "#ff4000", to: "#00ff40" },
  { from: "#4000ff", to: "#ff4000" },
];

export default function BackgroundCustomiser() {
  const [activeTab, setActiveTab] = useState("gradient");
  const [gradientColors, setGradientColors] = useState({
    from: "#3F37C9",
    to: "#8C87DF",
  });
  const [solidColor, setSolidColor] = useState("#3F37C9");
  const [settings, setSettings] = useState<BackgroundSettings>({
    padding: 20,
    borderRadius: 8,
    inset: 0,
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleSettingChange = (
    key: keyof BackgroundSettings,
    value: number,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = (key: keyof BackgroundSettings) => {
    const defaults = {
      padding: 20,
      borderRadius: 8,
      inset: 0,
    };
    handleSettingChange(key, defaults[key]);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex w-full flex-col gap-y-7">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          {/* <TabsTrigger value="wallpaper">Wallpaper</TabsTrigger> */}
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>

        <TabsContent value="gradient">
          <div className="flex flex-col gap-y-5">
            <SidebarBlock label="Background Gradient">
              <div className="flex gap-2">
                <div className="flex items-start gap-1">
                  <ColorPicker
                    className="shrink-0"
                    value={gradientColors.from}
                    onChange={(color) =>
                      setGradientColors((prev) => ({ ...prev, from: color }))
                    }
                  />
                  <Input
                    maxLength={7}
                    onChange={(e) => {
                      setGradientColors((prev) => ({
                        ...prev,
                        from: e?.currentTarget?.value,
                      }));
                    }}
                    value={gradientColors.from}
                    className="focus:ring-0 active:ring-0"
                  />
                </div>
                <div className="flex items-start gap-1">
                  <ColorPicker
                    className="shrink-0"
                    value={gradientColors.to}
                    onChange={(color) =>
                      setGradientColors((prev) => ({ ...prev, to: color }))
                    }
                  />
                  <Input
                    maxLength={7}
                    onChange={(e) => {
                      setGradientColors((prev) => ({
                        ...prev,
                        from: e?.currentTarget?.value,
                      }));
                    }}
                    value={gradientColors.from}
                    className=""
                  />
                </div>
              </div>
            </SidebarBlock>

            <SidebarBlock label="Gradient presets">
              <div className="grid grid-cols-5 gap-2">
                {gradientPresets.map((preset, index) => (
                  <button
                    key={index}
                    className="aspect-square w-full rounded-md"
                    style={{
                      background: `linear-gradient(to right, ${preset.from}, ${preset.to})`,
                    }}
                    onClick={() => setGradientColors(preset)}
                  />
                ))}
              </div>
            </SidebarBlock>
          </div>
        </TabsContent>

        <TabsContent value="color">
          <div className="flex flex-col gap-y-5">
            <SidebarBlock label="Background Solid Color">
              <div className="flex items-start gap-1">
                <ColorPicker
                  className="shrink-0"
                  value={gradientColors.to}
                  onChange={(color) =>
                    setGradientColors((prev) => ({ ...prev, to: color }))
                  }
                />
                <Input
                  maxLength={7}
                  onChange={(e) => {
                    setGradientColors((prev) => ({
                      ...prev,
                      from: e?.currentTarget?.value,
                    }));
                  }}
                  value={gradientColors.from}
                  className=""
                />
              </div>
            </SidebarBlock>
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upload Image</h3>
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-md border-2 border-dashed p-8 text-center ${
                isDragActive ? "border-primary" : "border-muted-foreground"
              }`}
            >
              <input {...getInputProps()} />
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded background"
                  className="mx-auto max-h-48"
                />
              ) : (
                <p>Drag and drop an image here, or click to select a file</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="wallpaper" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Wallpaper</h3>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
                <button
                  key={index}
                  className="aspect-square w-full overflow-hidden rounded-md"
                  onClick={() => {
                    /* Handle wallpaper selection */
                  }}
                >
                  <img
                    src={`/placeholder.svg?height=100&width=100&text=${index}`}
                    alt={`Wallpaper ${index}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Padding</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReset("padding")}
            >
              Reset
            </Button>
          </div>
          <Slider
            value={[settings.padding]}
            onValueChange={([value]) => handleSettingChange("padding", value)}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Rounded corners</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReset("borderRadius")}
            >
              Reset
            </Button>
          </div>
          <Slider
            value={[settings.borderRadius]}
            onValueChange={([value]) =>
              handleSettingChange("borderRadius", value)
            }
            max={50}
            step={1}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Inset</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReset("inset")}
            >
              Reset
            </Button>
          </div>
          <Slider
            value={[settings.inset]}
            onValueChange={([value]) => handleSettingChange("inset", value)}
            max={100}
            step={1}
          />
        </div>
      </div>
    </div>
  );
}
