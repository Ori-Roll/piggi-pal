import { Flex, Text } from '@mantine/core';
import { ForwardRefExoticComponent, RefAttributes, useState } from 'react';
import style from './SectionHeader.module.css';
import { defaultColors } from '@/utils/colors';
import { Icon, IconProps } from '@tabler/icons-react';

type SectionHeaderWithDropdownProps = {
  withDropdown: true;
  onDropdownOpen: () => void;
  onDropdownClose: () => void;
};

type SectionHeaderWithoutDropdownProps = {
  withDropdown?: false;
};

type SectionHeaderProps = (
  | SectionHeaderWithDropdownProps
  | SectionHeaderWithoutDropdownProps
) & {
  title: string;
  center?: boolean;
  icon?: React.ReactNode;
};

function SectionHeader(props: SectionHeaderProps) {
  const { withDropdown, onDropdownOpen, onDropdownClose } =
    (props as SectionHeaderWithDropdownProps) || {};
  const { title, center, icon } = props;

  const [dropdownOpened, setDropdownOpened] = useState(true);

  return (
    <Flex
      justify="flex-start"
      align={center ? 'center' : 'flex-start'}
      w="100%"
      gap="0.8rem"
      className={style.wrapper}
      p="1rem 0.2rem"
    >
      {icon ? icon : null}
      <Text size="xl" fw={400} c={defaultColors.primaryColor}>
        {title}
      </Text>
    </Flex>
  );
}

export default SectionHeader;
