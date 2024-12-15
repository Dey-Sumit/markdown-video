"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { SidebarBlock } from "./project-sidebar";
import { Button } from "./ui/button";
import { ColorPicker } from "./ui/color-picker";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import useCompositionStore from "@/store/composition-store";

interface BackgroundSettings {
  padding: number;
  borderRadius: number;
  inset: number;
}

const gradientPresets = [
  { from: "#FF6F61", to: "#6B5B95" }, // Warm coral to deep violet
  { from: "#88B04B", to: "#F7CAC9" }, // Olive green to soft pink
  { from: "#92A8D1", to: "#034F84" }, // Cool blue to deep navy
  { from: "#F7786B", to: "#DEDDDD" }, // Vibrant red to light gray
  { from: "#955251", to: "#D65076" }, // Earthy brown to magenta
  { from: "#45B8AC", to: "#EFC050" }, // Teal green to mustard yellow
  { from: "#5B9BD5", to: "#ED7D31" }, // Bright blue to orange
  { from: "#B565A7", to: "#FFD662" }, // Royal purple to sunflower yellow
  { from: "#6C4F3D", to: "#C48F65" }, // Chocolate brown to sandy beige
  { from: "#DD4124", to: "#009473" }, // Fiery red to emerald green
  { from: "#55A8D4", to: "#A0DAA9" }, // Sky blue to mint green
  { from: "#FDDB27", to: "#F77F00" }, // Golden yellow to bright orange
  { from: "#D72638", to: "#3B3355" }, // Crimson red to dark plum
  { from: "#11999E", to: "#30E3CA" }, // Deep teal to aquamarine
  { from: "#EE7752", to: "#E73C7E" }, // Sunset orange to magenta
  { from: "#23A6D5", to: "#23D5AB" }, // Bright blue to sea green
  { from: "#C6FFDD", to: "#FBD786" }, // Mint to soft yellow
  { from: "#FDBB2D", to: "#22C1C3" }, // Honey gold to turquoise
  { from: "#F953C6", to: "#B91D73" }, // Vibrant pink to dark rose
  { from: "#36D1DC", to: "#5B86E5" }, // Cool aqua to deep blue
];

export default function BackgroundCustomiser() {
  const styles = useCompositionStore((state) => state.styles);
  const setStyles = useCompositionStore((state) => state.setStyles);
  const {
    background: {
      color,
      gradient: { colors },
      image,
      activeType,
    },
  } = styles.backgroundContainer;
  const [activeTab, setActiveTab] = useState("gradient");
  const [gradientFrom, gradientTo] = colors;
  // const [gradientColors, setGradientColors] = useState({
  //   from: gradient.colors[0],
  //   to: gradient.colors[1],
  // });
  const [solidColor, setSolidColor] = useState("#3F37C9");
  const [settings, setSettings] = useState<BackgroundSettings>({
    padding: styles.sceneContainer.padding || 0,
    borderRadius: styles.sceneContainer.borderRadius || 0,
    inset: 0,
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleSettingChange = (
    key: keyof BackgroundSettings,
    value: number,
  ) => {
    setStyles({
      ...styles,
      sceneContainer: {
        ...styles.sceneContainer,
        [key]: value,
      },
    });

    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyGradient = (gradientFrom: string, gradientTo: string) => {
    setStyles({
      ...styles,
      backgroundContainer: {
        ...styles.backgroundContainer,
        background: {
          ...styles.backgroundContainer.background,
          gradient: {
            colors: [gradientFrom, gradientTo],
            angle: 0,
          },
        },
      },
    });
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
                    value={gradientFrom}
                    onChange={(color) => {
                      console.log(color);
                      handleApplyGradient(color, gradientTo);
                      // setGradientColors((prev) => ({ ...prev, from: color }))
                    }}
                  />
                  <Input
                    maxLength={7}
                    onChange={(e) => {
                      handleApplyGradient(e?.currentTarget?.value, gradientTo);
                      // setGradientColors((prev) => ({ ...prev, from: e?.currentTarget
                    }}
                    value={gradientFrom}
                    className="focus:ring-0 active:ring-0"
                  />
                </div>
                <div className="flex items-start gap-1">
                  <ColorPicker
                    className="shrink-0"
                    value={gradientTo}
                    onChange={(color) => {
                      handleApplyGradient(gradientFrom, color);
                      // setGradientColors((prev) => ({ ...prev, to: color }))
                    }}
                  />
                  <Input
                    maxLength={7}
                    onChange={(e) => {
                      handleApplyGradient(
                        gradientFrom,
                        e?.currentTarget?.value,
                      );
                      // setGradientColors((prev) => ({ ...prev, to: e?.currentTarget?.value }))
                    }}
                    value={gradientTo}
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
                    onClick={() => handleApplyGradient(preset.from, preset.to)}
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
                {/* <ColorPicker
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
                /> */}
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
