import { Button, Center, Group, Text, Menu, Loader } from '@mantine/core';
import { IconChevronDown, IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { ChildAccount } from '@prisma/client';
import { useAddChildAccountModalToggle } from '@/store/useModalActive';
import { useSelectedChildAccount } from '@/store/useCurrentChildAccount';
import { useEditMode } from '@/store/useEditMode';
import { selectCurrentChildAccount } from '@/utils/generalDataUtils';
import childAccountsService from '@/APIService/childAccounts';
import { useUserDataState, useUserMutation } from '@/hooks/query/user';
import ActionButton from '@/components/base/ActionButton/ActionButton';

type ChildAccountSelectProps = {};

const ChildAccountSelect = (props: ChildAccountSelectProps) => {
  const {} = props;
  const selectedChildAccount = useSelectedChildAccount(
    (state) => state?.selectedChildAccount
  );
  const editMode = useEditMode((state) => state.edit);
  const { data: user } = useUserDataState();

  const setSelectedChildAccount = useSelectedChildAccount(
    (state) => state?.setSelectedChildAccount
  );

  const activateAddChildAccountModal = useAddChildAccountModalToggle(
    (state) => state.setTrue
  );

  const addNewChildAccount = async () => {
    activateAddChildAccountModal();
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
          // mutateUserAsync({
          //   id: user!.id,
          //   newUserData: {
          //     lastOpenedChildAccountId: selectedChildAccount?.id,
          //   },
          // });
        }
      }
      return resData.data;
    },
    refetchOnMount: true,
  });

  return (
    <Menu
      transitionProps={{ transition: 'pop-top-right' }}
      position="top-start"
      withinPortal
    >
      <Menu.Target>
        <ActionButton
          rightSection={<IconChevronDown size={18} stroke={1.5} />}
          disabled={!editMode}
        >
          {selectedChildAccount?.kidName || 'Select childAccount'}
        </ActionButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Group>
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
          <Button w="100%" onClick={addNewChildAccount}>
            <IconPlus />
            Add child account
          </Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ChildAccountSelect;
