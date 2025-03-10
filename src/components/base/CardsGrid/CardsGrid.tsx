import { SimpleGrid } from '@mantine/core';
import { useIsMobile } from '@/hooks/configHooks';
import NothingHere from '@/components/base/NothingHere/NothingHere';
import style from './CardsGrid.module.css';

type CardsGridProps = React.PropsWithChildren<{
  emptyMessage?: string;
}>;

const CardsGrid = (props: CardsGridProps) => {
  const { emptyMessage, children } = props;

  const isMobile = useIsMobile();

  if (emptyMessage) {
    return <NothingHere>{emptyMessage}</NothingHere>;
  }

  const gridStyleAdded = isMobile
    ? {
        width: '100%',
        gridGap: '2rem',
      }
    : {
        gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))',
        gridGap: '2rem 1rem',
      };

  return (
    <SimpleGrid className={style.wrapper} style={gridStyleAdded}>
      {children}
    </SimpleGrid>
  );
};

export default CardsGrid;
