import MarkdownIt from "markdown-it";
import { useMemo } from "react";
import markdownItTocAndAnchor from "markdown-it-toc-and-anchor";

interface BookProps {
  content: string;
}
const Book = ({ content }: BookProps) => {
  const innerHtml = useMemo(() => {
    const md = new MarkdownIt({
      linkify: true,
      html: true,
      typographer: true,
    }).use(markdownItTocAndAnchor, {
      tocFirstLevel: 2,
      tocLastLevel: 6,
      anchorLink: true,
    });

    return { __html: md.render(content) };
  }, [content]);
  return (
    <section>
      <article
        className="handbook"
        dangerouslySetInnerHTML={innerHtml}
      ></article>
    </section>
  );
};

export default Book;
