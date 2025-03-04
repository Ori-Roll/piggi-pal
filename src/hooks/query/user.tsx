import {
  UndefinedInitialDataOptions,
  useQuery,
  useMutation,
} from '@tanstack/react-query';
import { userService } from '@/APIService/users';
import { UserWithAllData, UserWithParentLock } from '@/types/dataTypes';
import { User } from 'next-auth';

export const useUserQuery = (
  postQueryCallback?: (data: UserWithAllData) => void,
  restQueryObjData?: Omit<
    UndefinedInitialDataOptions<UserWithAllData>,
    'queryKey'
  >
) => {
  const query = useQuery<UserWithAllData>({
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
    mutationFn: async (data: {
      id: string;
      newUserData: Partial<UserWithParentLock>;
    }) => await userService.updateProfile(data.id, data.newUserData),
  });

  return mutateAsync;
};

export const useUserDataState = () => {
  const query = useUserQuery(() => {}, { enabled: false, queryFn: undefined });
  return query;
};
