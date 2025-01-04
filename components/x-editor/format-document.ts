export function formatDocument(content: string): string {
  const lines = content.split("\n");
  const formattedOutput: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];

    if (currentLine.includes("!section")) {
      let sectionContent = currentLine;
      while (i + 1 < lines.length && !lines[i + 1].startsWith("##")) {
        i++;
        sectionContent += lines[i];
      }

      const [basePart, itemsPart] = sectionContent.split("--items=");
      if (itemsPart) {
        // Keep base part and items= in same line
        formattedOutput.push(`${basePart.trim()} --items=(`);

        const itemsContent = itemsPart.replace(/^\(|\)$/g, "").trim();
        const items = itemsContent.split(",").map((item) => item.trim());

        items.forEach((item, idx) => {
          formattedOutput.push(
            `    ${item}${idx < items.length - 1 ? "," : ""}`,
          );
        });
        formattedOutput.push("  )");
      } else {
        formattedOutput.push(sectionContent);
      }
    } else if (!currentLine.includes("--items=")) {
      formattedOutput.push(currentLine);
    }
  }

  return formattedOutput.join("\n");
}
