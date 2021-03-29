import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import style from "./search.module.css";

export default function SearchForm({
  currentSearch,
  autofocus = false,
}: {
  currentSearch: string;
  autofocus?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState(currentSearch ?? "");
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autofocus) {
      ref.current?.focus();
    }
  }, [autofocus]);

  const performSearch = () => {
    if (searchQuery.length < 3) return;

    router.push({
      pathname: "/search",
      query: { q: encodeURIComponent(searchQuery) },
    });
  };

  return (
    <form
      className={style.searchform}
      onSubmit={(e) => {
        e.preventDefault();
        performSearch();
      }}
    >
      <input
        defaultValue={searchQuery}
        placeholder="Søk etter noe..."
        onChange={(e) => setSearchQuery(e.target.value)}
        ref={ref}
        autoFocus={autofocus}
      />
      <button type="submit">Søk</button>
    </form>
  );
}
