import {
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { Audio } from "remotion";

export function addSound<T extends Record<string, unknown>>(
  transition: TransitionPresentation<T>,
  src: string,
): TransitionPresentation<T> {
  const { component: Component, ...other } = transition;

  const C = Component as React.FC<TransitionPresentationComponentProps<T>>;

  const NewComponent: React.FC<TransitionPresentationComponentProps<T>> = (
    p,
  ) => {
    return (
      <>
        {p.presentationDirection === "entering" ? <Audio src={src} /> : null}
        <C {...p} />
      </>
    );
  };

  return {
    component: NewComponent,
    ...other,
  };
}
