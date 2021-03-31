import { NextApiRequest, NextApiResponse } from "next";
import { getHandbookData, HandbookData } from "src/utils";

async function doSearch(searchQuery: string[]): Promise<SearchResult[]> {
  const handbooks = await getHandbookData(true);
  const res = handbooks.flatMap((x) => searchHandbook(x, searchQuery));
  return res;
}

export interface SearchResult {
  header: string;
  headerLevel: number;
  link: string;
  content: string;
  handbookTitle: string;
  handbookName: string;
}

function searchHandbook(
  handbook: HandbookData,
  search: string[]
): SearchResult[] {
  if (!handbook.content) return [];
  let lines = handbook.content.split(/\r?\n/);
  const result = [];

  let currentheading:
    | (SearchResult & {
        headerTags: string[];
        contentTags: string[];
      })
    | null = null;

  // TODO Rewrite as lines.reduce
  for (let line of lines) {
    const titleRes = /(^#+\s*)(.*)$/.exec(line);
    if (titleRes) {
      const level = titleRes[1].trim().length;

      if (
        currentheading &&
        search.some(
          (s) =>
            currentheading?.headerTags.includes(s) ||
            currentheading?.contentTags.includes(s)
        )
      ) {
        result.push(currentheading);
      }

      const header = titleRes[2];
      currentheading = {
        headerLevel: level,
        header: header,
        link: getChapterLink(handbook.name, header),
        headerTags: splitTrimAndLowercase(header),
        contentTags: [],
        content: "",
        handbookTitle: handbook.title,
        handbookName: handbook.name,
      };
    } else {
      if (!currentheading) continue;
      currentheading.contentTags = [
        ...currentheading.contentTags,
        ...splitTrimAndLowercase(line),
      ];

      currentheading.content += "\n" + line;
    }
  }
  return result;
}

function getChapterLink(handbookName: string, header: string) {
  return `/${handbookName}#${header.replace(/ /g, "-").toLowerCase()}`;
}

// We can probably find a list of these somewhere
const filterWords = [
  "det",
  "en",
  "et",
  "som",
  "for",
  "i",
  "at",
  "har",
  "å",
  "på",
];

function splitTrimAndLowercase(str: string): string[] {
  return str
    .toLowerCase()
    .replace(
      /(\r?\n|\r)|(?:\.)|(?:\,)|(?:\[)|(?:\])|(?:\()|(?:\))|(?:\*\*)|(?:\:)|(?:\?)/g,
      ""
    )
    .trim()
    .split(" ")
    .filter((x) => !filterWords.includes(x));
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query.q;
  if (!query || Array.isArray(query)) {
    return res.status(200).json([]);
  }

  const results = await doSearch(splitTrimAndLowercase(query));
  return res.status(200).json(results);
};
