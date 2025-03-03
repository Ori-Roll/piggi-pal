import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import queryClient from '@/config/queryClient';
import theme from '@/config/mantine';
import ErrorBoundary from '@/components/base/providers/ErrorBoundary';

const Providers = ({ children }: { children: ReactNode }) => {
  try {
    return (
      <ErrorBoundary>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme}>
              <Notifications />
              {children}
            </MantineProvider>
          </QueryClientProvider>
        </SessionProvider>
      </ErrorBoundary>
    );
  } catch (e) {
    console.log('ERROOOOORRRR', e);
  }
};

export default Providers;
