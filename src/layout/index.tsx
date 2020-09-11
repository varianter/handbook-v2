import React, { useState, useLayoutEffect } from "react";
import style from "./layout.module.css";
import Head from "next/head";
import { useRouter } from "next/router";

export const and = (...classes: string[]) => classes.join(" ");

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
  const [navActive, setNavActive] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  useLayoutEffect(() => {
    setScreenWidth(window.innerWidth);
    let timeoutId: any = null;
    const setWindowSize = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => setScreenWidth(window.innerWidth), 100);
    };

    window.addEventListener("resize", setWindowSize);
    return () => {
      window.removeEventListener("resize", setWindowSize);
    };
  }, []);

  const isSmall = screenWidth < 600;

  const router = useRouter();
  const title = "Variant Håndbok";
  const performSearch = () => {
    if (searchQuery.length < 3) return;

    router.push({
      pathname: "/search",
      query: { q: encodeURIComponent(searchQuery) },
    });
    setNavActive(false);
  };

  return (
    <div
      className={style.main}
      style={
        navActive && isSmall ? { position: "fixed" } : { position: "relative" }
      }
    >
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
      {isSmall ? (
        <header className={style.header}>
          <button
            className={style.burgerButtonContainer}
            id="hamburger"
            aria-labelledby="menu-label"
            aria-expanded={navActive}
            onClick={() => setNavActive(!navActive)}
          >
            <div
              className={and(style.bar1, navActive ? style.bar1_change : "")}
            />
            <div
              className={and(style.bar2, navActive ? style.bar2_change : "")}
            />
            <div
              className={and(style.bar3, navActive ? style.bar3_change : "")}
            />
          </button>
          <a href="/" className={style.header__logo}>
            <img src={require("./variant-bw.svg")} alt="Variant" />
          </a>
        </header>
      ) : null}
      <nav className={and(style.nav, navActive ? style.nav__active : " ")}>
        <section className={style.nav__inner}>
          {!isSmall ? (
            <a href="/" className={style.nav__logo}>
              <img src={require("./variant.svg")} alt="Variant" />
            </a>
          ) : (
            <p>Håndbøker</p>
          )}
          <ul className={style.nav__handbooks}>
            {handbooks.map((handbook) => {
              return (
                <li key={handbook.title}>
                  <a
                    onClick={() => {
                      router.push({
                        href: "/[handbook]",
                        pathname: handbook.name.toString(),
                      });
                      if (navActive) {
                        setNavActive(false);
                      }
                    }}
                  >
                    {handbook.title}
                  </a>
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
                      <a
                        onClick={() => {
                          if (navActive) {
                            setNavActive(false);
                          }
                        }}
                        href={`#${heading.replace(/ /g, "-").toLowerCase()}`}
                      >
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
