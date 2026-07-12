import React from 'react';
import propTypes from 'prop-types';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const QueryProviderWithUtilities = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

QueryProviderWithUtilities.propTypes = {
  children: propTypes.node,
};

export default QueryProviderWithUtilities;
