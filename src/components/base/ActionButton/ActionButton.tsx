import { PropsWithChildren } from 'react';
import { Button, ButtonProps, PolymorphicComponentProps } from '@mantine/core';
import style from './ActionButton.module.css';

type ActionButtonProps<C = 'button'> = PolymorphicComponentProps<
  C,
  ButtonProps
> &
  PropsWithChildren<{
    onClick?: () => void;
    colorAccent?: string;
    ref?: React.Ref<HTMLButtonElement>;
  }>;

const ActionButton = (props: ActionButtonProps) => {
  const { children, colorAccent, ref, ...restProps } = props;

  const { style: propsStyle, ...restPropsWithoutStyle } = restProps;

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
              minHeight: '3.2rem',
              ...propsStyle,
            }
          : {
              minHeight: '3.2rem',
              ...propsStyle,
            }),
      }}
      styles={{
        label: {
          width: '100%',
        },
      }}
      ref={ref}
      {...restPropsWithoutStyle}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
