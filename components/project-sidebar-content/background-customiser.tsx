"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useState } from "react";
import { SidebarBlock } from "../project-sidebar";
import { Button } from "../ui/button";
import { ColorPicker } from "../ui/color-picker";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { SidebarContent, SidebarHeader, SidebarInput } from "../ui/sidebar";
import { useProjectStore } from "@/store/project-store";
import FontPicker from "./font-picker";

interface BackgroundSettings {
  padding: number;
  borderRadius: number;
  inset: number;
}

const gradientPresets = [
  { from: "#232526", to: "#414345" }, // Night Fade
  { from: "#ec008c", to: "#fc6767" }, // DIMIGO
  { from: "#cc2b5e", to: "#753a88" }, // Purple Love
  { from: "#e65c00", to: "#F9D423" }, // Blooker20
  { from: "#ff6e7f", to: "#bfe9ff" }, // Noon to Dusk
  { from: "#e52d27", to: "#b31217" }, // YouTube
  { from: "#603813", to: "#b29f94" }, // Cool Brown
  { from: "#02AAB0", to: "#00CDAC" }, // Green Beach
  { from: "#DA22FF", to: "#9733EE" }, // Intuitive Purple
  { from: "#348F50", to: "#56B4D3" }, // Emerald Water
  { from: "#FF512F", to: "#DD2476" }, // Bloody Mary
  { from: "#AA076B", to: "#61045F" }, // Aubergine
  { from: "#1A2980", to: "#26D0CE" }, // Aqua Marine
  { from: "#FF512F", to: "#F09819" }, // Sunrise
  { from: "#1D2B64", to: "#F8CDDA" }, // Purple Paradise
  { from: "#1FA2FF", to: "#12D8FA" }, // Stripe
  { from: "#4CB8C4", to: "#3CD3AD" }, // Sea Weed
  { from: "#DD5E89", to: "#F7BB97" }, // Pinky
  { from: "#EB3349", to: "#F45C43" }, // Cherry
  { from: "#1D976C", to: "#93F9B9" }, // Mojito
  { from: "#FFB008", to: "#FFC837" }, // Juicy Orange
  { from: "#16222A", to: "#3A6073" }, // Mirage
  { from: "#1F1C2C", to: "#928DAB" }, // Steel Gray
  { from: "#614385", to: "#516395" }, // Kashmir
  { from: "#4776E6", to: "#8E54E9" }, // Electric Violet
  { from: "#085078", to: "#85D8CE" }, // Venice Blue
  { from: "#2BC0E4", to: "#EAECC6" }, // Bora Bora
  { from: "#134E5E", to: "#71B280" }, // Moss
];
export default function BackgroundCustomize() {
  const {
    currentProject: { styles },
    updateStyles,
  } = useProjectStore();

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

  const [solidColor, setSolidColor] = useState("#3F37C9");

  // const [settings, setSettings] = useState<BackgroundSettings>({
  //   padding: styles.sceneContainer.padding || 0,
  //   borderRadius: styles.sceneContainer.borderRadius || 0,
  //   inset: 0,
  // });

  const handleSettingChange = (
    key: keyof BackgroundSettings,
    value: number,
  ) => {
    console.log("Setting change", key, value, {
      ...styles,
      sceneContainer: {
        ...styles.sceneContainer,
        [key]: value,
      },
    });

    updateStyles({
      ...styles,
      sceneContainer: {
        ...styles.sceneContainer,
        [key]: value,
      },
    });
  };

  const handleApplyGradient = (gradientFrom: string, gradientTo: string) => {
    updateStyles({
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

  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-3">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">
            Background
          </div>
        </div>
        {/* <SidebarInput placeholder="Type to search..." /> */}
      </SidebarHeader>

      <SidebarContent className="w-[calc(var(--sidebar-width)_-var(--sidebar-width-icon))] p-3">
        <div className="flex w-full flex-col gap-y-7">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              {/* <TabsTrigger value="wallpaper">Wallpaper</TabsTrigger> */}
              <TabsTrigger value="gradient">Gradient</TabsTrigger>
              <TabsTrigger value="color">Color</TabsTrigger>
              {/* <TabsTrigger value="image">Image</TabsTrigger> */}
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
                          handleApplyGradient(color, gradientTo);
                        }}
                      />
                      <Input
                        maxLength={7}
                        onChange={(e) => {
                          handleApplyGradient(
                            e?.currentTarget?.value,
                            gradientTo,
                          );
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
                        }}
                      />
                      <Input
                        maxLength={7}
                        onChange={(e) => {
                          handleApplyGradient(
                            gradientFrom,
                            e?.currentTarget?.value,
                          );
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
                        className="aspect-square w-full rounded-md transition-transform duration-300 hover:scale-105"
                        style={{
                          background: `linear-gradient(to right, ${preset.from}, ${preset.to})`,
                        }}
                        onClick={() =>
                          handleApplyGradient(preset.from, preset.to)
                        }
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
                {/* <h3 className="text-lg font-medium">Upload Image</h3>
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
            </div> */}
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
                value={[styles.sceneContainer.padding]}
                onValueChange={([value]) =>
                  handleSettingChange("padding", value)
                }
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
                value={[styles.sceneContainer.borderRadius]}
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
                value={[styles.sceneContainer.inset]}
                onValueChange={([value]) => handleSettingChange("inset", value)}
                max={100}
                step={1}
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Fonts</Label>
                <Button variant="outline" size="sm">
                  Reset Font
                </Button>
              </div>
              <FontPicker
                currentFont={styles.backgroundContainer.fontFamily}
                onFontChange={(fontFamily) => {
                  updateStyles({
                    ...styles,
                    backgroundContainer: {
                      ...styles.backgroundContainer,
                      fontFamily,
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>
      </SidebarContent>
    </>
  );
}
