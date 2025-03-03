import {
  UndefinedInitialDataOptions,
  useQuery,
  useMutation,
} from '@tanstack/react-query';
import { userService } from '@/APIService/users';
import { User } from '@prisma/client';

export const useUserQuery = (
  postQueryCallback?: (data: User) => void,
  restQueryObjData?: Omit<UndefinedInitialDataOptions<User>, 'queryKey'>
) => {
  const query = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await userService.getCurrentUser();
      const data = response.data;
      postQueryCallback?.(data);
      return data;
    },
    refetchOnMount: false,
    ...restQueryObjData,
  });

  return query;
};

export const useUserMutation = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (data: { id: string; newUserData: Partial<User> }) =>
      await userService.updateProfile(data.id, data.newUserData),
  });

  return mutateAsync;
};

export const useUserDataState = () => {
  const query = useUserQuery(() => {}, { enabled: false, queryFn: undefined });
  return query;
};
