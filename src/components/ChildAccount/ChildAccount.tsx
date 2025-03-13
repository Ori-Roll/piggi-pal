import { useQuery } from '@tanstack/react-query';
import { Box, Flex, Grid, Loader } from '@mantine/core';
import { useSelectedChildAccount } from '@/store/useCurrentChildAccount';
import childAccountsService from '@/APIService/childAccounts';
import { useIsMobile } from '@/hooks/configHooks';
import { CurrentSection } from '@/components/CurrentSection/CurrentSection';
import PeriodicsSection from '@/components/PeriodicsSection/PeriodicsSection';
import OopsPage from '@/components/base/OopsPage/Oops';
import TaskSection from '@/components/TaskSection/TaskSection';
import { ChildAccountWithAllData } from '@/types/dataTypes';
import style from './ChildAccount.module.css';

type ChildAccountProps = {};

const ChildAccount = (props: ChildAccountProps) => {
  const {} = props;
  const selectedChildAccount = useSelectedChildAccount(
    (state) => state?.selectedChildAccount
  );
  const isMobile = useIsMobile();

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

  if (childAccountError) return <OopsPage />;

  if (childAccountPending)
    return (
      <Box className={isMobile ? style.wrapper_mobile : style.wrapper_desktop}>
        <Flex
          direction="column"
          justify="center"
          align="center"
          style={{ height: '100%' }}
        >
          <Flex justify="center" align="center" style={{ height: '100%' }}>
            Loading your child&apos;s account
          </Flex>
          <Loader />
        </Flex>
      </Box>
    );

  return (
    <Box className={isMobile ? style.wrapper_mobile : style.wrapper_desktop}>
      {childAccount ? (
        <Grid
          className={
            isMobile ? style.account_grid_mobile : style.account_grid_desktop
          }
        >
          <Grid.Col className={style.gridColCurrent}>
            <CurrentSection childAccount={childAccount} />
          </Grid.Col>
          <Grid.Col className={style.gridColPeriodics}>
            <PeriodicsSection childAccount={childAccount} />
          </Grid.Col>
          <Grid.Col className={style.gridColTasks}>
            <TaskSection childAccount={childAccount} />
          </Grid.Col>
        </Grid>
      ) : (
        <h1>Nothing here</h1>
      )}
    </Box>
  );
};

export default ChildAccount;
