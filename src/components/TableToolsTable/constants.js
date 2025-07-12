import { QueryClient } from '@tanstack/react-query';

import { ComposableTable, Table, Toolbar } from './components';

export const variants = {
  table: {
    TableComponent: Table,
    ToolbarComponent: Toolbar,
  },
  composable: {
    TableComponent: ComposableTable,
    ToolbarComponent: Toolbar,
  },
};

export const queryClient = new QueryClient();
