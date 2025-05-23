import { client } from './fetchClient/fetchClient';
import { Periodic } from '@prisma/client';

const periodicsService = {
  getUserPeriodics: () => client.get<Periodic[]>('/periodics'),
  getPeriodic: (id: string) => client.get<Periodic>(`/periodics?id=${id}`),
  createPeriodic: (periodicData: Partial<Periodic>) =>
    client.post<Periodic>('/periodics', periodicData),
  updatePeriodic: (periodicData: Partial<Periodic>, periodicId: string) =>
    client.patch<Periodic>(`/periodics?id=${periodicId}`, periodicData),
  deletePeriodic: (id: string) =>
    client.delete<Periodic>(`/periodics?id=${id}`),
};

export default periodicsService;
