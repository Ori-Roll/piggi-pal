import { useState } from 'react';
import { AppShell, Burger, Flex } from '@mantine/core';
import { useIsMobile } from '@/hooks/configHooks';
import Navbar from '@/components/Navbar/Navbar';
import ModalsController from '@/components/Modals/ModalsController';
import AppLogo from '@/components/base/AppLogo/AppLogo';
import ChildAccount from '@/components/ChildAccount/ChildAccount';
import style from './Dashboard.module.css';

const DashboardLayout = () => {
  // TODO: put this in store and make the burger work from wherever with a new component
  const [burgered, setBurgered] = useState(false);

  const toggle = () => setBurgered((openedState) => !openedState);

  const isMobile = useIsMobile();

  return (
    <AppShell
      {...(isMobile ? { header: { height: 60 } } : {})}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !burgered },
      }}
    >
      <ModalsController />
      <AppShell.Header hidden={!isMobile}>
        <Flex align="center" gap="0.5rem" p="0.5rem">
          <Burger
            opened={burgered}
            onClick={toggle}
            hiddenFrom="m"
            size="md"
            m="0.5rem"
          />
          <AppLogo />
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar navBarOpened={burgered} toggleNavBarOpened={toggle} />
      </AppShell.Navbar>
      <AppShell.Main className={style.main_wrapper}>
        <ChildAccount />
      </AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
