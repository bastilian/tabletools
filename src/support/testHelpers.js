import React from 'react';
import TableStateProvider from '~/components/TableStateProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const createTestWrapper = (Wrapper, props) => {
  return function CreatedWrapper({ children }) { // eslint-disable-line
    return (
      <QueryClientProvider client={queryClient}>
        <Wrapper {...props}>{children}</Wrapper>
      </QueryClientProvider>
    );
  };
};

export const DEFAULT_RENDER_OPTIONS = {
  wrapper: createTestWrapper(TableStateProvider),
};
