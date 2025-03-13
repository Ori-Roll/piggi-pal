import { client } from './fetchClient/fetchClient';
import { Task } from '@prisma/client';

const tasksService = {
  getUserTasks: () => client.get<Task[]>('/tasks'),
  getTask: (id: string) => client.get<Task>(`/tasks?id=${id}`),
  createTask: (taskData: Partial<Task>) =>
    client.post<Task>('/tasks', taskData),
  updateTask: (taskId: string, taskData: Partial<Task>) =>
    client.patch<Task>(`/tasks?id=${taskId}`, taskData),
  completeTask: (id: string, childAccountId: string) =>
    client.patch<Partial<Task>>(`/tasks/complete?id=${id}`, { childAccountId }),
  deleteTask: (id: string) => client.delete<Task>(`/tasks?id=${id}`),
};

export default tasksService;
