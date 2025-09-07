import React, { useCallback, useEffect, useMemo, useState } from 'react';
import propTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Card,
  CardBody,
  Spinner,
  Button,
  Label,
  Slider,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@patternfly/react-core';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import filters, { title, genre } from '~/support/factories/filters';
import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';
import sortSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/sort';
import filtersSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';

import { TableToolsTable, TableStateProvider } from '~/components';
import { useFullTableState, useStateCallbacks, useItemsData } from '~/hooks';

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
const BulkSelectExample = ({ enablePreselection }) => {
  const [totalItems, setTotal] = useState(2048);

  const { loading: selectionLoading, result: selection } = useExampleDataQuery({
    endpoint: '/api/selection',
    enabled: enablePreselection,
  });

  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
    itemIdsInTable,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
    params: {
      total: totalItems,
    },
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
          <Slider
            value={totalItems}
            max={2048}
            onChange={(_event, value) => setTotal(value)}
          />
        </CardBody>
      </Card>
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
          ...(enablePreselection ? { selected: selection } : {}),
        }}
      />
    </>
  );
};

BulkSelectExample.propTypes = {
  enablePreselection: propTypes.bool,
};

export const BulkSelectStory = {
  args: {
    enablePreselection: false,
  },
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

const AllEmptyExample = () => {
  const { loading } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });

  return (
    <TableToolsTable
      loading={loading}
      items={[]}
      total={0}
      columns={columns}
      options={{
        ...defaultOptions,
        debug: true,
        tableTree: [],
        enableTreeView: true,
        defaultTableView: 'tree',
      }}
    />
  );
};

export const AllEmptyStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <AllEmptyExample {...args} />,
};

const CyclicColumnsIssueExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });

  const dynamicColumn = useMemo(() => {
    return {
      ...columns[0],
      title: (
        <>
          <strong>Yolo</strong>
        </>
      ),
    };
  }, []);

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={[dynamicColumn, ...columns.slice(1)]}
      options={defaultOptions}
    />
  );
};

export const CyclicColumnsIssueStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <CyclicColumnsIssueExample {...args} />,
};

// Modal component with isolated table context
const DetailsModal = ({ isOpen, onClose, rowData }) => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });

  const modalTableState = useFullTableState();

  useEffect(() => {
    if (modalTableState?.tableState?.filters) {
      console.log('Modal table filters:', modalTableState.tableState.filters);
    }
    if (modalTableState?.parentContext) {
      console.log(
        'Parent context available in modal:',
        modalTableState.parentContext,
      );
    }
  }, [modalTableState?.tableState?.filters, modalTableState?.parentContext]);

  return (
    <Modal variant="large" isOpen={isOpen} onClose={onClose}>
      <ModalHeader title={`Details for: ${rowData?.title || 'Item'}`} />
      <ModalBody>
        <Card style={{ marginBottom: '1rem' }}>
          <CardBody>
            <Label color="blue">
              Modal Table State:{' '}
              {JSON.stringify(modalTableState?.tableState?.filters || {})}
            </Label>
            <br />
            <Label color="purple">
              Parent Context Available:{' '}
              {modalTableState?.parentContext ? 'Yes' : 'No'}
              {modalTableState?.parentContext && (
                <>
                  {' '}
                  - Parent Filters:{' '}
                  {JSON.stringify(
                    modalTableState.parentContext.state?.[0]?.tableState
                      ?.filters || {},
                  )}
                </>
              )}
            </Label>
          </CardBody>
        </Card>
        <TableToolsTable
          loading={loading}
          items={data}
          total={total}
          error={error}
          columns={columns.slice(0, 3)} // Show fewer columns in modal
          filters={{
            filterConfig: [title, genre], // Simple filters for modal
          }}
          options={{
            ...defaultOptions,
            debug: true,
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button key="close" variant="primary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

DetailsModal.propTypes = {
  isOpen: propTypes.bool,
  onClose: propTypes.func,
  rowData: propTypes.object,
};

// Main table with nested context isolation example
const NestedContextIsolationExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });

  const mainTableState = useFullTableState();

  useEffect(() => {
    if (mainTableState?.tableState?.filters) {
      console.log('Main table filters:', mainTableState.tableState.filters);
    }
  }, [mainTableState?.tableState?.filters]);

  const openModal = useCallback((rowData) => {
    setSelectedRow(rowData);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRow(null);
  }, []);

  const enhancedColumns = useMemo(
    () => [
      ...columns,
      {
        title: 'Actions',
        props: { width: 10 },
        // eslint-disable-next-line react/prop-types
        Component: ({ rowData }) => (
          <Button variant="link" onClick={() => openModal(rowData)} size="sm">
            View Details
          </Button>
        ),
      },
    ],
    [openModal],
  );

  return (
    <>
      <Card style={{ marginBottom: '1rem' }}>
        <CardBody>
          <Label color="green">
            Main Table State:{' '}
            {JSON.stringify(mainTableState?.tableState?.filters || {})}
          </Label>
          <br />
          <small>
            This demonstrates isolated table contexts with parent context
            access. The modal table has its own isolated state but can still
            access the parent table&apos;s context. Filtering in either table
            won&apos;t affect the other.
          </small>
        </CardBody>
      </Card>

      <TableToolsTable
        loading={loading}
        items={data}
        total={total}
        error={error}
        columns={enhancedColumns}
        filters={{
          filterConfig: filters.slice(0, 4),
        }}
        options={{
          ...defaultOptions,
          debug: true,
        }}
      />

      {/* Modal with isolated table context using isNewContext */}
      <TableStateProvider isNewContext={true}>
        <DetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          rowData={selectedRow}
        />
      </TableStateProvider>
    </>
  );
};

export const NestedContextIsolationStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <NestedContextIsolationExample {...args} />,
};

const DedicatedDeleteAction = () => {
  const { items } = useItemsData();
  const tableState = useFullTableState();
  const { tableState: { selected } = {} } = tableState || {};
  const itemsToDelete = items?.filter(({ id }) => selected.includes(id)) || [];

  return (
    <Button
      isDisabled={itemsToDelete?.length === 0}
      variant="primary"
      ouiaId="Primary"
      onClick={() => alert('Dedicated action clicked')}
    >
      {itemsToDelete.length === 1
        ? `Only ${itemsToDelete[0].title} to delete`
        : `${selected?.length || 0} items to delete`}
    </Button>
  );
};

const AccessItemsExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      total={total}
      error={error}
      columns={columns}
      options={{
        ...defaultOptions,
        onSelect: true,
        dedicatedAction: DedicatedDeleteAction,
      }}
    />
  );
};

export const AccessItemsStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <AccessItemsExample {...args} />,
};

export default meta;
