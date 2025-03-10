import { em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export const useIsMobile = () => {
  const isMobile = useMediaQuery(`(max-width: 450px)`);

  return isMobile;
};

// ${em(900)}
