// lib/linear.ts

interface LinearUser {
  id: string;
  name: string;
}

// 状態の優先順位を定義
const STATE_PRIORITY = {
  "In Progress": 0,
  "Todo": 1,
  "In Review": 2,
} as const;

// タスクの型定義
export interface Task {
  id: string;
  title: string;
  url: string;
  state: {
    name: string;
  };
}

const LINEAR_API_URL = "https://api.linear.app/graphql";

export const fetchUserId = async (): Promise<string> => {
  try {
    const response = await fetch(LINEAR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_LINEAR_API_KEY as string,
      },
      body: JSON.stringify({
        query: `
            query {
              viewer {
                id
                name
              }
            }
          `,
      }),
    });
    const { data } = await response.json();
    const user: LinearUser = data.viewer;

    return user.id;
  } catch (error) {
    console.error("ユーザー情報の取得に失敗しました。", error);
    throw error;
  }
};

// タスクを取得する関数
export const fetchTasks = async (userId: string): Promise<Task[]> => {
  try {
    const response = await fetch(LINEAR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_LINEAR_API_KEY as string,
      },
      body: JSON.stringify({
        query: `
          query {
            issues(filter: { 
              assignee: { id: { eq: "${userId}" } },
              state: { 
                name: { 
                  in: ["In Progress", "Todo", "In Review"]
                } 
              }
            }) {
              nodes {
                id
                title
                url
                state {
                  name
                }
              }
            }
          }
        `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Linear API Error:", result);
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    if (!result.data?.issues?.nodes) {
      console.error("Linear API Response:", result);
      throw new Error("タスク情報が取得できませんでした。");
    }

    // タスクを優先順位でソート
    return sortTasksByPriority(result.data.issues.nodes);
  } catch (error) {
    console.error("タスクの取得に失敗:", error);
    throw error;
  }
};

// タスクを優先順位でソートする関数
const sortTasksByPriority = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    const priorityA =
      STATE_PRIORITY[a.state.name as keyof typeof STATE_PRIORITY] ?? 999;
    const priorityB =
      STATE_PRIORITY[b.state.name as keyof typeof STATE_PRIORITY] ?? 999;
    return priorityA - priorityB;
  });
};
