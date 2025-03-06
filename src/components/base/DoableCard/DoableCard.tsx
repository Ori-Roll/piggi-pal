import { PropsWithChildren } from 'react';
import { Box, Button, Flex } from '@mantine/core';
import { IconCheck, IconEdit } from '@tabler/icons-react';
import chroma from 'chroma-js';
import { useIsMobile } from '@/hooks/configHooks';
import style from './DoableCard.module.css';
import { getTextColorForBackground } from '@/utils/colors';

type DoableCardGeneralProps = {
  cardStyle?: DefaultStyle;
};

type EditableProps = {
  editableDeletable: true;
  checkable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

type CheckableProps = {
  editableDeletable?: boolean;
  checkable: true;
  onCheck?: () => void;
  checking?: boolean;
};

type DoableCardProps<T extends boolean = false> = DoableCardGeneralProps &
  PropsWithChildren<T extends true ? EditableProps : CheckableProps>;

type DefaultStyle = {
  primaryColors: string;
  secondaryColors: string;
  accentColor?: string;
  icon?: string;
};

const defaultStyle: DefaultStyle = {
  primaryColors: '#289ffa',
  secondaryColors: '#3b6fff',
  accentColor: '#ffb43b',
};

const DoableCard = (props: DoableCardProps) => {
  // const { children, checkable, editable, deletable, checking } = props;

  // const onCheck = checkable ? onCheck : undefined;
  // const onEdit = editable ? onEdit : undefined;
  // const onDelete = deletable ? onDelete : undefined;

  const { children, cardStyle = defaultStyle } = props;

  const {
    primaryColors = defaultStyle.primaryColors,
    secondaryColors = defaultStyle.secondaryColors,
    accentColor = defaultStyle.accentColor,
  } = cardStyle;

  const wrapperStyle = chroma(primaryColors).hex();

  const isMobile = useIsMobile();

  // const backgroundColor = chroma(primaryColors)
  //   .brighten(1.8)
  //   .desaturate(1.3)
  //   .hex();

  const backgroundColor = chroma('white').hex();

  return (
    <Box
      className={style.card_wrapper}
      w={isMobile ? '100%' : '20rem'}
      style={{ borderColor: wrapperStyle, backgroundColor }}
    >
      <Flex direction="column">
        <EditButton onEdit={() => {}} backgroundColor={backgroundColor} />
        <Box className={style.card_content}>{children}</Box>
      </Flex>
      <CheckMarkCircle />
    </Box>
  );
};

type CheckMarkCircleProps = {
  checking?: boolean;
  onCheck?: () => void;
  color?: string;
};

const greenButtonColor = '#10d14d';

const CheckMarkCircle = (props: CheckMarkCircleProps) => {
  const { checking, onCheck, color = defaultStyle.primaryColors } = props;

  const foregroundColor = getTextColorForBackground(color);
  const backgroundColor = checking ? chroma(color).desaturate(3).hex() : color; //chroma.scale([color, greenButtonColor]).mode('lch').colors(6)[3];

  return (
    <Button
      onClick={onCheck}
      className={style.checkmark_circle}
      style={{ backgroundColor }}
    >
      <IconCheck
        size="1.6rem"
        height={50}
        className={style.in_icon}
        color={foregroundColor}
        style={{ strokeWidth: '4px' }}
      />
    </Button>
  );
};

type EditButtonProps = {
  onEdit: () => void;
  backgroundColor?: string;
};

const EditButton = (props: EditButtonProps) => {
  const { onEdit, backgroundColor = 'black' } = props;

  const foregroundColor = getTextColorForBackground(backgroundColor);

  return (
    <Button onClick={onEdit} className={style.edit_button}>
      <IconEdit
        className={style.in_icon}
        size="1.5rem"
        color={foregroundColor}
      />
    </Button>
  );
};

export default DoableCard;
