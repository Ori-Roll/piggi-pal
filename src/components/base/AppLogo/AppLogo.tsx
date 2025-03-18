import { useSelectedChildAccount } from '@/store/useCurrentChildAccount';
import { Text, Title } from '@mantine/core';

type AppLogoProps = {};

const AppLogo = (props: AppLogoProps) => {
  const {} = props;

  const selectedChildAccount = useSelectedChildAccount(
    (state) => state?.selectedChildAccount
  );

  return (
    <Title>
      <Text
        inherit
        variant="gradient"
        gradient={{ from: '#201e61', to: '#3b5096' }}
        w="100%"
        ta="center"
      >
        Hi {selectedChildAccount?.kidName || ''}!
      </Text>
    </Title>
  );
};

export default AppLogo;
