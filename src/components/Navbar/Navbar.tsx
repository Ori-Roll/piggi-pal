import { Flex, Burger, Text } from '@mantine/core';
import { signOut } from 'next-auth/react';
import { useEditMode } from '@/store/useEditMode';
import { useIsMobile } from '@/hooks/configHooks';
import { useSelectedChildAccount } from '@/store/useCurrentChildAccount';
import ChildAccountSelect from '@/components/ChildAccountSelect/ChildAccountSelect';
import AddTask from '@/components/AddTask/AddTask';
import LockWithPin from '@/components/base/LockWithPin/LockWithPin';
import AddPeriodic from '@/components/AddPeriodic/AddPeriodic';
import ActionButton from '@/components/base/ActionButton/ActionButton';
import { IconPower } from '@tabler/icons-react';

type NavbarProps = {
  navBarOpened: boolean;
  toggleNavBarOpened: () => void;
};

const Navbar = (props: NavbarProps) => {
  const { navBarOpened, toggleNavBarOpened } = props;

  const editMode = useEditMode((state) => state.edit);
  const isMobile = useIsMobile();
  const selectedChildAccount = useSelectedChildAccount(
    (state) => state?.selectedChildAccount
  );

  return (
    <Flex
      h="100%"
      w="100%"
      direction="column"
      justify="space-between"
      align="center"
      p="2rem"
    >
      <Flex
        h="100%"
        w="100%"
        direction="column"
        justify="flex-start"
        gap="50px"
        align="center"
      >
        <Burger
          opened={navBarOpened}
          onClick={toggleNavBarOpened}
          hidden={!isMobile}
          size="md"
          visibleFrom="md"
        />

        <Flex
          direction="column"
          justify="flex-start"
          align="center"
          w="100%"
          gap={10}
        >
          <ChildAccountSelect />
          {editMode && selectedChildAccount && (
            <>
              <AddTask selectedChildAccount={selectedChildAccount} />
              <AddPeriodic selectedChildAccount={selectedChildAccount} />
            </>
          )}
        </Flex>
      </Flex>
      <Flex direction="row" justify="center" align="center" h={'100%'}>
        <LockWithPin />
      </Flex>
      <ActionButton
        onClick={() => signOut()}
        rightSection={<IconPower size="2rem" />}
      >
        <Text>Sign Out</Text>
      </ActionButton>
    </Flex>
  );
};

export default Navbar;
