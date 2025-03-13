import style from './IconButton.module.css';
import { Button } from '@mantine/core';
import { PropsWithChildren } from 'react';

type IconButtonProps = PropsWithChildren<{
  onClick: () => void;
  backgroundColor?: string;
}>;

const IconButton = (props: IconButtonProps) => {
  const { onClick, backgroundColor = '#fff', children } = props;
  return (
    <Button
      style={{ backgroundColor }}
      onClick={onClick}
      className={style.round_button_wrapper}
    >
      {children}
    </Button>
  );
};

export default IconButton;
