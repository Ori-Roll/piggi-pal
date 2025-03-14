import { IconLego } from '@tabler/icons-react';
import { Flex, Text } from '@mantine/core';
import style from './NameAndAvatarLine.module.css';
import { defaultColors } from '@/utils/colors';

type NameAndAvatarLineProps = {
  name: string;
  imageUrl?: string;
};

function NameAndAvatarLine(props: NameAndAvatarLineProps) {
  const { name, imageUrl } = props;

  return (
    <Flex
      direction="row"
      align="center"
      gap="md"
      style={{ borderColor: defaultColors.primaryColor }}
      className={style.custom_wrapper}
    >
      <IconLego color={defaultColors.accentColor} />
      <Text c={defaultColors.secondaryColor}>Hi {name || ''}!</Text>
    </Flex>
  );
}

export default NameAndAvatarLine;
