import type {
  FullSequenceContentType,
  LayerId,
  LiteSequenceItemType,
  NestedCompositionProjectType,
} from "~/types/timeline.types";

export const LAYERS_IN_ORDER: {
  label: string;
  id: LayerId;
}[] = [
  // {
  //   label: "Captions",
  //   id: "layerCaptions",
  // },
  {
    label: "Foreground Layer",
    id: "layerForeground",
  },
  {
    label: "Middle Layer",
    id: "layerMiddle",
  },
  {
    label: "Background Layer",
    id: "layerBackground",
  },
  // {
  //   label: "Background Music",
  //   id: "layerBgAudio",
  // },
  // {
  //   label: "Sound effects",
  //   id: "layerSoundEffects",
  // },
] as const;

// Utility function to calculate offset between two items
export function calculateOffset(
  prev: LiteSequenceItemType | null,
  current: LiteSequenceItemType,
): number {
  if (!prev) return current.startFrame;
  return current.startFrame - (prev.startFrame + prev.effectiveDuration);
}

/**
 * Calculates the old and new indices for an item in an array based on an updated start frame.
 *
 * @param items - Array of sequence items
 * @param itemId - ID of the item to update
 * @param updatedStartFrame - New start frame for the item
 * @returns Object containing oldIndex and futureNewIndex
 */
export const calculateItemIndices = (
  items: Array<{
    id: string;
    startFrame: number;
    effectiveDuration: number;
  }>,
  itemId: string,
  updatedStartFrame: number,
): { oldIndex: number; futureNewIndex: number } => {
  const oldIndex = items.findIndex((item) => item.id === itemId);

  if (oldIndex === -1) {
    throw new Error("Item not found");
  }

  const itemToUpdate = items[oldIndex];
  const updatedEndFrame = updatedStartFrame + itemToUpdate.effectiveDuration;

  let futureNewIndex = oldIndex;

  // Handle cases where the item is moved earlier in the timeline
  for (let i = 0; i < oldIndex; i++) {
    const currentItem = items[i];
    const currentEndFrame =
      currentItem.startFrame + currentItem.effectiveDuration;

    if (updatedStartFrame < currentEndFrame) {
      futureNewIndex = i;
      break;
    }
  }

  // Handle cases where the item is moved later in the timeline
  for (let i = oldIndex + 1; i < items.length; i++) {
    const currentItem = items[i];

    if (updatedEndFrame <= currentItem.startFrame) {
      break;
    }
    futureNewIndex = i;
  }

  return { oldIndex, futureNewIndex };
};

/* export const calculateLayerDuration = (items: SequenceItem[]): number => {
  if (items.length === 0) return 0;

  return Math.max(...items.map((item) => item.from + item.durationInFrames));
}; */

/* export const calculateAdjustedTimelineDuration = (
  project: DynamicCompositionType,
): number => {
  const layerDurations = Object.entries(project.layers)
    .filter(([layerId]) => layerId !== "caption-layer") // Ignore caption layer
    .map(([_, layer]) => calculateLayerDuration(layer.sequenceItems));

  const maxDuration = Math.max(0, ...layerDurations);

  return Math.min(maxDuration, TIMELINE.MAX_TIMELINE_DURATION);
};
 */
// Fake API call function to simulate loading a project
/* export const fetchProject = async (
  projectId: string,
): Promise<DynamicCompositionType> => {
  // Simulating API call delay
  // await new Promise((resolve) => setTimeout(resolve, 500));

  // Return fake project data based on projectId
  let projectData: DynamicCompositionType;
  if (projectId === "project-1") {
    projectData = DUMMY_PROJECT;
  } else {
    throw new Error("Project not found");
  }

  return projectData;
}; */

// Helper function to create a new project with updated sequence items for a specific layer
/* export const getProjectWithUpdatedLayers = (
  currentProject: DynamicCompositionType,
  layerId: string,
  updatedSequenceItems: SequenceItem[],
): DynamicCompositionType => {
  return {
    ...currentProject,
    layers: {
      ...currentProject.layers,
      [layerId]: {
        ...currentProject.layers[layerId],
        sequenceItems: updatedSequenceItems,
      },
    },
  };
};
 */

// TODO : can we use binary search here?
// Helper function to find nearest sequences
export function findNearestSequences(
  liteItems: LiteSequenceItemType[],
  startFrame: number,
): {
  prevItem: LiteSequenceItemType | null;
  nextItem: LiteSequenceItemType | null;
} {
  let prevItem: LiteSequenceItemType | null = null;
  let nextItem: LiteSequenceItemType | null = null;

  for (const item of liteItems) {
    if (item.startFrame <= startFrame) {
      if (!prevItem || item.startFrame > prevItem.startFrame) {
        prevItem = item;
      }
    } else {
      nextItem = item;
      break;
    }
  }

  return { prevItem, nextItem };
}

export function binarySearch<T>(
  arr: T[],
  searchValue: number,
  getCompareValue: (item: T) => number,
): number {
  let low = 0;
  let high = arr.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (getCompareValue(arr[mid]) > searchValue) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  return low;
}

export function canAddTransition(
  layerId: LayerId,
  itemId: string,
  position: "incoming" | "outgoing",
  state: NestedCompositionProjectType,
) {
  // Implementation to check if a transition can be added
  // This would check for the existence of adjacent items and their offsets
}

interface PlaceholderDuration {
  duration: number;
  offsetFrames: number;
  adjustedStartFrame: number;
}

export function calculatePlaceholderDuration(
  liteItems: LiteSequenceItemType[],
  startFrame: number,
  duration: number,
  MAX_PLACEHOLDER_DURATION_IN_FRAMES: number,
): PlaceholderDuration {
  const { prevItem, nextItem } = findNearestSequences(liteItems, startFrame);

  // Calculate the earliest possible start frame
  const earliestStartFrame = prevItem
    ? prevItem.startFrame + prevItem.effectiveDuration
    : 0;

  // Adjust the start frame if it's before the earliest possible start
  const adjustedStartFrame = Math.max(startFrame, earliestStartFrame);

  // Calculate the latest possible end frame
  const latestEndFrame = nextItem ? nextItem.startFrame : duration;

  // Calculate available duration
  const availableDuration = latestEndFrame - adjustedStartFrame;

  // Cap the duration at MAX_PLACEHOLDER_DURATION if needed
  const finalDuration = Math.min(
    availableDuration,
    MAX_PLACEHOLDER_DURATION_IN_FRAMES,
  );

  return {
    duration: finalDuration,
    offsetFrames: adjustedStartFrame - earliestStartFrame,
    adjustedStartFrame,
  };
}

// Default props for different content types
export const DEFAULT_CONTENT_PROPS: Record<
  string,
  Omit<FullSequenceContentType, "id" | "layerId">
> = {
  text: {
    type: "text",
    editableProps: {
      styles: {
        container: {
          // backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
        },
        element: {},
      },
      text: "<h1>Your text</h1>",
    },
  },
  image: {
    type: "image",
    editableProps: {
      styles: {
        container: {
          justifyContent: "center",
          alignItems: "center",
        },
        element: {
          "object-fit": "contain",
          width: "100%",
          height: "100%",
        },
      },
      imageUrl:
        "https://images.pexels.com/photos/28689135/pexels-photo-28689135.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    },
  },
  video: {
    type: "video",
    editableProps: {
      styles: {
        container: {
          justifyContent: "center",
          alignItems: "center",
        },
        element: {
          objectFit: "cover",
          width: "100%",
          height: "100%",
        },
      },
      videoUrl:
        "https://videos.pexels.com/video-files/4065220/4065220-sd_506_960_25fps.mp4",
    },
  },
  // audio: {
  //   type: "audio",
  //   editableProps: {
  //     styles: {
  //       container: {
  //         backgroundColor: "#f0f0f0",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       },
  //       element: {
  //         width: "100%",
  //       },
  //     },
  //     audioUrl: "https://example.com/placeholder-audio.mp3",
  //   },
  // },
};

// Function to generate a random background color
export const getRandomBackgroundColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;
