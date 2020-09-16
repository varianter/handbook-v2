import { NextPage, InferGetServerSidePropsType } from "next";
import Layout from "src/layout";
import { getServerSideProps } from "pages/search";
import useSWR from "swr";
import { SearchResult } from "pages/api/search";
import style from "./search.module.css";
import { useRouter } from "next/router";
import Book from "src/components/book";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useSearch(searchQuery: string) {
  const { data, error } = useSWR<SearchResult[]>(
    () => (searchQuery.length > 3 ? `/api/search?q=${searchQuery}` : null),
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
      {isLoading ? <div>Loading...</div> : null}
      {!isLoading && !isError ? <SearchResultsList results={results} /> : null}
      {!isLoading && isError ? <p>isError</p> : null}
    </Layout>
  );
};

export default SearchPage;

const SearchResultsList = ({ results }: { results?: SearchResult[] }) => {
  return (
    <section className={style.searchResults}>
      <h1>Søkeresultater</h1>
      {results && results.length !== 0 ? (
        results.map((result, idx) => {
          return (
            <div className={style.searchResult} key={idx}>
              <a className={style.searchResult__link} href={result.link}>
                {result.header}
              </a>
              <p className={style.searchResult__handbookTitle}>
                {result.handbookTitle}
              </p>
              <Book content={result.content}></Book>
            </div>
          );
        })
      ) : (
        <p>Vi fant ingenting, desverre! 😭</p>
      )}
    </section>
  );
};
