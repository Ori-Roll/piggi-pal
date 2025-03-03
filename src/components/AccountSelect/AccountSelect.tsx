import { Button, Center, Group, Text, Menu, Loader } from '@mantine/core';
import { IconChevronDown, IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { Account } from '@prisma/client';
import { useAddAccountModalToggle } from '@/store/useModalActive';
import { useSelectedAccount } from '@/store/useCurrentAccount';
import { useEditMode } from '@/store/useEditMode';
import { selectCurrentAccount } from '@/utils/generalDataUtils';
import accountsService from '@/APIService/accounts';
import { useUserDataState, useUserMutation } from '@/hooks/query/user';
import ActionButton from '@/components/base/ActionButton/ActionButton';

type AccountSelectProps = {};

const AccountSelect = (props: AccountSelectProps) => {
  const {} = props;
  const selectedAccount = useSelectedAccount((state) => state?.selectedAccount);
  const editMode = useEditMode((state) => state.edit);
  const { data: user } = useUserDataState();

  const setSelectedAccount = useSelectedAccount(
    (state) => state?.setSelectedAccount
  );

  const activateAddAccountModal = useAddAccountModalToggle(
    (state) => state.setTrue
  );

  const addNewAccount = async () => {
    activateAddAccountModal();
  };

  const mutateUserAsync = useUserMutation();

  const onAccountChange = (account: Account) => {
    setSelectedAccount?.(account);
    mutateUserAsync({
      id: user!.id,
      newUserData: {
        lastOpenedAccountId: account.id,
      },
    });
  };

  const {
    data: accounts,
    isLoading: accountsLoading,
    error: accountsError,
  } = useQuery({
    queryKey: ['userAccounts'],
    queryFn: async () => {
      const resData = await accountsService.getUserAccounts();
      if (!selectedAccount && resData.data.length) {
        const selectedAccount = selectCurrentAccount(user!, resData.data);
        if (selectedAccount) {
          setSelectedAccount?.(selectedAccount);
          // mutateUserAsync({
          //   id: user!.id,
          //   newUserData: {
          //     lastOpenedAccountId: selectedAccount?.id,
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
          {selectedAccount?.kidName || 'Select account'}
        </ActionButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Group>
          {accountsLoading ? (
            <Center w="100%" h={70}>
              <Loader />
            </Center>
          ) : (
            accounts &&
            accounts.map((account) => (
              <Menu.Item
                key={account.id}
                variant="transparent"
                fw={500}
                value={account.id}
                onClick={() => {
                  onAccountChange(account);
                }}
              >
                <Text>{account.kidName}</Text>
              </Menu.Item>
            ))
          )}
          <Button w="100%" onClick={addNewAccount}>
            <IconPlus />
            Add account
          </Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};

export default AccountSelect;
