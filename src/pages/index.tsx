import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from "react";
// import { LinkButton } from "@/components/LinkButton";
import { Clock } from "@/components/Clock";
import { useTime } from "@/useTime";
import { getUrl } from "@/utils/config";
import type { Task } from "@/lib/linear";
import { fetchUserId, fetchTasks } from "@/lib/linear";

export default function Home() {
  const time = useTime(1000);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const searchGoogle = (event: any) => {
    event.preventDefault();
    document.location.href =
      "https://www.google.com/search?q=" + encodeURIComponent(query);
  };
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const userId = await fetchUserId();
        const assignedTasks = await fetchTasks(userId);
        setTasks(assignedTasks);
      } catch (error) {
        console.error("タスクの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

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
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "100% auto" }}
        className={styles.main}
      >
        <Clock time={time} />
        <form className={styles.searchForm} onSubmit={searchGoogle}>
          <input
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            className={styles.searchInput}
            id="searchInput"
            placeholder="Search Google"
          ></input>
        </form>
        <div className={styles.taskContainer}>
          <h2 className={styles.taskListTitle}>My Linear Tasks</h2>
          {loading ? (
            <p className={styles.loading}>Loading...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks assigned!</p>
          ) : (
            <ul className={styles.taskList}>
              {tasks.map((task) => (
                <li key={task.id} className={styles.taskItem}>
                  <a href={task.url} target="_blank" rel="noopener noreferrer">
                    <span
                      className={styles.taskStatus}
                      style={{
                        backgroundColor:
                          task.state.name === "In Progress"
                            ? "#f59e0b"
                            : "#10b981",
                      }}
                    >
                      {task.state.name}
                    </span>
                    <span className={styles.taskTitle}>{task.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
