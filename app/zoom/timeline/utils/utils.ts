/**
 * Smoothly scrolls to a specified position within a container.
 * @param containerId - The ID of the container to scroll.
 * @param options - Scroll options including top, left, and behavior.
 */
export const scrollToPosition = (
  containerId: string,
  options: ScrollToOptions = { top: 0, behavior: "smooth" },
): void => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with id "${containerId}" not found.`);
    return;
  }

  container.scrollTo(options);
};

export const scrollToTop = (containerId: string): void =>
  scrollToPosition(containerId, { top: 0, behavior: "smooth" });

export const scrollToBottom = (containerId: string): void => {
  const container = document.getElementById(containerId);
  if (container) {
    scrollToPosition(containerId, {
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }
};
