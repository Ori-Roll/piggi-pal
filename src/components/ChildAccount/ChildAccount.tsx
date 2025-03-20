import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Center,
  Flex,
  Loader,
  Modal,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { IconCalendarStats, IconClipboardCheck } from '@tabler/icons-react';
import { useSelectedChildAccount } from '@/store/useCurrentChildAccount';
import childAccountsService from '@/APIService/childAccounts';
import { useIsMobile } from '@/hooks/configHooks';
import { ChildAccountWithAllData } from '@/types/dataTypes';
import { defaultColors } from '@/utils/colors';
import { useUserDataState } from '@/hooks/query/user';
import PeriodicsSection from '@/components/PeriodicsSection/PeriodicsSection';
import { CurrentSection } from '@/components/CurrentSection/CurrentSection';
import OopsPage from '@/components/base/OopsPage/Oops';
import TaskSection from '@/components/TaskSection/TaskSection';
import NameAndAvatarLine from '@/components/base/NameAndAvatarLine/NameAndAvatarLine';
import SectionHeader from '@/components/base/SectionHeader/SectionHeader';
import AddNewChildAccountModal from '@/components/Modals/AddNewChildAccountModal';
import style from './ChildAccount.module.css';
import ActionButton from '../base/ActionButton/ActionButton';

type ChildAccountProps = {};

const ChildAccount = (props: ChildAccountProps) => {
  const {} = props;

  const [addChildModalOpened, setAddChildModalOpened] = useState(false);

  const selectedChildAccount = useSelectedChildAccount(
    (state) => state?.selectedChildAccount
  );
  const isMobile = useIsMobile();

  const { data: user } = useUserDataState();

  const {
    data: childAccount,
    isPending: childAccountPending,
    error: childAccountError,
  } = useQuery<ChildAccountWithAllData | null>({
    queryKey: ['currentChildAccount', selectedChildAccount?.id],
    queryFn: async () => {
      if (!selectedChildAccount?.id) return null;
      const resData = await childAccountsService.getChildAccount(
        selectedChildAccount.id
      );
      return resData.data;
    },
    enabled: !!selectedChildAccount?.id,
    refetchOnMount: false,
  });

  const queryClient = useQueryClient();

  const onNewAccountCreated = async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] });
    setAddChildModalOpened(false);
  };

  if (user && !user?.childAccounts?.length)
    return (
      <Center h="30vh">
        <Modal
          withCloseButton={false}
          opened={addChildModalOpened}
          onClose={() => setAddChildModalOpened(false)}
        >
          <Flex direction="column" gap="lg" align="center">
            <Text size="lg" fw={700}>
              Welcome to Piggi-pal!
            </Text>
            <Text size="md" ta="center">
              This is where you can create an account for your child to track
              his allowance, create tasks for him to accomplish and more
            </Text>
            <Text size="md" ta="center">
              Start by creating a new account with an initial balance.
            </Text>
          </Flex>
          <AddNewChildAccountModal onSubmitCallback={onNewAccountCreated} />
        </Modal>
        <Flex direction="column" align="center" gap="lg">
          <Text>No child account yet. Please create one</Text>
          <ActionButton
            size="md"
            onClick={() => setAddChildModalOpened(true)}
            styles={{
              label: {
                justifyContent: 'center',
                color: defaultColors.accentColor,
                width: '100%',
              },
            }}
          >
            Create new account
          </ActionButton>
        </Flex>
      </Center>
    );

  if (childAccountError) return <OopsPage />;

  if (childAccountPending)
    return (
      <Box className={isMobile ? style.wrapper_mobile : style.wrapper_desktop}>
        <Flex
          direction="column"
          justify="center"
          align="center"
          style={{ height: '40vh' }}
          gap="2rem"
        >
          <Text size="lg" c={defaultColors.primaryColor}>
            Loading your child&apos;s account
          </Text>
          <Loader />
        </Flex>
      </Box>
    );

  return (
    <Box className={isMobile ? style.wrapper_mobile : style.wrapper_desktop}>
      {childAccount ? (
        <SimpleGrid
          className={
            isMobile ? style.account_grid_mobile : style.account_grid_desktop
          }
        >
          <Flex direction="column" className={style.grid_col_header}>
            <NameAndAvatarLine name={childAccount.kidName} />
          </Flex>
          <Flex direction="column" className={style.gridColCurrent}>
            <CurrentSection childAccount={childAccount} />
          </Flex>
          <Flex direction="column" className={style.gridColPeriodics}>
            <SectionHeader
              title="Repeating things"
              center={isMobile}
              icon={<IconCalendarStats color={defaultColors.accentColor} />}
            />
            <PeriodicsSection childAccount={childAccount} />
          </Flex>
          <Flex direction="column" className={style.gridColTasks}>
            <SectionHeader
              title="Tasks you can do"
              center={isMobile}
              icon={<IconClipboardCheck color={defaultColors.accentColor} />}
            />
            <TaskSection childAccount={childAccount} />
          </Flex>
        </SimpleGrid>
      ) : (
        <h1>Nothing here</h1>
      )}
    </Box>
  );
};

export default ChildAccount;
