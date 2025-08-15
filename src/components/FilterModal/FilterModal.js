import React, { useCallback, useState } from 'react';
import propTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@patternfly/react-core';

import {
  TableToolsTable,
  TableStateProvider,
  StaticTableToolsTable,
} from '~/components';

import useFetchItems from './hooks/useFetchItems';
import { convertToSelectValues, convertToFilterValues } from './helpers';
import { filterOption, filterGroup } from './columns';
import filters from './filters';

const FilterModal = ({
  isFilterModalOpen,
  filter,
  onClose,
  activeFilters,
  onChange,
  setAsyncItems,
  tableOptions,
}) => {
  const items = filter.modal?.items || filter.items;
  const isAsync = typeof (filter.modal?.items || filter.items) === 'function';
  const TableComponent = isAsync ? TableToolsTable : StaticTableToolsTable;

  const title = filter?.modal?.title || `Filter by ${filter.label}`;
  const defaultColumns =
    filter.type === 'group' ? [filterOption, filterGroup] : [filterOption];
  const {
    modal: { columns = defaultColumns, applyLabel = 'Apply selected' } = {},
  } = filter;

  const fetchItems = useFetchItems({
    items,
    filter,
    setAsyncItems,
  });
  const [selectedFilterValues, setSelectedFilterValues] =
    useState(activeFilters);

  const selected = convertToSelectValues(activeFilters, filter);

  const onSelect = useCallback(
    (values) => setSelectedFilterValues(convertToFilterValues(values, filter)),
    [filter],
  );

  return (
    <Modal
      variant="medium"
      isOpen={isFilterModalOpen}
      onClose={() => {
        onClose?.();
      }}
    >
      <ModalHeader title={title} />
      <ModalBody>
        <TableComponent
          variant="compact"
          items={
            isAsync
              ? fetchItems
              : items.map((item) => ({
                  ...item,
                  id: item.label,
                }))
          }
          columns={columns}
          filters={{
            filterConfig: filters,
          }}
          options={{
            selected,
            onSelect,
            ...tableOptions,
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          key="confirm"
          variant="primary"
          onClick={() => {
            onChange?.(selectedFilterValues);
            onClose?.();
          }}
        >
          {applyLabel}
        </Button>
        <Button
          key="cancel"
          variant="link"
          onClick={() => {
            onClose?.();
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

FilterModal.propTypes = {
  filter: propTypes.object,
  activeFilters: propTypes.array,
  onChange: propTypes.func,
  isFilterModalOpen: propTypes.bool,
  onClose: propTypes.func,
  setAsyncItems: propTypes.func,
  tableOptions: propTypes.object,
};

/**
 * Component used to provide a modal for filters that have the modal enabled
 *
 *  @returns {React.ReactElement}
 *
 *  @group Components
 *
 */
const FilterModalWithProvider = (props) => {
  // TODO Pass down "primary table" state

  return (
    <TableStateProvider isNewContext>
      <FilterModal {...props} />
    </TableStateProvider>
  );
};

export default FilterModalWithProvider;
