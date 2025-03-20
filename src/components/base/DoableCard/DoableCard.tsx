import { PropsWithChildren, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Loader,
  Modal,
  Space,
  UnstyledButton,
  Text,
  UnstyledButtonProps,
} from '@mantine/core';
import { IconCheck, IconTrash } from '@tabler/icons-react';
import chroma from 'chroma-js';
import style from './DoableCard.module.css';
import { getTextColorForBackground } from '@/utils/colors';
import LayoutCard from '@/components/base/LayoutCard/LayoutCard';
import ActionButton from '@/components/base/ActionButton/ActionButton';

type DoableCardGeneralProps = {
  cardStyle?: DefaultStyle;
  loading?: boolean;
  onDelete?: () => void;
};

type EditableProps<T> = {
  editableDeletable: true;
  checkable?: T;
  onEdit?: () => void;
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
  const { children, cardStyle = defaultStyle, loading, onDelete } = props;

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);

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

  const deleteButtonDeleteColor = chroma('red').desaturate(2).hex();
  const deleteButtonCancelColor = chroma(cardStyle.primaryColors).hex();

  return (
    <LayoutCard>
      {onDelete && (
        <Modal
          opened={deleteModalOpened}
          onClose={function (): void {
            setDeleteModalOpened(false);
          }}
        >
          <h2>Delete this task?</h2>
          <Space h="xl" />
          <Flex justify="center" gap="1rem">
            <ActionButton
              colorAccent={deleteButtonCancelColor}
              onClick={() => {
                setDeleteModalOpened(false);
              }}
            >
              <Text c={deleteButtonCancelColor}>Cancel</Text>
            </ActionButton>
            <ActionButton
              colorAccent={deleteButtonDeleteColor}
              onClick={() => {
                onDelete();
                setDeleteModalOpened(false);
              }}
            >
              <Text c={deleteButtonDeleteColor}>Delete</Text>
            </ActionButton>
          </Flex>
        </Modal>
      )}
      <Flex direction="column">
        {editableDeletable && onDelete && (
          <>
            <DeleteButton
              style={{ alignSelf: 'flex-end' }}
              onDelete={() => setDeleteModalOpened(true)}
              backgroundColor={backgroundColor}
            />
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

type DeleteButtonProps = UnstyledButtonProps & {
  onDelete: () => void;
  backgroundColor?: string;
};

const DeleteButton = (props: DeleteButtonProps) => {
  const { onDelete, backgroundColor = 'black', ...restButtonProps } = props;

  const foregroundColor = getTextColorForBackground(backgroundColor);

  return (
    <UnstyledButton
      className={style.edit_button}
      onClick={onDelete}
      {...restButtonProps}
    >
      <IconTrash
        className={style.in_icon}
        size="1.5rem"
        color={foregroundColor}
      />
    </UnstyledButton>
  );
};

export default DoableCard;
