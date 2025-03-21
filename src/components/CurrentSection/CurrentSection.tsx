import { Flex, Loader, Text } from '@mantine/core';
import { ChildAccount } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditMode } from '@/store/useEditMode';
import childAccountsService from '@/APIService/childAccounts';
import { defaultColors } from '@/utils/colors';
import Current from '@/components/base/Current/Current';
import LayoutCard from '@/components/base/LayoutCard/LayoutCard';
import TransactionsButtons from '@/components/TransactionsButtons/TransactionsButtons';
import style from './CurrentSection.module.css';
import { useIsMobile } from '@/hooks/configHooks';
import PiggyBank from '@/assets/pigibank_JustPig.svg';
import Image from 'next/image';

type CurrentSectionProps = {
  childAccount: ChildAccount;
};

export const CurrentSection = (props: CurrentSectionProps) => {
  const { childAccount } = props;

  const editMode = useEditMode((state) => state.edit);
  const isMobile = useIsMobile();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
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
    <LayoutCard
      boxProps={{
        style: {
          borderWidth: '1px',
          borderColor: defaultColors.primaryColor,
          borderStyle: 'dashed',
        },
      }}
    >
      <Flex
        direction="row"
        align="center"
        justify="flex-start"
        gap="1rem"
        pl="1rem"
      >
        {!isMobile && (
          <Image
            height={105}
            src={PiggyBank}
            alt="piggy-bank"
            style={{ marginTop: '0.2rem' }}
          />
        )}

        <Flex
          direction="column"
          align={isMobile ? 'center' : 'flex-start'}
          className={style.currentSection}
          p="1rem"
          gap="1.5rem"
        >
          <Flex align="flex-end" justify="flex-end" gap="0.4rem">
            <Text size="xl" lh="1.5rem">
              Balance
            </Text>
            <Text size="sm" lh="1.3rem">
              (what you have)
            </Text>
            {isPending && <Loader size="sm" />}
          </Flex>
          <Flex
            direction={isMobile ? 'column' : 'row'}
            align="center"
            gap="2rem"
            w="100%"
          >
            <Current
              current={childAccount.current}
              sign={'$'}
              handleChange={handleCurrentChange}
              edit={editMode}
            />
            {editMode && (
              <TransactionsButtons
                disabled={isPending}
                selectedChildAccount={childAccount}
                childAccountMutationFn={mutateAsync}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </LayoutCard>
  );
};
