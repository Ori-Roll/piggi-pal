import { Button, Center, Text, Menu, Loader, Modal } from '@mantine/core';
import { IconChevronDown, IconPlus } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChildAccount } from '@prisma/client';
import { useSelectedChildAccount } from '@/store/useCurrentChildAccount';
import { useEditMode } from '@/store/useEditMode';
import { selectCurrentChildAccount } from '@/utils/generalDataUtils';
import childAccountsService from '@/APIService/childAccounts';
import { useUserDataState, useUserMutation } from '@/hooks/query/user';
import ActionButton from '@/components/base/ActionButton/ActionButton';
import { defaultColors } from '@/utils/colors';
import { useState } from 'react';
import AddNewChildAccountModal from '../Modals/AddNewChildAccountModal';

type ChildAccountSelectProps = {};

const ChildAccountSelect = (props: ChildAccountSelectProps) => {
  const {} = props;

  const [addChildModalOpened, setAddChildModalOpened] = useState(false);
  const [selectOpened, setSelectOpened] = useState(false);

  const { data: user } = useUserDataState();
  const editMode = useEditMode((state) => state.edit);
  const queryClient = useQueryClient();

  const selectedChildAccount = useSelectedChildAccount(
    (state) => state?.selectedChildAccount
  );

  const setSelectedChildAccount = useSelectedChildAccount(
    (state) => state?.setSelectedChildAccount
  );

  // const activateAddChildAccountModal = useAddChildAccountModalToggle(
  //   (state) => state.setTrue
  // );

  const addNewChildAccount = async () => {
    setAddChildModalOpened(true);
    setSelectOpened(false);
  };

  const mutateUserAsync = useUserMutation();

  const onChildAccountChange = (childAccount: ChildAccount) => {
    setSelectedChildAccount?.(childAccount);
    mutateUserAsync({
      id: user!.id,
      newUserData: {
        lastOpenedChildAccountId: childAccount.id,
      },
    });
  };

  const {
    data: childAccounts,
    isLoading: childAccountsLoading,
    error: childAccountsError,
  } = useQuery({
    queryKey: ['userChildAccounts'],
    queryFn: async () => {
      const resData = await childAccountsService.getUserChildAccounts();
      if (!selectedChildAccount && resData.data.length) {
        const selectedChildAccount = selectCurrentChildAccount(
          user!,
          resData.data
        );
        if (selectedChildAccount) {
          setSelectedChildAccount?.(selectedChildAccount);
        }
      }
      return resData.data;
    },
    refetchOnMount: true,
  });

  const onNewAccountCreated = async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] });
    setAddChildModalOpened(false);
  };

  return (
    <>
      <Modal
        title={'Create a new child account'}
        opened={addChildModalOpened}
        onClose={() => setAddChildModalOpened(false)}
      >
        <AddNewChildAccountModal onSubmitCallback={onNewAccountCreated} />
      </Modal>
      <Menu
        opened={selectOpened}
        onChange={setSelectOpened}
        transitionProps={{ transition: 'pop-top-right' }}
        position="bottom"
        withinPortal
        width="target"
      >
        <Menu.Target>
          <ActionButton
            colorAccent={defaultColors.secondaryColor}
            rightSection={<IconChevronDown size={18} stroke={1.5} />}
            disabled={!editMode}
            style={
              editMode
                ? {
                    border: 'solid',
                    borderWidth: '0.2rem',
                    borderRadius: '2rem',
                    borderColor: defaultColors.primaryColor,
                  }
                : { border: 'none', background: 'none' }
            }
          >
            {selectedChildAccount?.kidName || 'Select child account'}
          </ActionButton>
        </Menu.Target>

        <Menu.Dropdown>
          {childAccountsLoading ? (
            <Center w="100%" h={70}>
              <Loader />
            </Center>
          ) : (
            childAccounts &&
            childAccounts.map((childAccount) => (
              <Menu.Item
                key={childAccount.id}
                variant="transparent"
                fw={500}
                value={childAccount.id}
                onClick={() => {
                  onChildAccountChange(childAccount);
                }}
              >
                <Text>{childAccount.kidName}</Text>
              </Menu.Item>
            ))
          )}
          <ActionButton w="100%" onClick={addNewChildAccount}>
            <IconPlus />
            Add child account
          </ActionButton>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default ChildAccountSelect;
