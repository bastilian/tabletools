import DataViewTable from './DataViewTable';
import { QueryClient } from '@tanstack/react-query';

import DeprecatedTable from './DeprecatedTable';

export const variants = {
  table: DeprecatedTable,
  dataViewTable: DataViewTable,
};

export const DEFAULT_QUERY_CLIENT = new QueryClient();
