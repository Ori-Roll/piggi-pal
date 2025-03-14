import { PropsWithChildren } from 'react';
import {
  Box,
  Button,
  Flex,
  Loader,
  Space,
  UnstyledButton,
} from '@mantine/core';
import { IconCheck, IconPencil } from '@tabler/icons-react';
import chroma from 'chroma-js';
import style from './DoableCard.module.css';
import { getTextColorForBackground } from '@/utils/colors';
import LayoutCard from '@/components/base/LayoutCard/LayoutCard';

type DoableCardGeneralProps = {
  cardStyle?: DefaultStyle;
  loading?: boolean;
};

type EditableProps<T> = {
  editableDeletable: true;
  checkable?: T;
  onEdit?: () => void;
  onDelete?: () => void;
};

type CheckableProps<T> = {
  editableDeletable?: boolean;
  checkable: T;
  onCheck?: () => void;
  checking?: boolean;
  checked?: boolean;
};

type DoableCardProps<T extends boolean> = T extends true
  ? EditableProps<T>
  : CheckableProps<T>;

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

const DoableCard = <T extends boolean>(
  props: PropsWithChildren<DoableCardGeneralProps & DoableCardProps<T>>
) => {
  const { children, cardStyle = defaultStyle, loading } = props;

  const { editableDeletable } = props as PropsWithChildren<
    DoableCardGeneralProps & EditableProps<T>
  >;

  const { onCheck, checked, checking, checkable } = props as PropsWithChildren<
    DoableCardGeneralProps & CheckableProps<T>
  >;

  const {
    primaryColors = defaultStyle.primaryColors,
    secondaryColors = defaultStyle.secondaryColors,
    accentColor = defaultStyle.accentColor,
  } = cardStyle;

  const wrapperStyle = chroma(primaryColors).hex();

  const backgroundColor = chroma('white').hex();

  return (
    <LayoutCard>
      <Flex direction="column">
        {editableDeletable && (
          <>
            <EditButton onEdit={() => {}} backgroundColor={backgroundColor} />
            <Space h="0.4rem" />
          </>
        )}
        <Box className={style.card_content}>{children}</Box>
      </Flex>
      <CheckMarkCircle
        onCheck={onCheck}
        checked={checked}
        checking={checking}
      />
    </LayoutCard>
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
        pointer: checked || disabled ? 'none' : 'cursor',
      }}
      disabled={checked || disabled}
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
    <UnstyledButton className={style.edit_button} onClick={onEdit}>
      <IconPencil
        className={style.in_icon}
        size="1.5rem"
        color={foregroundColor}
      />
    </UnstyledButton>
  );
};

export default DoableCard;
