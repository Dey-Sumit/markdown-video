import {
  createTikTokStyleCaptions,
  type Caption,
  type TikTokToken,
} from "@remotion/captions";
import type {
  FullSequenceContentType,
  LiteSequenceItemType,
} from "~/types/timeline.types";
import { genId } from "./misc.utils";

// utils/caption.utils.ts
type ProcessCaptionsParams = {
  captions: Caption[];
  fps: number;
  layerId: string;
};

type ProcessCaptionsResult = {
  liteItems: LiteSequenceItemType[];
  sequenceItems: Record<string, FullSequenceContentType>;
};

const msToFrames = (ms: number, fps: number): number => {
  return Math.round((ms / 1000) * fps);
};

export const processCaptionsLite = ({
  captions,
  fps,
  layerId,
}: ProcessCaptionsParams): ProcessCaptionsResult => {
  const liteItems: LiteSequenceItemType[] = [];
  const sequenceItems: Record<string, FullSequenceContentType> = {};

  captions.forEach((caption, index) => {
    const id = `s-caption-${genId("s", "text")}`;
    const startFrame = msToFrames(caption.startMs, fps);
    const endFrame = msToFrames(caption.endMs, fps);
    const duration = endFrame - startFrame;

    // Calculate offset from previous item if exists
    const prevItem = liteItems[index - 1];
    const offset = prevItem
      ? startFrame - (prevItem.startFrame + prevItem.effectiveDuration)
      : startFrame;

    const liteItem: LiteSequenceItemType = {
      id,
      sequenceType: "standalone",
      contentType: "text",
      sequenceDuration: duration,
      effectiveDuration: duration,
      startFrame,
      offset,
    };

    liteItems.push(liteItem);
    sequenceItems[id] = {
      id,
      type: "text",
      layerId,
      editableProps: {
        text: caption.text,
        styles: {
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
          element: {
            color: "white",
            fontSize: "64px",
            // Add more default styles as needed
          },
        },
        positionAndDimensions: {
          top: 0,
          left: 0,
          width: 720, // These should probably come from params
          height: 1080,
        },
      },
    };
  });

  return { liteItems, sequenceItems };
};
export const processCaptions = ({
  captions,
  fps,
  layerId,
}: ProcessCaptionsParams): ProcessCaptionsResult => {
  const liteItems: LiteSequenceItemType[] = [];
  const sequenceItems: Record<string, FullSequenceContentType> = {};

  // First create TikTok style pages
  const { pages } = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: 200,
  });

  // Now process pages instead of raw captions
  pages.forEach((page, index) => {
    const id = `s-caption-${genId("s", "text")}`;
    const startFrame = msToFrames(page.startMs, fps);

    // Get end time from last token
    const lastToken = page.tokens[page.tokens.length - 1];
    const endFrame = msToFrames(lastToken.toMs, fps);
    const duration = endFrame - startFrame;

    // Rest of the liteItem creation remains similar...
    const prevItem = liteItems[index - 1];
    const offset = prevItem
      ? startFrame - (prevItem.startFrame + prevItem.effectiveDuration)
      : startFrame;

    const liteItem: LiteSequenceItemType = {
      id,
      sequenceType: "standalone",
      contentType: "caption-page",
      sequenceDuration: duration,
      effectiveDuration: duration,
      startFrame,
      offset,
    };

    liteItems.push(liteItem);

    // Add token info to sequenceItems
    sequenceItems[id] = {
      id,
      type: "caption-page",
      layerId,
      editableProps: {
        text: page.text,
        // Store timing info for highlighting
        startMs: page.startMs,
        tokens: page.tokens,
        styles: {
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
          element: {
            color: "white",
            fontSize: "64px",
          },
        },
        positionAndDimensions: {
          top: 0,
          left: 0,
          width: 720,
          height: 1080,
        },
      },
    };
  });

  return { liteItems, sequenceItems };
};

type EditableProps = {
  text: string;
  startMs: number;
  tokens: TikTokToken[];
};

const getWordBoundaries = (
  text: string,
): { start: number; end: number; hasSpacePrefix: boolean }[] => {
  const words: { start: number; end: number; hasSpacePrefix: boolean }[] = [];
  let inWord = false;
  let start = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === " ") {
      if (inWord) {
        words.push({ start, end: i, hasSpacePrefix: text[start - 1] === " " });
        inWord = false;
      }
    } else {
      if (!inWord) {
        start = i;
        inWord = true;
      }
    }
  }

  if (inWord) {
    words.push({
      start,
      end: text.length,
      hasSpacePrefix: text[start - 1] === " ",
    });
  }

  return words;
};

export const updateTokens = (
  oldProps: EditableProps,
  newText: string,
): TikTokToken[] => {
  const oldTokens = oldProps.tokens;
  const newTokens: TikTokToken[] = [];

  // Get word boundaries for the new text
  const words = getWordBoundaries(newText);

  words.forEach((word, index) => {
    const oldToken = oldTokens[index];
    if (!oldToken) {
      // Handle new words (should not happen in your case)
      const lastToken = newTokens[newTokens.length - 1];
      const averageDuration = 200; // default duration

      newTokens.push({
        text: word.hasSpacePrefix
          ? " " + newText.slice(word.start, word.end)
          : newText.slice(word.start, word.end),
        fromMs: lastToken ? lastToken.toMs : oldProps.startMs,
        toMs: lastToken
          ? lastToken.toMs + averageDuration
          : oldProps.startMs + averageDuration,
      });
    } else {
      // Preserve timing but update text
      const wordText = newText.slice(word.start, word.end);
      const hasSpacePrefix =
        oldToken.text.startsWith(" ") || word.hasSpacePrefix;

      newTokens.push({
        text: hasSpacePrefix ? " " + wordText : wordText,
        fromMs: oldToken.fromMs,
        toMs: oldToken.toMs,
      });
    }
  });

  return newTokens;
};
