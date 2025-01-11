import { z } from "zod";

type ZoomPointFullSequenceItem = {
  targetX: number;
  targetY: number;
  zoomLevel: number;
};

const TransitionSchema = z.object({
  id: z.string().regex(/^t-/),
  type: z.enum(["fade", "wipe", "dissolve", "slide", "flip"]),
  duration: z.number(),
  properties: z.object({
    direction: z.enum(["left", "right", "up", "down"]).optional(),
    easing: z.enum(["linear", "easeIn", "easeOut", "easeInOut"]),
  }),
  fromSequenceId: z.string().regex(/^s-/),
  toSequenceId: z.string().regex(/^s-/),
  fromSequenceIndex: z.number(),
});

export type TransitionItemType = z.infer<typeof TransitionSchema>;

type BaseSequenceContent = {
  id: string;
  layerId: string;
};

type StandardEditableProps = {
  styles: {
    container: Record<string, any>;
    element: Record<string, any>;
    overlay?: Record<string, any>;
  };
  positionAndDimensions?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};
type AnimationType = Array<{
  type: string;
  from: number;
  to: number;
  duration: number;
  startAt: number;
}>;

export type FullSequenceContentType = BaseSequenceContent & {
  animations?: AnimationType;
} & (
    | {
        type: "text";
        editableProps: StandardEditableProps & {
          text: string;
        };
      }
    | {
        type: "image";
        editableProps: StandardEditableProps & {
          imageUrl: string;
        };
      }
    | {
        type: "video";
        editableProps: StandardEditableProps & {
          videoUrl: string;
          videoStartsFromInFrames: number;
          videoEndsAtInFrames: number;
        };
        totalVideoDurationInFrames: number;
      }
    | {
        type: "audio";
        editableProps: StandardEditableProps & {
          audioUrl: string;
          audioStartsFromInFrames: number;
          audioEndsAtInFrames: number;
        };
      }
    | {
        type: "div";
        editableProps: StandardEditableProps;
      }
    | {
        type: "caption";
        editableProps: StandardEditableProps;
        sequenceItems: Record<string, FullSequenceContentType>;
      }
    | {
        type: "caption-page";
        editableProps: StandardEditableProps & {
          text: string;
          startMs: number;
          tokens: Array<{
            text: string;
            fromMs: number;
            toMs: number;
          }>;
        };
      }
    | {
        type: "zoom";
        editableProps: ZoomPointFullSequenceItem;
      }
  );

export type CaptionSequenceItemType = Extract<
  FullSequenceContentType,
  { type: "caption" }
>;

export type CaptionPageSequenceItemType = Extract<
  FullSequenceContentType,
  { type: "caption-page" }
>;

export type TextSequenceItemType = Extract<
  FullSequenceContentType,
  { type: "text" }
>;

export type ImageSequenceItemType = Extract<
  FullSequenceContentType,
  { type: "image" }
>;

export type AudioSequenceItemType = Extract<
  FullSequenceContentType,
  { type: "audio" }
>;

export type VideoSequenceItemType = Extract<
  FullSequenceContentType,
  { type: "video" }
>;

export type ImageEditablePropsType = Extract<
  FullSequenceContentType,
  { type: "image" }
>["editableProps"];

export type TextEditablePropsType = Extract<
  FullSequenceContentType,
  { type: "text" }
>["editableProps"];

export type VideoEditablePropsType = Extract<
  FullSequenceContentType,
  { type: "video" }
>["editableProps"];

export type AudioEditablePropsType = Extract<
  FullSequenceContentType,
  { type: "audio" }
>["editableProps"];

export type ZoomSequenceItemType = Extract<
  FullSequenceContentType,
  { type: "zoom" }
>;

export type ZoomEditablePropsType = Extract<
  FullSequenceContentType,
  { type: "zoom" }
>["editableProps"];

export type ContentType =
  | "dummy"
  | "text"
  | "image"
  | "video"
  | "audio"
  | "div"
  | "caption"
  | "caption-page"
  | "zoom";

type StandaloneVideoAudioType = {
  sequenceType: "standalone";
  contentType: "video" | "audio";
  linkedCaptionId: string | null;
  linkedCaptionLayerId: string | null;
};

type StandaloneOtherType = {
  sequenceType: "standalone";
  contentType: Exclude<ContentType, "video" | "audio">;
};

type PresetType = {
  sequenceType: "preset";
  presetId: string;
  layers: {
    [layerId: string]: {
      liteItems: LiteSequenceItemType[];
    };
  };
  layerOrder: string[];
};

export type LiteItemCaptionType = {
  sequenceType: "caption";

  liteItems: LiteSequenceItemType[];
};

export type LiteSequenceItemType = {
  id: string;
  sequenceDuration: number;
  effectiveDuration: number;
  startFrame: number;
  offset: number;
  transition?: {
    incoming?: {
      id: string;
      duration: number;
    };
    outgoing?: {
      id: string;
      duration: number;
    };
  };
} & (
  | StandaloneVideoAudioType
  | StandaloneOtherType
  | PresetType
  | LiteItemCaptionType
);

export type LiteSequencePresetItemType = Extract<
  LiteSequenceItemType,
  { sequenceType: "preset" }
>;

export type LiteSequenceCaptionItemType = Extract<
  LiteSequenceItemType,
  { sequenceType: "caption" }
>;

export type LayerType = {
  id: string;
  name: string;
  isVisible: boolean;
  liteItems: LiteSequenceItemType[];
  layerType: "normal" | "caption";
};

export type NestedCompositionProjectType = {
  id: string;
  title: string;
  props: {
    compositionMetaData: {
      width: number;
      height: number;
      fps: number;
      duration: number;
      compositionId: string;
    };
    layers: {
      [layerId: string]: {
        id: string;
        name: string;
        isVisible: boolean;
        liteItems: LiteSequenceItemType[];
        layerType: "normal" | "caption";
      };
    };
    layerOrder: string[]; // Array of layer IDs to maintain order
    sequenceItems: Record<string, StyledSequenceItem>;
    transitions: {
      [key: string]: TransitionItemType;
    };
  };
};

export type StyledSequenceItem =
  | FullSequenceContentType
  | {
      type: "preset";
      layerId: string;
      id: string;
      presetId: string;
      sequenceItems: Record<string, FullSequenceContentType>;
      editableProps: {
        positionAndDimensions?: {
          top: number;
          left: number;
          width: number;
          height: number;
        };
      };
    };

export const LayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  liteItems: z.array(z.any()),
  layerType: z.enum(["normal", "caption"]),
});

// TODO : create a type from this schema and use it in the above NestedCompositionProjectType
export const NestedCompositionPropsSchema = z.object({
  compositionMetaData: z.object({
    width: z.number(),
    height: z.number(),
    fps: z.number(),
    duration: z.number(),
    compositionId: z.string(),
  }),
  layers: z.record(LayerSchema),
  layerOrder: z.array(z.string()),
  sequenceItems: z.record(z.string(), z.any()),
  transitions: z.record(z.string(), TransitionSchema),
});

export type LayerId = string;

export type PresetName = "BRUT_END_SCREEN_PRESET" | "BRUT_FOREGROUND";

export type PresetDetail = Omit<
  LiteSequencePresetItemType,
  "id" | "startFrame" | "offset" | "transition" | "sequenceType"
> & {
  name: PresetName;
  sequenceItems: Record<string, FullSequenceContentType>;
};

export type StoreActions = {
  loadProject: (project: NestedCompositionProjectType) => void;
  updateProject: (updates: Partial<NestedCompositionProjectType>) => void;
  addSequenceItemToLayer: (
    layerId: LayerId,
    item: Extract<LiteSequenceItemType, { sequenceType: "standalone" }>,
    contentProps: FullSequenceContentType,
  ) => void;
  removeSequenceItemFromLayer: (layerId: LayerId, itemId: string) => void;
  updateSequenceItemPositionInLayer: (
    oldLayerId: LayerId,
    newLayerId: LayerId,
    itemId: string,
    updates: Pick<LiteSequenceItemType, "startFrame">,
  ) => void;

  addTransitionToLayer: (
    layerId: LayerId,
    itemId: string,
    position: "incoming" | "outgoing",
  ) => void;

  removeTransitionFromLayer: (layerId: LayerId, transitionId: string) => void;

  updateTransitionInLayer: (
    layerId: LayerId,
    transitionId: string,
    updates: Partial<TransitionItemType>,
  ) => void;

  updateTextEditableProps: (
    layerId: LayerId,
    itemId: string,
    updates: Partial<TextEditablePropsType>,
  ) => void;
  updateImageEditableProps: (
    layerId: LayerId,
    itemId: string,
    updates: Partial<ImageEditablePropsType>,
  ) => void;
  updateAudioEditableProps: (
    layerId: LayerId,
    itemId: string,
    updates: any,
  ) => void;
  updateVideoEditableProps: (
    layerId: LayerId,
    itemId: string,
    updates: any,
  ) => void;
  updateSequenceItemDuration: (
    layerId: LayerId,
    itemId: string,
    frameDelta: number,
    direction: "left" | "right",
  ) => void;
  addPresetToLayer: (
    layerId: LayerId,
    itemPosition: {
      startFrame: number;
      offset: number;
    },
    newPreset: PresetDetail,
  ) => void;
  addLayer: (
    data:
      | {
          position: "AT_TOP" | "AT_BOTTOM";
        }
      | {
          position: "ABOVE_CURRENT" | "BELOW_CURRENT";
          currentLayerId: LayerId;
        },
  ) => void;
  removeLayer: (layerId: LayerId) => void;
  reorderLayers: (newOrder: string[]) => void;
  updateLayerMetadata: (
    layerId: LayerId,
    updates: Partial<Pick<LayerType, "name" | "isVisible">>,
  ) => void;

  splitSequenceItem: (
    layerId: LayerId,
    itemId: string,
    splitAtInFrames: number,
  ) => void;

  updatePositionAndDimensions: (
    layerId: LayerId,
    itemId: string,
    updates: Partial<StandardEditableProps["positionAndDimensions"]>,
  ) => void;

  linkCaptionToMedia: (
    layerId: string,
    sequenceId: string,
    captionLayerPayload?: {
      captions: []; // Empty array for now, can be expanded later
    },
  ) => void;

  updateCaptionText: (
    layerId: string,
    captionSequenceId: string,
    captionPageSequenceId: string,
    newText: string,
  ) => void;

  addFreshCaptionsToMedia: (
    linkedMediaLayerId: string,
    mediaId: string,
    captionLayerId: string,
    data: {
      liteItems: LiteSequenceItemType[];
      sequenceItems: Record<string, FullSequenceContentType>;
    },
  ) => void;
  addTextBehindImageOps: (
    layerId: string,
    imageId: string,
    removedBackgroundLocalImageUrl: string,
  ) => void;
};

export type NestedCompositionPropsType = NestedCompositionProjectType["props"];

export type StoreType = NestedCompositionProjectType & StoreActions;
