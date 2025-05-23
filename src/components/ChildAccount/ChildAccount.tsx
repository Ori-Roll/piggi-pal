import { useQuery } from '@tanstack/react-query';
import { Box, Flex, Loader, SimpleGrid, Text } from '@mantine/core';
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
import style from './ChildAccount.module.css';
import NoChildAccounts from './NoChildAccounts';

type ChildAccountProps = {};

const ChildAccount = (props: ChildAccountProps) => {
  const {} = props;

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

  if (user && !user?.childAccounts?.length) return <NoChildAccounts />;

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
