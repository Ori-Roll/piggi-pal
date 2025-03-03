import { useState } from 'react';
import { AppShell, Burger, Flex } from '@mantine/core';
import { useIsMobile } from '@/hooks/configHooks';
import Navbar from '@/components/Navbar/Navbar';
import ModalsController from '@/components/Modals/ModalsController';
import AppLogo from '@/components/base/AppLogo/AppLogo';
import ChildAccount from '@/components/ChildAccount/ChildAccount';

const DashboardLayout = () => {
  // TODO: put this in store and make the burger work from wherever with a new component
  const [opened, setOpened] = useState(false);

  const toggle = () => setOpened((openedState) => !openedState);

  const isMobile = useIsMobile();

  return (
    <AppShell
      {...(isMobile ? { header: { height: 60 } } : {})}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <ModalsController />
      <AppShell.Header hidden={!isMobile}>
        <Flex align="center" gap="0.5rem" p="0.5rem">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="m"
            size="md"
            m="0.5rem"
          />
          <AppLogo />
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar navBarOpened={opened} toggleNavBarOpened={toggle} />
      </AppShell.Navbar>
      <AppShell.Main>
        <ChildAccount />
      </AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
