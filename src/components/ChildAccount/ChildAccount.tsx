import { useQuery } from '@tanstack/react-query';
import { ChildAccount as ChildAccountData } from '@prisma/client';
import { Flex, Grid, Loader } from '@mantine/core';
import { useSelectedChildAccount } from '@/store/useCurrentChildAccount';
import childAccountsService from '@/APIService/childAccounts';
import { useIsMobile } from '@/hooks/configHooks';
import NothingHere from '@/components/base/NothingHere/NothingHere';
import { CurrentSection } from '@/components/CurrentSection/CurrentSection';
import PeriodicsSection from '@/components/PeriodicsSection/PeriodicsSection';
import OopsPage from '@/components/base/OopsPage/Oops';
import TaskSection from '@/components/TaskSection/TaskSection';
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
    isLoading: childAccountLoading,
    error: childAccountError,
    isFetching: childAccountFetching,
  } = useQuery<ChildAccountData | null>({
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

  return childAccountLoading ? (
    <NothingHere>
      <Flex justify="center" align="center" style={{ height: '100%' }}>
        Loading your child&apos;s account
        <Loader />
      </Flex>
    </NothingHere>
  ) : (
    <>
      {childAccount ? (
        <Grid
          className={
            isMobile ? style.gridWrapperMobile : style.gridWrapperDesktop
          }
          p="2rem"
          pt={0}
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
    </>
  );
};

export default ChildAccount;
