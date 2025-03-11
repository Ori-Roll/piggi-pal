import { useQueryClient } from '@tanstack/react-query';

export const useUpdateOnMutationCallback = <T, OT>(
  queries: string[],
  //TODO: This any is because we don't know how this will affect the temp data set optimistically
  setOptimisticSetCallback: (newItem: T) => (old: OT) => unknown
) => {
  const queryClient = useQueryClient();
  return async (newItem: any) => {
    console.log('updateOnMutationCallback', queries);
    await queryClient.cancelQueries({
      queryKey: queries,
    });
    const previousChildAccountData = queryClient.getQueryData(queries);

    queryClient.setQueryData(queries, setOptimisticSetCallback(newItem));

    return { previousChildAccountData };
  };
};
