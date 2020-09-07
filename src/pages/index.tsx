import Layout from "src/layout";
import { NextPage, InferGetStaticPropsType } from "next";
import { getStaticProps } from "pages";
import MarkdownIt from "markdown-it";
import { useMemo } from "react";
import React from "react";

import markdownItTocAndAnchor from "markdown-it-toc-and-anchor";

const IndexPage: NextPage<InferGetStaticPropsType<
  typeof getStaticProps
>> = React.memo(({ handbooks, content = "", subHeadings }) => {
  const innerHtml = useMemo(() => {
    const md = new MarkdownIt({
      linkify: true,
      html: true,
      typographer: true,
    }).use(markdownItTocAndAnchor, {
      tocFirstLevel: 2,
      tocLastLevel: 2,
      anchorLink: true,
    });

    md.renderer.rules.heading_open = function (tokens, idx) {
      const currentToken = tokens[idx];
      if (currentToken.type === "heading_open") {
        return `<h${currentToken.markup.length + 2}>`;
      }
      return currentToken.tag;
    };

    md.renderer.rules.heading_close = function (tokens, idx) {
      const currentToken = tokens[idx];
      if (currentToken.type === "heading_close") {
        return `</h${currentToken.markup.length + 2}>`;
      }
      return currentToken.tag;
    };

    return { __html: md.render(content) };
  }, [content]);

  return (
    <Layout handbooks={handbooks} subHeadings={subHeadings}>
      <section>
        <article dangerouslySetInnerHTML={innerHtml}></article>
      </section>
    </Layout>
  );
});

export default IndexPage;
