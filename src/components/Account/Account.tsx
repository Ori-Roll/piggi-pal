import { useQuery } from '@tanstack/react-query';
import { Account as AccountData } from '@prisma/client';
import { Flex, Grid, Loader } from '@mantine/core';
import { useSelectedAccount } from '@/store/useCurrentAccount';
import accountsService from '@/APIService/accounts';
import { useIsMobile } from '@/hooks/configHooks';
import NothingHere from '@/components/base/NothingHere/NothingHere';
import { CurrentSection } from '@/components/CurrentSection/CurrentSection';
import PeriodicsSection from '@/components/PeriodicsSection/PeriodicsSection';
import OopsPage from '@/components/base/OopsPage/Oops';
import TaskSection from '@/components/TaskSection/TaskSection';
import style from './Account.module.css';

type AccountProps = {};

const Account = (props: AccountProps) => {
  const {} = props;
  const selectedAccount = useSelectedAccount((state) => state?.selectedAccount);
  const isMobile = useIsMobile();

  const {
    data: account,
    isLoading: accountLoading,
    error: accountError,
    isFetching: accountFetching,
  } = useQuery<AccountData | null>({
    queryKey: ['currentAccount', selectedAccount?.id],
    queryFn: async () => {
      if (!selectedAccount?.id) return null;
      const resData = await accountsService.getAccount(selectedAccount.id);
      return resData.data;
    },
    enabled: !!selectedAccount?.id,
    refetchOnMount: false,
  });

  return accountLoading ? (
    <NothingHere>
      <Flex justify="center" align="center" style={{ height: '100%' }}>
        Loading your account
        <Loader />
      </Flex>
    </NothingHere>
  ) : (
    <>
      {account ? (
        <Grid
          className={
            isMobile ? style.gridWrapperMobile : style.gridWrapperDesktop
          }
          p="2rem"
          pt={0}
        >
          <Grid.Col className={style.gridColCurrent}>
            <CurrentSection account={account} />
          </Grid.Col>
          <Grid.Col className={style.gridColPeriodics}>
            <PeriodicsSection account={account} />
          </Grid.Col>

          <Grid.Col className={style.gridColTasks}>
            <TaskSection account={account} />
          </Grid.Col>
        </Grid>
      ) : (
        <h1>Nothing here</h1>
      )}
    </>
  );
};

export default Account;
