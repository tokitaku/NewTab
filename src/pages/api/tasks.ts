import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchUserId, fetchTasks } from '@/lib/linear';
import type { Task } from '@/lib/linear';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = await fetchUserId();
    const tasks = await fetchTasks(userId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks from Linear:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}
