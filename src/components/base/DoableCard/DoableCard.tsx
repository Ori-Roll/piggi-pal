import { PropsWithChildren } from 'react';
import { Box, Button, useMantineTheme } from '@mantine/core';
import { IconCheck, IconEdit } from '@tabler/icons-react';
import { useIsMobile } from '@/hooks/configHooks';
import style from './DoableCard.module.css';

type EditableDeletableProps = {
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

type DoableCardProps = PropsWithChildren<
  EditableDeletableProps | CheckableProps
>;

const DoableCard = (props: DoableCardProps) => {
  // const { children, checkable, editable, deletable, checking } = props;

  // const onCheck = checkable ? onCheck : undefined;
  // const onEdit = editable ? onEdit : undefined;
  // const onDelete = deletable ? onDelete : undefined;

  const { children } = props;

  const isMobile = useIsMobile();

  return (
    <Box className={style.card_wrapper} w={isMobile ? '100%' : '20rem'}>
      <EditButton onEdit={() => {}} />
      {children}
      <CheckMarkCircle />
    </Box>
  );
};

type CheckMarkCircleProps = {
  checking?: boolean;
  onCheck?: () => void;
};

const CheckMarkCircle = (props: CheckMarkCircleProps) => {
  const { checking, onCheck } = props;

  const theme = useMantineTheme();

  return (
    <Button onClick={onCheck} className={style.checkmark_circle}>
      <IconCheck
        size="2rem"
        className={style.in_icon}
        color={checking ? theme.colors.gray[5] : theme.colors.green[5]}
      />
    </Button>
  );
};

type EditButtonProps = {
  onEdit: () => void;
};

const EditButton = (props: EditButtonProps) => {
  const { onEdit } = props;

  const theme = useMantineTheme();
  return (
    <Button onClick={onEdit} className={style.edit_button}>
      <IconEdit
        className={style.in_icon}
        size="1.5rem"
        color={theme.colors.gray[7]}
      />
    </Button>
  );
};

export default DoableCard;
