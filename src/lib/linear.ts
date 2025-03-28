// lib/linear.ts

interface LinearUser {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  url: string;
  state: {
    name: string;
  };
  project?: {
    name: string;
  } | null;
}

const LINEAR_API_URL = "https://api.linear.app/graphql";

export const fetchUserId = async (): Promise<string> => {
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

  if (!data?.viewer) {
    throw new Error("ユーザー情報が取得できませんでした。");
  }

  const user: LinearUser = data.viewer;

  return user.id;
};

export const fetchAssignedTasks = async (userId: string): Promise<Task[]> => {
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
              state: { name: { in: ["In Progress", "Todo", "In Review"] } }

            }) {
              nodes {
                title
                state {
                  name
                }
                url
              }
            }
          }
        `,
    }),
  });

  const { data } = await response.json();

  if (!data?.issues?.nodes) {
    throw new Error("タスク情報が取得できませんでした。");
  }
  // タスクの状態の順番を定義
  const tasks: Task[] = data.issues.nodes;
  const stateOrder: { [key: string]: number } = {
    "In Progress": 0,
    Todo: 1,
    "In Review": 2,
  };

  return tasks.sort(
    (a, b) =>
      (stateOrder[a.state.name] ?? 999) - (stateOrder[b.state.name] ?? 999)
  );
};
