import { Center, Loader } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
// import OopsPage from '../../../components/base/OopsPage/Oops';
import { selectCurrentAccount } from '@/utils/generalDataUtils';
import { useSelectedAccount } from '@/store/useCurrentAccount';
import { User, Account } from '@prisma/client';
import { useUserQuery } from '@/hooks/query/user';
import { PropsWithChildren } from 'react';

type PrivateRouteProps = PropsWithChildren<{}>;

const redirectPath = '/login'; //TODO: Move this to a config file or envs or something

const BasicDataLoader = (props: PrivateRouteProps) => {
  const { children } = props;

  const queryClient = useQueryClient(); // To update the query cache
  const setSelectedAccount = useSelectedAccount(
    (state) => state?.setSelectedAccount
  );

  const updateCurrentAccountData = (data: User) => {
    data.accounts.forEach((account: Account) => {
      queryClient.setQueryData(['currentAccount', account.id], account);
    });

    const currentAccount = selectCurrentAccount(data, data.accounts);
    if (currentAccount) {
      setSelectedAccount?.(currentAccount);
    }
  };

  const {
    data: user,
    isLoading,
    isFetching,
    // error,
  } = useUserQuery(updateCurrentAccountData);

  //   const navigate = useNavigate();

  //   if (error) {
  //     navigate(redirectPath);
  //   }

  // TODO: Fix logic here, and then remove the something is wrong div

  return (
    <>
      {isFetching && (
        <Loader style={{ position: 'absolute', top: '50px', right: '50px' }} />
      )}
      {isLoading && !isFetching ? (
        <Center>
          <Loader />
        </Center>
      ) : null}
      <div>!</div>
      {!isLoading && !isFetching && !user ? (
        <>
          <h2>{isLoading && 'isLoading'}</h2>
          <h2>{isFetching && 'isFetching'}</h2>
          <p>{user && JSON.stringify(user)}</p>
          <h1>Something is wrong</h1>
        </>
      ) : (
        // <OopsPage />

        children
      )}
    </>
  );
};

export default BasicDataLoader;
