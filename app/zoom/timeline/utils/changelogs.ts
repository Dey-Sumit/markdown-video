import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

const changelogsDirectory = path.join(process.cwd(), "changelogs");

export function getSortedChangelogsData() {
  const fileNames = fs.readdirSync(changelogsDirectory);
  const allChangelogsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(changelogsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as {
        date: string;
        title: string;
        version: string;
        description: string;
        changes: string[];
      }),
    };
  });

  return allChangelogsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// ... rest of the file remains the same
export async function getChangelogData(id: string) {
  const fullPath = path.join(changelogsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...(matterResult.data as {
      date: string;
      title: string;
      version: string;
      description: string;
      changes: string[];
    }),
  };
}
