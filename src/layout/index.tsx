import React, { useState, useEffect } from "react";
import style from "./layout.module.css";
import Head from "next/head";
import Nav from "../components/layout/nav";
import { HandbookData } from "src/utils";
// import { useRouter } from "next/router";

const title = "Variant Håndbok";

export const and = (...classes: string[]) => classes.join(" ");

const favicon = require("@variant/profile/lib/logo/favicon.png");

interface LayoutProps {
  handbooks: HandbookData[];
  subHeadings?: string[];
  currentSearch?: string;
}

const Layout: React.FC<LayoutProps> = ({
  subHeadings = [],
  currentSearch = "",
  handbooks,
  children,
}) => {
  return (
    <div
      className={style.main}
      // style={
      //   navActive && isSmall ? { position: "fixed" } : { position: "relative" }
      // }
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
      <Nav
        currentSearch={currentSearch}
        handbooks={handbooks}
        subHeadings={subHeadings}
      />

      <main role="main" id="innhold">
        <section className={style.content}>{children}</section>
      </main>
      {/* <footer className={style.footer}>
        Ser du noe som burde endres?
        <a href="https://github.com/varianter/handbook">
          Send oss en oppdatering.
        </a>
      </footer> */}
    </div>
  );
};

export default Layout;
