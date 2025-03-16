import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Flex, Text, UnstyledButton } from '@mantine/core';
import { ChildAccount } from '@prisma/client';
import Current from '@/components/base/Current/Current';
import { useEditMode } from '@/store/useEditMode';
import style from './CurrentSection.module.css';
import childAccountsService from '@/APIService/childAccounts';
import IconButton from '@/components/base/buttons/IconButton';
import { IconPencilDollar } from '@tabler/icons-react';
import ModalsWrapper from '@/components/Modals/ModalWrapper';
import { useState } from 'react';
import { defaultColors, getTextColorForBackground } from '@/utils/colors';
import LayoutCard from '@/components/base/LayoutCard/LayoutCard';
import ActionButton from '@/components/base/ActionButton/ActionButton';

type CurrentSectionProps = {
  childAccount: ChildAccount;
};

export const CurrentSection = (props: CurrentSectionProps) => {
  const { childAccount } = props;

  const editMode = useEditMode((state) => state.edit);

  const queryClient = useQueryClient();

  const [editCurrentModalOpened, setEditCurrentModalOpened] = useState(false);

  const onEditCurrentClick = () => {
    setEditCurrentModalOpened(true);
  };

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

  const editCurrentBGColor = defaultColors.secondaryColor;
  const editCurrentColor = getTextColorForBackground(editCurrentBGColor);

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
        direction="column"
        align="flex-start"
        className={style.currentSection}
        p="1rem"
      >
        <Text size="xl">You have</Text>

        <Flex align="center">
          <Current
            current={childAccount.current}
            sign={'$'}
            handleChange={handleCurrentChange}
            edit={editMode}
          />
          {editMode && (
            <>
              <ActionButton
                onClick={onEditCurrentClick}
                colorAccent={editCurrentColor}
                style={{
                  minHeight: '2rem',
                }}
              >
                <Text>Withdraw/Deposit</Text>
                <IconPencilDollar
                  className={style.in_icon}
                  size="1.5rem"
                  color={editCurrentBGColor}
                />
              </ActionButton>
              <ModalsWrapper
                title="Edit Current"
                opened={editCurrentModalOpened}
                onClose={() => setEditCurrentModalOpened(false)}
              >
                <h1>
                  This is a modal that will be used to edit the current value of
                  the child account
                </h1>
              </ModalsWrapper>
            </>
          )}
        </Flex>
      </Flex>
    </LayoutCard>
  );
};
