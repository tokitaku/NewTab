import Head from 'next/head'
import styles from '../styles/Home.module.css'
// import { LinkButton } from "@/components/LinkButton";
import { Clock } from "@/components/Clock";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { getUrl } from "@/utils/config";

export default function Home() {
  const bg = getUrl("/images/bg-img.jpg");

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
        <div className={styles.timerAnchor}>
          <Clock />
        </div>
        <div className={styles.heroStack}>
          <PomodoroTimer />
        </div>
      </main>
    </>
  );
}
