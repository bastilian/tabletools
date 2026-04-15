import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button, Card, CardBody, Content, Icon } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import filters, {
  customNumberFilter,
  customNumberFilterType,
  customGenresFilter,
  customGenresFilterType,
  title as titleFilter,
} from '~/support/factories/filters';

import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';
import sortSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/sort';
import filtersSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';

import { TableToolsTable, TableStateProvider } from '~/components';
import { useStateCallbacks } from '~/hooks';

const queryClient = new QueryClient();

const statusFilterWithChipIcons = {
  type: conditionalFilterType.checkbox,
  label: 'Raiting',
  filterAttribute: 'raiting',
  items: [
    {
      label: 'Cool',
      value: 'cool',
      icon: (
        <Icon status="success" isInline>
          <CheckCircleIcon />
        </Icon>
      ),
    },
    {
      label: 'Not-cool',
      value: 'not-cool',
      icon: (
        <Icon status="danger" isInline>
          <ExclamationTriangleIcon />
        </Icon>
      ),
    },
    {
      label: 'Not-sure',
      value: 'not-sure',
      icon: (
        <Icon status="info" isInline>
          <QuestionCircleIcon />
        </Icon>
      ),
    },
  ],
};

const defaultOptions = {
  debug: true,
  serialisers: {
    pagination: paginationSerialiser,
    sort: sortSerialiser,
    filters: filtersSerialiser,
  },
};

const meta = {
  title: 'useFilterConfig stories',
  ...defaultStoryMeta,
};

const CustomFiltersExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });
  const { result: { data: genres } = {} } = useExampleDataQuery({
    endpoint: '/api/genres',
  });

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      total={total}
      error={error}
      columns={columns}
      filters={{
        filterConfig: [
          customNumberFilter,
          {
            ...customGenresFilter,
            initialGroups: genres?.map((name) => ({ name })) || [],
          },
        ],
        customFilterTypes: {
          number: customNumberFilterType,
          customGenres: customGenresFilterType,
        },
      }}
      options={{
        ...defaultOptions,
        debug: true,
      }}
    />
  );
};

export const CustomFiltersStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <CustomFiltersExample {...args} />,
};

const SetFilterExample = () => {
  const {
    current: { setFilter },
  } = useStateCallbacks();
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });

  return (
    <>
      <Content>
        <p>This story is to test the `setFilter`</p>
      </Content>
      <Card>
        <CardBody>
          <Button
            onClick={() => {
              setFilter('rating-above', [1]);
            }}
          >
            1
          </Button>
          <Button
            onClick={() => {
              setFilter('rating-above', [2]);
            }}
          >
            2
          </Button>
          <Button
            onClick={() => {
              setFilter('rating-above', [3]);
            }}
          >
            3
          </Button>
          <Button
            onClick={() => {
              setFilter('rating-above', [4]);
            }}
          >
            4
          </Button>
          <Button
            onClick={() => {
              setFilter('rating-above', [5]);
            }}
          >
            5
          </Button>
          <Button
            onClick={() => {
              setFilter('title', ['ghost']);
            }}
          >
            Set title filter to &quot;ghost&quot;
          </Button>
        </CardBody>
      </Card>
      <TableToolsTable
        loading={loading}
        items={data}
        total={total}
        error={error}
        columns={columns}
        filters={{
          filterConfig: filters,
        }}
        options={{
          ...defaultOptions,
        }}
      />
    </>
  );
};

export const SetFilterStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <SetFilterExample {...args} />,
};

const FilterChipsWithIconsExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });

  return (
    <>
      <Content>
        <p>This story is to test the `filterChips` with `icon`</p>
      </Content>
      <TableToolsTable
        loading={loading}
        items={data}
        total={total}
        error={error}
        columns={columns}
        filters={{
          filterConfig: [titleFilter, statusFilterWithChipIcons],
          activeFilters: {
            raiting: ['cool', 'not-sure'],
          },
        }}
        options={{
          ...defaultOptions,
          debug: true,
        }}
      />
    </>
  );
};

export const FilterChipsWithIconsStory = {
  name: 'Filter chips with PatternFly icons',
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <FilterChipsWithIconsExample {...args} />,
};

export default meta;
