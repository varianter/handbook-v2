import { getHandbookData, getHandbookFiles, getMatterFile } from "src/utils/";
import { GetStaticPaths, GetStaticProps } from "next";
export { default } from "src/handbook";

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const paths = await getHandbookFiles();

    return {
      paths: paths.map((file) => ({
        params: { handbook: file.replace(".md", "") },
      })),
      fallback: false,
    };
  } catch (error) {
    console.error(error);
    return { paths: [], fallback: true };
  }
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const fileName = `${context?.params?.handbook}.md`;
    const { data, content } = await getMatterFile(fileName);

    const handbooks = await getHandbookData();
    return {
      props: { data, content, handbooks },
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
