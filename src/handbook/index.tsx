import { NextPage, InferGetStaticPropsType } from "next";
import { getStaticProps } from "pages/[handbook]";
import React, { useMemo } from "react";
import MarkdownIt from "markdown-it";
import Layout from "src/layout";

const HandbookIndex: NextPage<InferGetStaticPropsType<
  typeof getStaticProps
>> = React.memo(({ handbooks, content }) => {
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
});

export default HandbookIndex;
