import { useCallback, useMemo } from 'react';

import { DEFAULT_ITEMS_STATES_FOR_PARAMS } from '../constants';
import {
  defaultItemsSelect,
  defaultExporterSelect,
  defaultItemIdsInTableSelect,
  pickStatesForParams,
  removeEmptyKeys,
} from '../helpers';

const useTableQueries = ({
  queryClient,
  queryKey,
  query,
  queryTotalBatched,
  itemsStatesForParams = DEFAULT_ITEMS_STATES_FOR_PARAMS,
  itemsSelect = defaultItemsSelect,
  exporterSelect = defaultExporterSelect,
  itemIdsInTableSelect = defaultItemIdsInTableSelect,
  itemIdsOnPageSelect = defaultItemIdsInTableSelect,
  extraParams: {
    exporter: exporterParams,
    itemIdsInTable: itemIdsInTableParams,
  } = {},
}) => {
  const items = useCallback(
    async (serialisedTableState, tableState) => {
      const params = removeEmptyKeys(
        serialisedTableState
          ? serialisedTableState
          : tableState && pickStatesForParams(tableState, itemsStatesForParams),
      );

      return itemsSelect(await query(params));
    },
    [query, itemsStatesForParams, itemsSelect],
  );

  const exporter = useCallback(
    async () => exporterSelect(await queryTotalBatched(exporterParams)),
    [queryTotalBatched, exporterSelect, exporterParams],
  );

  const itemIdsInTable = useCallback(
    async () =>
      itemIdsInTableSelect(await queryTotalBatched(itemIdsInTableParams)),
    [queryTotalBatched, itemIdsInTableSelect, itemIdsInTableParams],
  );

  const itemIdsOnPage = useMemo(
    () => itemIdsOnPageSelect(queryClient.getQueryData(queryKey) || {}),
    [queryKey, queryClient, itemIdsOnPageSelect],
  );

  return {
    items,
    exporter,
    itemIdsInTable,
    itemIdsOnPage,
  };
};

export default useTableQueries;
