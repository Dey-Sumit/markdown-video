import React, { useCallback } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { top25GoogleFonts } from "./top-250-fonts";

export const FontPicker = ({
  onFontChange,
  currentFont,
}: {
  onFontChange: (font: string) => void;
  currentFont: string;
}) => {
  const onValueChange = useCallback(
    async (value: string) => {
      const selectedFont = top25GoogleFonts.find((f) => f.family === value);
      if (!selectedFont) return;
      console.log("Selected Font", selectedFont);

      const loaded = await selectedFont.load();
console.log("Selected Font ", selectedFont, " Loaded ", loaded);

      const { fontFamily, ...otherInfo } = loaded.loadFont();

      const info = loaded.getInfo();
      const styles = Object.keys(info.fonts);
      console.log("Font", info.fontFamily, " Styles", styles);

      for (const style of styles) {
        const weightObject = info.fonts[style as keyof typeof info.fonts];
        const weights = Object.keys(weightObject);
        console.log("- Style", style, "supports weights", weights);

        for (const weight of weights) {
          const scripts = Object.keys(weightObject[weight]);
          console.log("-- Weight", weight, "supports scripts", scripts);
        }
      }

      onFontChange(fontFamily);
    },
    [top25GoogleFonts, onFontChange],
  );

  return (
    <Select onValueChange={onValueChange} value={currentFont}>
      <SelectTrigger>
        <SelectValue placeholder="Select a font" />
      </SelectTrigger>
      <SelectContent>
        {top25GoogleFonts.map((font) => (
          <SelectItem key={font.family} value={font.family}>
            {font.family}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FontPicker;
