import { em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export const useIsMobile = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(900)})`);

  return isMobile;
};
