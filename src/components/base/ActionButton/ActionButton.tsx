import { PropsWithChildren } from 'react';
import { Button, ButtonProps } from '@mantine/core';
import style from './ActionButton.module.css';

type ActionButtonProps = ButtonProps &
  PropsWithChildren<{
    onClick?: () => void;
    colorAccent?: string;
    ref?: React.Ref<HTMLButtonElement>;
  }>;

const ActionButton = (props: ActionButtonProps) => {
  const { children, colorAccent, ref, ...restProps } = props;

  return (
    <Button
      size="lg"
      variant="transparent"
      w="100%"
      justify="space-between"
      className={style.custom_action_button}
      style={{
        ...(colorAccent
          ? {
              borderColor: colorAccent,
            }
          : {}),
      }}
      ref={ref}
      {...restProps}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
