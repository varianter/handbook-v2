import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import style from "./nav.module.css";
import { motion, AnimateSharedLayout, Variants } from "framer-motion";
import { HandbookData } from "src/utils";

export const and = (...classes: string[]) => classes.join(" ");

const getActiveHandbook = (asPath: string, handbookNames: string[]) => {
  if (asPath === "/") return "handbook";
  return handbookNames.find((hn) => `/${hn}` === asPath);
};

interface NavProps {
  handbooks: HandbookData[];
  currentSearch?: string;
}

const Nav = ({ handbooks, currentSearch = "" }: NavProps) => {
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [navActive, setNavActive] = useState(false);

  const router = useRouter();
  const asPath = router.asPath;
  const [activeHandbook, setActiveHandbook] = useState(
    getActiveHandbook(
      asPath,
      handbooks.map((h) => h.name)
    )
  );
  const performSearch = () => {
    if (searchQuery.length < 3) return;

    router.push({
      pathname: "/search",
      query: { q: encodeURIComponent(searchQuery) },
    });
    setNavActive(false);
  };

  const navStates = {
    open: {
      transform: "translateY(0%)",
    },
    closed: {
      transform: "translateY(100%)",
      //transition: { type: "spring", stiffness: 20, restDelta: 2 },
    },
  };

  const topBlobStates = {
    closed: { x: "-50%", y: "-30%" },
    open: { x: "-50%", y: "50%" },
  };
  const bottomBlobStates = {
    open: {
      transform:
        "rotate(10deg) translateX(-50%) translateY(-50%) translateZ(0px)",
    },
    closed: {
      transform: "rotate(10deg) translateX(0%) translateY(-6%) translateZ(0px)",
    },
  };
  const headerStates = {
    closed: {
      backgroundImage: `
linear-gradient(
    45deg,
    rgb(241, 237, 223, 0),
    rgb(244, 241, 231, 0)
  )
      `,
    },
    open: {
      backgroundImage: `
linear-gradient(
    45deg,
    rgb(241, 237, 223, 0.8),
    rgb(244, 241, 231, 1)
  )
      `,
    },
  };
  return (
    <motion.header
      variants={headerStates}
      animate={navActive ? "open" : "closed"}
      initial={"closed"}
      className={style.header}
    >
      <motion.div
        className={style.blob__top}
        animate={navActive ? "open" : "closed"}
        initial={"closed"}
        variants={topBlobStates}
      >
        <svg
          className={style.svg__top}
          width="479"
          height="566"
          viewBox="0 0 479 566"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M59.5976 282.379C64.3669 231.777 18.2821 184.685 32.9842 136.031C50.315 78.6782 84.8662 4.52466 144.668 0.856585C208.408 -3.05307 233.071 88.3996 288.354 120.367C327.784 143.168 382.492 127.336 416.257 157.905C453.843 191.933 479.21 241.874 478.562 292.571C477.91 343.506 439.918 383.237 412.823 426.372C382.437 474.747 364.541 538.764 311.153 559.09C257.104 579.669 198.748 549.021 144.694 528.458C92.0356 508.426 22.5321 495.534 4.11924 442.288C-14.7824 387.629 54.1706 339.959 59.5976 282.379Z"
            fill="#FFD0C9"
          />
        </svg>
      </motion.div>
      <motion.div
        className={style.blob__bottom}
        animate={navActive ? "open" : "closed"}
        variants={bottomBlobStates}
      >
        <svg
          className={style.svg__bottom}
          width="792"
          height="696"
          viewBox="0 0 792 696"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M548.925 101.226C637.058 132.933 752.015 154.857 783.562 242.892C814.77 329.979 743.724 421.185 690.716 496.901C646.808 559.62 584.139 607.138 511.461 631.564C449.35 652.439 384.961 614.325 319.802 621.561C231.374 631.381 139.281 732.028 66.3632 680.992C-4.36735 631.488 57.558 515.034 45.6623 429.689C35.6928 358.163 -9.25396 293.98 2.49328 222.761C16.0675 140.465 37.4577 36.2126 115.482 6.39654C195.93 -24.3459 269.894 69.964 354.118 88.3906C419.296 102.65 486.142 78.6381 548.925 101.226Z"
            fill="#9AF0E8"
          />
        </svg>
      </motion.div>
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
      <AnimateSharedLayout>
        <motion.nav
          className={style.nav}
          variants={navStates}
          animate={navActive ? "open" : "closed"}
        >
          <div
            className={style.nav__toggle}
            onClick={() => {
              setNavActive(!navActive);
            }}
          >
            Meny{" "}
          </div>

          <ul className={and(style.nav__list, style.nav__list_main)}>
            {handbooks.map((handbook) => (
              <HandbookLink
                isActive={activeHandbook === handbook.name}
                handbook={handbook}
                toggleActive={() => {
                  if (activeHandbook === handbook.name) {
                    setActiveHandbook("");
                  } else {
                    setActiveHandbook(handbook.name);
                  }
                }}
              />
            ))}
          </ul>

          <div
            className={style.nav__close}
            onClick={() => {
              setNavActive(!navActive);
            }}
          >
            Lukk{" "}
          </div>
        </motion.nav>
      </AnimateSharedLayout>
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
    </motion.header>
  );
};

const HandbookLink = ({
  handbook,
  isActive,
  toggleActive,
}: {
  handbook: HandbookData;
  isActive: boolean;
  toggleActive: () => void;
}) => {
  const listStates: Variants = {
    open: {
      height: "auto",
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0,
      },
    },
    collapsed: {
      height: 0,
      transition: { staggerChildren: 0.01, staggerDirection: -1 },
    },
  };

  const arrowStates: Variants = {
    open: { transform: "rotate(0deg)" },
    collapsed: { transform: "rotate(-90deg)" },
  };

  const itemStates: Variants = {
    open: { y: "0px", opacity: 1, pointerEvents: "unset" },
    collapsed: { y: "0px", opacity: 0, pointerEvents: "none" },
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
    <motion.li
      layout
      key={handbook.title}
      className={and(style.nav__list_item, style.nav__list_head)}
      onClick={() => toggleActive()}
    >
      <button className={style.button_expand} type="button">
        <motion.span
          variants={arrowStates}
          style={{ display: "inline-block" }}
          animate={isActive}
          /* animate={open ? "open" : "collapsed"}
          initial={open ? "open" : "collapsed"} */
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={style.nav__expand}
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
      <a className={and(style.nav__link, style.nav__link_head)}>
        {handbook.title}
      </a>

      <motion.ul
        className={style.nav__list}
        variants={listStates}
        animate={isActive ? "open" : "collapsed"}
        initial={isActive ? "open" : "collapsed"}
      >
        <motion.li
          variants={itemStates}
          /* animate={open ? "open" : "collapsed"}
              initial={open ? "open" : "collapsed"} */
          key={handbook.name}
          className={style.nav__list_item}
        >
          <Link href="/[handbook]" as={handbook.name.toString()}>
            <a className={style.nav__link}>Intro</a>
          </Link>
        </motion.li>
        {handbook.subHeadings.map((heading) => {
          const hash = `${handbook.name.toString()}#${heading
            .replace(/ /g, "-")
            .toLowerCase()}`;

          return (
            <motion.li
              variants={itemStates}
              /* animate={open ? "open" : "collapsed"}
              initial={open ? "open" : "collapsed"} */
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
