import { fetchTasks } from "./linear.ts";
import { strict as assert } from "node:assert";
import { test, mock } from "node:test";

test("fetchTasks uses GraphQL variables for userId", async () => {
  const testUserId = "test-user-id-123";
  const mockResponse = {
    data: {
      issues: {
        nodes: [
          {
            id: "1",
            title: "Test Task",
            url: "https://linear.app/task/1",
            state: { name: "Todo" },
          },
        ],
      },
    },
  };

  // Mock global fetch
  const originalFetch = global.fetch;
  global.fetch = mock.fn(async (url: string, init?: RequestInit) => {
    const body = JSON.parse(init?.body as string);

    // Assert that variables are used
    assert.strictEqual(body.variables.userId, testUserId);
    assert.ok(body.query.includes("$userId: String!"));
    assert.ok(body.query.includes("eq: $userId"));
    assert.ok(!body.query.includes(testUserId)); // Ensure the ID is not interpolated in the query string

    return {
      ok: true,
      json: async () => mockResponse,
    } as Response;
  }) as any;

  try {
    const tasks = await fetchTasks(testUserId);
    assert.strictEqual(tasks.length, 1);
    assert.strictEqual(tasks[0].title, "Test Task");
  } finally {
    // Restore fetch
    global.fetch = originalFetch;
  }
});

test("fetchTasks throws error when response is not ok", async () => {
  const testUserId = "test-user-id-123";
  const originalFetch = global.fetch;

  global.fetch = mock.fn(async () => {
    return {
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ error: "Invalid token" }),
    } as Response;
  }) as any;

  try {
    await assert.rejects(
      fetchTasks(testUserId),
      (err: Error) => {
        assert.strictEqual(err.message, "API request failed: 401 Unauthorized");
        return true;
      }
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("fetchTasks throws error when data.issues.nodes is missing", async () => {
  const testUserId = "test-user-id-123";
  const originalFetch = global.fetch;

  global.fetch = mock.fn(async () => {
    return {
      ok: true,
      json: async () => ({ data: { issues: {} } }), // Missing nodes
    } as Response;
  }) as any;

  try {
    await assert.rejects(
      fetchTasks(testUserId),
      (err: Error) => {
        assert.strictEqual(err.message, "タスク情報が取得できませんでした。");
        return true;
      }
    );
  } finally {
    global.fetch = originalFetch;
  }
});
