import { createSelector } from "reselect";
import type {
  StoreType,
  LayerId,
  LayerType,
  TransitionItemType,
  LiteSequenceItemType,
} from "../../timeline.types";

const selectLayers = (state: StoreType) => state.props.layers;
const selectTransitions = (state: StoreType) => state.props.transitions;

export const selectLayerById = createSelector(
  [selectLayers, (_, layerId: LayerId) => layerId],
  (layers, layerId): LayerType | undefined => layers[layerId],
);

export const selectTransitionsForLayer = createSelector(
  [selectTransitions, (_, layerId: LayerId) => layerId],
  (transitions, layerId): Record<string, TransitionItemType> =>
    //@ts-ignore : TODO : FIX THIS
    transitions[layerId],
);

/* export const selectItemsForLayer = createSelector(
  [selectLayerById, selectSequenceItemsForLayer, selectTransitionsForLayer],
  (
    layer,
    sequenceItems,
    transitions,
  ): (SequenceItemType | TransitionItemType)[] => {
    if (!layer) return [];
    return layer.liteItems
      .map(({ id }) =>
        id.startsWith("s-") ? sequenceItems[id] : transitions[id],
      )
      .filter(
        (item): item is SequenceItemType | TransitionItemType =>
          item !== undefined,
      );
  },
);
 */
/* export const selectLayerItemIds = createSelector(
  [selectLayerById],
  (layer): string[] => layer?.liteItems?.map((item) => item.id) || [],
);

export const selectSequenceItemsByIds = createSelector(
  [selectSequenceItemsForLayer, selectLayerItemIds],
  (sequenceItems, itemIds): SequenceItemType[] =>
    itemIds
      .filter((id) => id.startsWith("s-"))
      .map((id) => sequenceItems[id])
      .filter((item): item is SequenceItemType => item !== undefined),
);

export const selectTransitionItemsByIds = createSelector(
  [selectTransitionsForLayer, selectLayerItemIds],
  (transitions, itemIds): TransitionItemType[] =>
    itemIds
      .filter((id) => id.startsWith("t-"))
      .map((id) => transitions[id])
      .filter((item): item is TransitionItemType => item !== undefined),
);
 */
/* export const selectAllItemsForLayer = createSelector(
  [selectSequenceItemsByIds, selectTransitionItemsByIds],
  (
    sequenceItems,
    transitionItems,
  ): (SequenceItemType | TransitionItemType)[] => [
    ...sequenceItems,
    ...transitionItems,
  ],
);
 */
// New selector for liteItems
export const selectLiteItems = createSelector(
  [selectLayerById],
  (layer): LiteSequenceItemType[] => layer?.liteItems || [],
);
