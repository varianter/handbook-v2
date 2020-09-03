import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { getHeadlines } from "@variant/md-section";

export type HandbookData = {
  data: { [key: string]: any };
  name: string;
  title: string;
};

export type HandbookProps = {
  handbooks: HandbookData[];
  content?: string;
  subHeadings: string[];
};

export const getHandbookFiles = async () => {
  const files = await fs.readdir(path.join(process.cwd(), "/content"));
  return files.filter((a) => a.endsWith(".md"));
};

export const getMatterFile = async (
  fileName: string
): Promise<matter.GrayMatterFile<Buffer>> => {
  const file = await fs.readFile(path.join(process.cwd(), "content", fileName));
  return matter(file);
};

const getHandbookData = async (): Promise<HandbookData[]> => {
  const files = await getHandbookFiles();
  const handbooks = await Promise.all(
    files.map(async (fileName) => {
      const matterFile = await getMatterFile(fileName);

      const headlines = getHeadlines(matterFile.content, {
        minLevel: 1,
        maxLevel: 1,
      }) as { level: number; content: string }[];

      const title = headlines.length > 0 ? headlines[0].content : "";
      return {
        data: matterFile.data,
        name: fileName.replace(".md", ""),
        title,
      };
    })
  );
  return handbooks;
};

export const getHandbookProps = async (
  handbook = "handbook"
): Promise<HandbookProps> => {
  const handbooks = await getHandbookData();

  const { content } = await getMatterFile(`${handbook}.md`);

  const subHeadings = getHeadlines(content, {
    minLevel: 2,
    maxLevel: 2,
  }) as { level: number; content: string }[];

  return {
    handbooks,
    content,
    subHeadings: subHeadings.map((sh) => sh.content),
  };
};
