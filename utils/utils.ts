import parse from "color-parse";
import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * Converts a color string to an {r, g, b, alpha} object.
 * If the color is invalid, returns a default rgba object.
 *
 * @param {string} color - The color string to parse.
 * @param {Object} [defaultColor={ r: 0, g: 0, b: 0, alpha: 1 }] - The default color object to return if parsing fails.
 * @returns {Object} An object with properties {r, g, b, alpha}.
 */
export function parseColorToRGBA(
  color: string,
  defaultColor = { r: 255, g: 0, b: 0, alpha: 1 },
) {
  const parsed = parse(color);

  if (!parsed.space) {
    // Return the default color if parsing fails
    return defaultColor;
  }

  let r, g, b, alpha;

  if (parsed.space === "rgb") {
    [r, g, b] = parsed.values;
    alpha = parsed.alpha;
  }

  return { r, g, b, alpha };
}

export function getMediaType(url: string): string | null {
  const imageExtensions = ["jpg", "jpeg", "png"];
  const gifExtensions = ["gif"];
  const videoExtensions = ["mp4", "webm", "ogg"];

  // Extract the file extension from the URL
  const extension = url.split(".").pop()?.toLowerCase();

  if (extension) {
    if (imageExtensions.includes(extension)) {
      return "image";
    } else if (gifExtensions.includes(extension)) {
      return "gif";
    } else if (videoExtensions.includes(extension)) {
      return "video";
    }
  }

  return null; // Return null if it's not a recognized media type
}

export const createGradient = (colors: string[], angle: number) => {
  return `linear-gradient(${angle}deg, ${colors.join(", ")})`;
};
