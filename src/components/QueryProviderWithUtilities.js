import React from 'react';
import propTypes from 'prop-types';
import { QueryClientProvider } from '@tanstack/react-query';

import { DEFAULT_QUERY_CLIENT } from './constants';

const QueryProviderWithUtilities = ({
  queryClient = DEFAULT_QUERY_CLIENT,
  children,
  ...props
}) => (
  <QueryClientProvider client={queryClient} {...props}>
    {children}
  </QueryClientProvider>
);

QueryProviderWithUtilities.propTypes = {
  children: propTypes.node,
  queryClient: propTypes.object,
};

export default QueryProviderWithUtilities;
