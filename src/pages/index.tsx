import Layout from "src/layout";
import { NextPage, InferGetStaticPropsType } from "next";
import { getStaticProps } from "pages";
import MarkdownIt from "markdown-it";
import { useMemo } from "react";

const IndexPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  handbooks,
  content = "",
}) => {
  const innerHtml = useMemo(() => {
    const md = new MarkdownIt({
      linkify: true,
      html: true,
      typographer: true,
    });
    return { __html: md.render(content) };
  }, [content]);

  return (
    <Layout>
      <ul>
        {handbooks.map((f: any) => {
          return (
            <li key={f.name}>
              <a href={f.name.toString()}>{f.name}</a>
            </li>
          );
        })}
      </ul>
      <section>
        <article dangerouslySetInnerHTML={innerHtml}></article>
      </section>
    </Layout>
  );
};

export default IndexPage;
