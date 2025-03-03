import { Text, Title } from '@mantine/core';

type AppLogoProps = {};

const AppLogo = (props: AppLogoProps) => {
  const {} = props;

  return (
    <Title>
      <Text
        inherit
        variant="gradient"
        gradient={{ from: '#201e61', to: '#3b5096' }}
        w="100%"
        ta="center"
      >
        BananaBank
      </Text>
    </Title>
  );
};

export default AppLogo;
