import { client } from './fetchClient/fetchClient';
import { Task } from '@prisma/client';

const tasksService = {
  getUserTasks: () => client.get<Task[]>('/tasks'),
  getTask: (id: string) => client.get<Task>(`/tasks?id=${id}`),
  createTask: (taskData: Partial<Task>) =>
    client.post<Task>('/tasks', taskData),
  updateTask: (taskData: Partial<Task>, taskId: string) =>
    client.patch<Task>(`/tasks?id=${taskId}`, taskData),
  deleteTask: (id: string) => client.delete<Task>(`/tasks?id=${id}`),
};

export default tasksService;
