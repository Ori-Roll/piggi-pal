import {
  Box,
  BoxComponentProps,
  PolymorphicComponentProps,
} from '@mantine/core';
import style from './LayoutCard.module.css';
import { PropsWithChildren } from 'react';
import { CardStyle } from '@prisma/client';
import { defaultColors } from '@/utils/colors';
import chroma from 'chroma-js';

type LayoutCardProps = PropsWithChildren<{
  cardStyle?: CardStyle;
  loading?: boolean;
  boxProps?: PolymorphicComponentProps<any, BoxComponentProps>;
}>;

const LayoutCard = (props: LayoutCardProps) => {
  const { children, cardStyle = defaultColors, loading, boxProps } = props;

  const {
    primaryColor = defaultColors.primaryColor,
    secondaryColor = defaultColors.secondaryColor,
    accentColor = defaultColors.accentColor,
  } = cardStyle;

  const wrapperStyle = chroma(primaryColor).hex();

  const backgroundColor = chroma('white').hex();

  return (
    <Box
      className={style.card_wrapper}
      {...boxProps}
      style={{
        borderColor: wrapperStyle,
        backgroundColor,
        opacity: loading ? 0.5 : 1,
        pointerEvents: loading ? 'none' : 'auto',
        ...boxProps?.style,
      }}
    >
      {children}
    </Box>
  );
};

export default LayoutCard;
