import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, FormEvent } from "react";
// import { LinkButton } from "@/components/LinkButton";
import { Clock } from "@/components/Clock";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { getUrl } from "@/utils/config";

export default function Home() {
  const searchGoogle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    document.location.href =
      "https://www.google.com/search?q=" + encodeURIComponent(query);
  };

  const bg = getUrl("/images/bg-img.jpg");

  const [query, setQuery] = useState("");
  return (
    <>
      <Head>
        <title>New Tab</title>
        <meta name="description" content="New Tab Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={getUrl("/images/iconmonstr-plus.png")} />
      </Head>
      <main
        style={{
          backgroundImage: `url(${bg})`,
        }}
        className={styles.main}
      >
        <Clock />
        <form className={styles.searchForm} onSubmit={searchGoogle}>
          <input
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            className={styles.searchInput}
            id="searchInput"
            placeholder="Search Google"
          ></input>
        </form>
        <PomodoroTimer />
      </main>
    </>
  );
}
