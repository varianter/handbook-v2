import React, { useState } from "react";
import style from "./layout.module.css";
import Head from "next/head";
import { useRouter } from "next/router";

const favicon = require("@variant/profile/lib/logo/favicon.png");

interface LayoutProps {
  handbooks: { name: string; title: string }[];
  subHeadings?: string[];
  currentSearch?: string;
}

const Layout: React.FC<LayoutProps> = ({
  subHeadings = [],
  currentSearch = "",
  handbooks,
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const router = useRouter();
  const title = "Variant Håndbok";
  const performSearch = () => {
    if (searchQuery.length < 3) return;

    router.push({
      pathname: "/search",
      query: { q: encodeURIComponent(searchQuery) },
    });
  };
  return (
    <div className={style.main}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href={favicon} />
        <link rel="manifest" href="/manifest.json" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@variant_as" />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.variant.no/" />
        <meta
          property="og:image"
          content="https://www.variant.no/og-header-min.png"
        />
      </Head>
      <nav className={style.nav}>
        <section className={style.nav__inner}>
          <a href="/" className={style.nav__logo}>
            <img src={require("./variant.svg")} alt="Variant" />
          </a>
          <ul className={style.nav__handbooks}>
            {handbooks.map((handbook) => {
              return (
                <li key={handbook.title}>
                  <a href={handbook.name.toString()}>{handbook.title}</a>
                </li>
              );
            })}
          </ul>
          {subHeadings.length > 0 ? (
            <>
              <p>Innhold</p>
              <ul>
                {subHeadings.map((heading) => {
                  return (
                    <li key={heading}>
                      <a href={`#${heading.replace(/ /g, "-").toLowerCase()}`}>
                        {heading}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
          <form
            className={style.nav__inner__searchform}
            onSubmit={(e) => {
              e.preventDefault();
              performSearch();
            }}
          >
            <input
              defaultValue={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Søk</button>
          </form>
        </section>
      </nav>
      <section className={style.content}>{children}</section>
      <footer className={style.footer}>
        Ser du noe som burde endres?
        <a href="https://github.com/varianter/handbook">
          Send oss en oppdatering.
        </a>
      </footer>
    </div>
  );
};

export default Layout;
