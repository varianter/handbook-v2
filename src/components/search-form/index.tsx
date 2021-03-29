import { useRouter } from "next/router";
import { useState } from "react";

import style from "./search.module.css";

export default function SearchForm({
  currentSearch,
}: {
  currentSearch?: string;
}) {
  const [searchQuery, setSearchQuery] = useState(currentSearch ?? "");
  const router = useRouter();

  const performSearch = () => {
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
      />
      <button type="submit">Søk</button>
    </form>
  );
}
