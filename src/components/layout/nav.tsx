import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import style from "./nav.module.css";
import { AnimatePresence, motion, AnimateSharedLayout } from "framer-motion";
import { HandbookData } from "src/utils";

export const and = (...classes: string[]) => classes.join(" ");

const isActiveHandbook = (handbookName: string, asPath: string) => {
  if (asPath === "/" && handbookName === "handbook") return true;
  return `/${handbookName}` === asPath;
};
interface NavProps {
  handbooks: HandbookData[];
  subHeadings?: string[];
  currentSearch?: string;
}

const Nav = ({ handbooks, subHeadings = [], currentSearch = "" }: NavProps) => {
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [navActive, setNavActive] = useState(false);
  const router = useRouter();
  const asPath = router.asPath;
  const performSearch = () => {
    if (searchQuery.length < 3) return;

    router.push({
      pathname: "/search",
      query: { q: encodeURIComponent(searchQuery) },
    });
    setNavActive(false);
  };

  const navStates = {
    open: { transform: "translateY(0%)" },
    closed: { transform: "translateY(94%) " },
  };

  return (
    <header className={style.header}>
      {/* <button
        className={style.burgerButtonContainer}
        id="hamburger"
        aria-labelledby="menu-label"
        aria-expanded={navActive}
        onClick={() => setNavActive(!navActive)}
      >
        Meny
        
      </button> */}
      {/* <Link href="/">
        <a href="/" className={style.header__logo}>
          <img src={require("./variant-bw.svg")} alt="Variant" />
        </a>
      </Link> */}
      <motion.nav
        className={style.nav}
        variants={navStates}
        animate={navActive ? "open" : "closed"}
      >
        <div
          onClick={() => {
            setNavActive(!navActive);
          }}
        >
          {" "}
          Meny{" "}
        </div>
        <AnimateSharedLayout>
          <ul className={style.nav__list}>
            {handbooks.map((handbook) => (
              <HandbookLink
                isActive={isActiveHandbook(handbook.name, asPath)}
                handbook={handbook}
              />
            ))}
          </ul>
        </AnimateSharedLayout>
        <div
          onClick={() => {
            setNavActive(!navActive);
          }}
        >
          Lukk{" "}
        </div>
      </motion.nav>
      {/* <form
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
        </form> */}
    </header>
  );
};

const HandbookLink = ({
  handbook,
  isActive,
}: {
  handbook: HandbookData;
  isActive: boolean;
}) => {
  const [open, setOpen] = useState(isActive);

  const listStates = {
    open: {
      height: "auto",
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    collapsed: {
      height: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const arrowStates = {
    open: { transform: "rotate(0deg)" },
    collapsed: { transform: "rotate(-90deg)" },
  };

  const itemStates = {
    open: { y: "10px" },
    collapsed: { y: "-10px" },
  };

  // const motionChild = {
  //   visible: ({ index }) => ({
  //     opacity: 1,
  //     y: 0,
  //     transition: { delay: (index + 0.1) * 0.02 }
  //   }),
  //   hidden: ({ index, len }) => ({
  //     opacity: 0,
  //     y: '10px',
  //     transition: { delay: (index + 0.5) * 0.01 }
  //   }),
  //   exit: ({ index, len }) => ({
  //     opacity: 0,
  //     transition: { delay: (len - index + 0.5) * 0.005 },
  //     zIndex: -1
  //   })
  // };

  return (
    <motion.li layout key={handbook.title} className={style.nav__list_item}>
      <button
        className={style.button_expand}
        type="button"
        onClick={() => setOpen(!open)}
      >
        <motion.span
          variants={arrowStates}
          style={{ display: "inline-block" }}
          animate={open ? "open" : "collapsed"}
          initial={open ? "open" : "collapsed"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="#FFF3F2" />
            <path
              d="M7 9L12 15L17 9"
              stroke="#736EBE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>
      <Link href="/[handbook]" as={handbook.name.toString()}>
        <a className={style.nav__link}>{handbook.title}</a>
      </Link>

      <motion.ul
        className={style.nav__list}
        variants={listStates}
        animate={open ? "open" : "collapsed"}
        initial={open ? "open" : "collapsed"}
      >
        {handbook.subHeadings.map((heading) => {
          const hash = `${handbook.name.toString()}#${heading
            .replace(/ /g, "-")
            .toLowerCase()}`;

          return (
            <motion.li
              variants={itemStates}
              animate={open ? "open" : "collapsed"}
              initial={open ? "open" : "collapsed"}
              key={heading}
              className={style.nav__list_item}
            >
              <Link scroll={false} href="/[heading]" as={hash}>
                <a className={style.nav__link}>{heading}</a>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </motion.li>
  );
};

export default Nav;
