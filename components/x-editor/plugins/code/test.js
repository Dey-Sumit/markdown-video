const simulateTyping = (text, delay) => {
  const element = document.getElementById("prompt-input");
  let i = 0;

  const typeNextChar = () => {
    if (i < text.length) {
      element.value += text[i];
      element.dispatchEvent(
        new Event("input", {
          bubbles: true,
        }),
      );
      i++;
      setTimeout(typeNextChar, delay);
    }
  };

  setTimeout(typeNextChar, 3000);
};
simulateTyping(
  "A subtle, enigmatic facial portrait featuring a single male face, softly illuminated with gentle, warm lighting that accentuates the subject's delicate features, with a neutral, creamy background that allows the viewer's focus to solely rest on the face, the skin a smooth, porcelain-like complexion with a subtle sheen, the facial structure a gentle mix of soft curves and subtle angles, the eyes cast downward, lids partially closed, lips pressed together in a introspective expression, the overall mood quiet, contemplative, and mysterious.",
  100,
);
