import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Flex, Text } from '@mantine/core';
import { ChildAccount } from '@prisma/client';
import Current from '@/components/base/Current/Current';
import { useEditMode } from '@/store/useEditMode';
import style from './CurrentSection.module.css';
import childAccountsService from '@/APIService/childAccounts';

type CurrentSectionProps = {
  childAccount: ChildAccount;
};

export const CurrentSection = (props: CurrentSectionProps) => {
  const { childAccount } = props;

  const editMode = useEditMode((state) => state.edit);

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (childAccountData: Partial<ChildAccount>) =>
      childAccountsService.updateChildAccount(
        childAccountData,
        childAccount.id
      ),
    // When mutate is called:
    onMutate: async (newChildAccount: Partial<ChildAccount>) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['currentChildAccount'] });

      // Snapshot the previous value
      const previousChildAccountData = queryClient.getQueryData([
        'currentChildAccount',
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ['currentChildAccount'],
        (old: Partial<ChildAccount>) => ({
          ...old,
          newChildAccount,
        })
      );

      // Return a context object with the snapshotted value
      return { previousChildAccountData };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newChildAccountData, context) => {
      queryClient.setQueryData(
        ['currentChildAccount'],
        context?.previousChildAccountData
      );
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['currentChildAccount'] });
    },
  });

  const handleCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    mutateAsync({ current: Number(e.target.value) });
  };

  // TODO: This sign is hardcoded to '$' for now

  return (
    <Flex
      direction="column"
      align="flex-start"
      className={style.currentSection}
    >
      <Text size="xl">You have</Text>

      <Flex>
        <Current
          current={childAccount.current}
          sign={'$'}
          handleChange={handleCurrentChange}
          edit={editMode}
        />
      </Flex>
    </Flex>
  );
};
