import { Center, Loader } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
// import OopsPage from '../../../components/base/OopsPage/Oops';
import { selectCurrentChildAccount } from '@/utils/generalDataUtils';
import { useSelectedChildAccount } from '@/store/useCurrentChildAccount';
import { User, ChildAccount } from '@prisma/client';
import { useUserQuery } from '@/hooks/query/user';
import { PropsWithChildren } from 'react';

type PrivateRouteProps = PropsWithChildren<{}>;

const redirectPath = '/login'; //TODO: Move this to a config file or envs or something

const BasicDataLoader = (props: PrivateRouteProps) => {
  const { children } = props;

  const queryClient = useQueryClient(); // To update the query cache
  const setSelectedChildAccount = useSelectedChildAccount(
    (state) => state?.setSelectedChildAccount
  );

  const updateCurrentChildAccountData = (data: User) => {
    data.childAccounts.forEach((childAccount: ChildAccount) => {
      queryClient.setQueryData(
        ['currentChildAccount', childAccount.id],
        childAccount
      );
    });

    const currentChildAccount = selectCurrentChildAccount(
      data,
      data.childAccounts
    );
    if (currentChildAccount) {
      setSelectedChildAccount?.(currentChildAccount);
    }
  };

  const {
    data: user,
    isLoading,
    isFetching,
    // error,
  } = useUserQuery(updateCurrentChildAccountData);

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
