import React from "react";
import style from "./layout.module.css";
import Head from "next/head";

const favicon = require("@variant/profile/lib/logo/favicon.png");

interface LayoutProps {
  handbooks: { name: string; title: string }[];
  subHeadings: string[];
}

const Layout: React.FC<LayoutProps> = ({
  subHeadings,
  handbooks,
  children,
}) => {
  const title = "Handboook";
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
