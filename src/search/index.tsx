import { InferGetServerSidePropsType, NextPage } from "next";
import { useRouter } from "next/router";
import { SearchResult } from "pages/api/search";
import { getServerSideProps } from "pages/search";
import React from "react";
import { BookSummary } from "src/components/book";
import SearchForm from "src/components/search-form";
import Layout from "src/layout";
import useSWR from "swr";
import style from "./search.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useSearch(searchQuery: string) {
  const { data, error } = useSWR<SearchResult[]>(
    `/api/search?q=${searchQuery}`,
    fetcher
  );

  return {
    results: data,
    isLoading: !error && !data,
    isError: error,
  };
}
const SearchPage: NextPage<InferGetServerSidePropsType<
  typeof getServerSideProps
>> = ({ handbooks }) => {
  const router = useRouter();
  const qs = router.query.q;
  let queryString = "";
  if (qs && !Array.isArray(qs)) {
    queryString = decodeURIComponent(qs);
  }

  const { results, isLoading, isError } = useSearch(queryString);

  return (
    <Layout handbooks={handbooks} currentSearch={queryString}>
      <div className={style.searchFormContainer}>
        <SearchForm currentSearch={queryString} />
      </div>

      {isLoading ? <div>Søker...</div> : null}
      {!isLoading && !isError ? <SearchResultsList results={results} /> : null}
      {!isLoading && isError ? <p>isError</p> : null}
    </Layout>
  );
};

export default SearchPage;

const SearchResultsList = ({ results }: { results?: SearchResult[] }) => {
  return (
    <section className={style.searchResults}>
      <h1>Søkeresultater ({results?.length ?? 0})</h1>

      {results && results.length !== 0 ? (
        results.map((result, idx) => {
          return (
            <article className={style.searchResult} key={idx}>
              <header className={style.searchResult__header}>
                <h3>
                  <a href={result.link} className={style.searchResult__link}>
                    {result.header}
                  </a>
                </h3>
                <p className={style.searchResult__handbookTitle}>
                  {result.handbookTitle}
                </p>
              </header>

              <BookSummary
                content={result.content}
                filename={result.handbookName + ".md"}
              />
            </article>
          );
        })
      ) : (
        <p>
          Vi fant ingenting, desverre! 😭 Kan være du må søke med flere tegn.
        </p>
      )}
    </section>
  );
};
