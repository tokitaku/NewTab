import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import { LinkButton } from '@/components/LinkButton'
import { Clock } from '@/components/Clock'
import { useTime } from '@/useTime'
import { getUrl } from '@/utils/config'

export default function Home() {
  const searchGoogle = (event: any) => {
    event.preventDefault();
    document.location.href="https://www.google.com/search?q="+query;
  };
  const time = useTime(1000);

  const bg = getUrl("/images/mauve-cat.png");

  const [query, setQuery] = useState("");
  return (
    <>
      <Head>
        <title>New Tab</title>
        <meta name="description" content="New Tab Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={getUrl("/images/iconmonstr-plus.png")} />
      </Head>
      <main style={{backgroundImage: `url(${bg})`, backgroundSize:'100% auto'}} className={styles.main}>
        <Clock time={time}/>
        <form className={styles.searchForm} onSubmit={searchGoogle}>
          <input onChange={(event) => setQuery(event.target.value)} value={query} className={styles.searchInput} id="searchInput" placeholder="Search Google"></input>
        </form>
        <div className={styles.bookmarks}>
          <LinkButton label="GitHub" name="github" url="https://github.com/" />
          <LinkButton label="YouTube" name="youtube" url="https://youtube.com/" />
          <LinkButton label="Amazon" name="amazon" url="https://amazon.com/" />
          <LinkButton label="Twitter" name="twitter" url="https://twitter.com/home" />
        </div>
      </main>
    </>
  )
}
