import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import { Notifications } from '@mantine/notifications';
import queryClient from '@/config/queryClient';
import theme from '@/config/mantine';
import ErrorBoundary from '@/components/base/providers/ErrorBoundary';
import FontProvider from './FontProvider';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import MetaProvider from './MetaProvider';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <MetaProvider>
      <ErrorBoundary>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme}>
              <FontProvider>
                <Notifications />
                {children}
              </FontProvider>
            </MantineProvider>
          </QueryClientProvider>
        </SessionProvider>
      </ErrorBoundary>
    </MetaProvider>
  );
};

export default Providers;
