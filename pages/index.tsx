import { getHandbookData, getMatterFile } from "src/utils";
import { GetStaticProps } from "next";
export { default } from "src/pages/index";

export const getStaticProps: GetStaticProps<{
  handbooks: Array<{ [key: string]: string | number }>;
  content?: string;
}> = async () => {
  try {
    const defaultHandbook = "handbook.md";
    const handbooks = await getHandbookData();

    const { content } = await getMatterFile(defaultHandbook);

    return {
      props: { handbooks, content },
      revalidate: 60 * 60,
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        handbooks: [],
      },
    };
  }
};
