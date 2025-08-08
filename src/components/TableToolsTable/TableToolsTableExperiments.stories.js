import React, { useCallback, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Card, CardBody, Spinner, Button, Label } from '@patternfly/react-core';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';
import sortSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/sort';
import filtersSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';

import { TableToolsTable, TableStateProvider } from '~/components';
import { useFullTableState, useStateCallbacks } from '~/hooks';

const queryClient = new QueryClient();

const defaultOptions = {
  serialisers: {
    pagination: paginationSerialiser,
    sort: sortSerialiser,
    filters: filtersSerialiser,
  },
};

const meta = {
  title: 'TableToolsTable Experiments',
  ...defaultStoryMeta,
};

const ContextExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({ endpoint: '/api', useTableState: true });

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      total={total}
      error={error}
      columns={columns}
      options={defaultOptions}
    />
  );
};

const ContextExampleWrapper = () => {
  return (
    <TableStateProvider>
      <ContextExample />
    </TableStateProvider>
  );
};

const ContextExampleSecondWrapper = () => {
  const fullTableState = useFullTableState();

  useEffect(() => {
    console.log(
      'Even though there are multiple TableStateProviders in between the highest should always be the one with access',
      fullTableState,
    );
  }, [fullTableState]);

  return (
    <TableStateProvider>
      <ContextExampleWrapper />
    </TableStateProvider>
  );
};

// This story is to test that it is possible to "raise" the context
// The TableStateProvider is implemented to only insert itself into the stack if there is not already a tablecontext available.
// The TableStateProvider in here is still the primary one accessed in ContextExampleSecondWrapper
export const ContextStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <ContextExampleSecondWrapper {...args} />,
};

// This is an example for a table with bulk selection where the preselection is loaded from an API
// NOTE: the `selected` option it *not* "reactive", meaning if it changes, the selection will *not* be updated
// Therefore the `TableToolsTable` should not be rendered before the selection is loaded.
const BulkSelectExample = () => {
  const { loading: selectionLoading, result: selection } = useExampleDataQuery({
    endpoint: '/api/selection',
  });
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
    itemIdsInTable,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });
  const {
    current: { resetSelection, setSelection },
  } = useStateCallbacks();
  const fullTableState = useFullTableState() || {};

  const onSelect = useCallback((selection) => {
    console.log('Current Selection', selection);
  }, []);

  return selectionLoading ? (
    <Spinner />
  ) : (
    <>
      <Card>
        <CardBody>
          <Button
            variant="primary"
            ouiaId="Primary"
            onClick={() => resetSelection()}
          >
            Reset Selection
          </Button>
          <Button
            variant="primary"
            ouiaId="Primary"
            onClick={() => setSelection(data.map(({ id }) => id))}
          >
            Select only page
          </Button>
          <Label>
            Selected items in context:{' '}
            {fullTableState?.tableState?.selected?.length}
          </Label>
        </CardBody>
      </Card>
      <br />
      <TableToolsTable
        loading={loading}
        items={data}
        total={total}
        error={error}
        columns={columns}
        options={{
          ...defaultOptions,
          debug: true,
          onSelect,
          itemIdsInTable,
          selected: selection,
        }}
      />
    </>
  );
};

export const BulkSelectStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <BulkSelectExample {...args} />,
};

export default meta;
