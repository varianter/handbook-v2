import React, { useState, useEffect, useCallback } from "react";
import style from "./layout.module.css";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import BackgroundBlobs from "src/background";
import { Divide as Hamburger } from "hamburger-react";
import SearchForm from "src/components/search-form";

const title = "Variant Håndbok";

export const and = (...classes: string[]) => classes.join(" ");
const isActiveHandbook = (handbookName: string, asPath: string) => {
  if (asPath === "/" && handbookName === "handbook") return true;
  return `/${handbookName}` === asPath;
};

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
  const modalRef = React.createRef<HTMLDivElement>();
  const closeRef = React.createRef<HTMLButtonElement>();

  const { isMenuVisible, setMenuVisible, tabIndex } = useTogglableBurgerMenu(
    modalRef,
    closeRef
  );

  const router = useRouter();
  const asPath = router.asPath;

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
      <header className={style.header}>
        <a href="/" className={style.header__logo}>
          <img src={require("./variant-bw.svg")} alt="Variant" />
        </a>

        <div className={style.burgerButtonContainer}>
          <Hamburger
            aria-labelledby="menu-label"
            aria-expanded={isMenuVisible}
            onToggle={() => setMenuVisible(!isMenuVisible)}
            toggled={isMenuVisible}
          />
        </div>
      </header>

      <nav
        className={and(style.nav, isMenuVisible ? style.nav__active : " ")}
        ref={modalRef}
      >
        <section className={style.nav__inner}>
          <ul className={style.nav__handbooks}>
            {handbooks.map((handbook) => {
              return (
                <li
                  key={handbook.title}
                  className={
                    isActiveHandbook(handbook.name, asPath)
                      ? style.nav__inner__link__active
                      : style.nav__inner__link
                  }
                >
                  <Link href={`/${handbook.name.toString()}`}>
                    <a tabIndex={tabIndex}>{handbook.title}</a>
                  </Link>
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
                    <li key={heading} className={style.nav__inner__link}>
                      <a
                        href={`#${heading.replace(/ /g, "-").toLowerCase()}`}
                        tabIndex={tabIndex}
                      >
                        {heading}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </section>

        <SearchForm currentSearch={currentSearch} />
      </nav>
      <section className={style.content}>{children}</section>

      <BackgroundBlobs />
    </div>
  );
};

export default Layout;

function useTogglableBurgerMenu<T extends HTMLElement, R extends HTMLElement>(
  modalRef: React.RefObject<T>,
  closeButton: React.RefObject<R>
) {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setTabIndex(isMenuVisible ? 0 : -1);

    // Avoid scrolling when menu is visible.
    if (isMenuVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }
  }, [isMenuVisible]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isMenuVisible || closeButton.current?.contains(e.target as Node)) {
        return;
      }
      if (!e.target || !modalRef.current?.contains(e.target as Node)) {
        setMenuVisible(false);
      }
      if ((e.target as Node).nodeName === "A") {
        setMenuVisible(false);
      }
    };
    document.body.addEventListener("click", handleClickOutside);
    return () => document.body.removeEventListener("click", handleClickOutside);
  }, [isMenuVisible, modalRef, closeButton]);

  const handleTabKey = useCallback(
    (e: KeyboardEvent) => {
      const focusableModalElements =
        modalRef.current?.querySelectorAll<HTMLElement>(
          '[role="button"],a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        ) ?? [];
      const allFocusables =
        document.querySelectorAll<HTMLElement>(
          '[role="button"],a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        ) ?? [];

      const first = focusableModalElements[0];
      const last = focusableModalElements[focusableModalElements.length - 1];
      const next =
        Array.from(allFocusables).find(
          (_, i) => allFocusables[i - 1] === document.activeElement
        ) ?? null;
      const previous =
        Array.from(allFocusables).find(
          (_, i) => allFocusables[i + 1] === document.activeElement
        ) ?? null;

      // On normal tabbing. If next element is outside modal, jump to first element
      if (!e.shiftKey && !modalRef.current?.contains(next)) {
        first?.focus();
        return e.preventDefault();
      }

      // On "reversed" tabbing. If previous element is outside modal, jump to last element
      if (e.shiftKey && !modalRef.current?.contains(previous)) {
        last?.focus();
        return e.preventDefault();
      }

      // Not start or end, follow normal tab flow.
    },
    [modalRef]
  );
  useEffect(() => {
    function keyListener(e: KeyboardEvent) {
      if (!isMenuVisible) {
        return;
      }
      if (e.key === "Escape") {
        return setMenuVisible(false);
      }
      if (e.key === "Tab") {
        return handleTabKey(e);
      }
    }
    document.addEventListener("keydown", keyListener);
    return () => document.removeEventListener("keydown", keyListener);
  }, [isMenuVisible, handleTabKey]);

  return {
    isMenuVisible,
    setMenuVisible,
    tabIndex,
  };
}
