import { PropsWithChildren } from 'react';
import { Box, Button, Flex, Loader } from '@mantine/core';
import { IconCheck, IconEdit } from '@tabler/icons-react';
import chroma from 'chroma-js';
import { useIsMobile } from '@/hooks/configHooks';
import style from './DoableCard.module.css';
import { getTextColorForBackground } from '@/utils/colors';

type DoableCardGeneralProps = {
  cardStyle?: DefaultStyle;
  loading?: boolean;
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
  checked?: boolean;
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
  const {
    children,
    cardStyle = defaultStyle,
    onCheck,
    checked,
    checking,
    loading,
  } = props;

  const {
    primaryColors = defaultStyle.primaryColors,
    secondaryColors = defaultStyle.secondaryColors,
    accentColor = defaultStyle.accentColor,
  } = cardStyle;

  const wrapperStyle = chroma(primaryColors).hex();

  const backgroundColor = chroma('white').hex();

  return (
    <Box
      className={style.card_wrapper}
      style={{
        borderColor: wrapperStyle,
        backgroundColor,
        opacity: loading ? 0.5 : 1,
        pointerEvents: loading ? 'none' : 'auto',
      }}
    >
      <Flex direction="column">
        <EditButton onEdit={() => {}} backgroundColor={backgroundColor} />
        <Box className={style.card_content}>{children}</Box>
      </Flex>
      <CheckMarkCircle
        onCheck={onCheck}
        checked={checked}
        checking={checking}
      />
    </Box>
  );
};

type CheckMarkCircleProps = {
  checking?: boolean;
  checked?: boolean;
  onCheck?: () => void;
  color?: string;
  disabled?: boolean;
};

const CheckMarkCircle = (props: CheckMarkCircleProps) => {
  const {
    checking,
    checked,
    onCheck,
    color = defaultStyle.primaryColors,
    disabled,
  } = props;

  const foregroundColor = getTextColorForBackground(color);
  const backgroundColor = chroma('white').hex(); //chroma.scale([color, greenButtonColor]).mode('lch').colors(6)[3];
  const backgroundColorChecked = color;

  return (
    <Button
      onClick={onCheck}
      className={style.checkmark_circle}
      style={{
        backgroundColor: checked ? backgroundColorChecked : backgroundColor,
        borderColor: color,
      }}
      disabled={disabled}
    >
      {checking ? (
        <Loader color={foregroundColor} />
      ) : (
        checked && (
          <IconCheck
            size="1.6rem"
            height={50}
            className={style.in_icon}
            color={foregroundColor}
            style={{ strokeWidth: '4px' }}
          />
        )
      )}
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
