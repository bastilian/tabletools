import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Modal, Button } from '@patternfly/react-core';

import { TableToolsTable, TableStateProvider } from '~/components';

import { filterOption, filterGroup } from './columns';
import { convertToSelectValues, convertToFilterValues } from './helpers';

import useFetchItems from './hooks/useFetchItems';

const FilterModal = ({
  isFilterModalOpen,
  filter,
  onClose,
  activeFilters,
  onChange,
}) => {
  const title = filter?.modal?.title || `Filter by ${filter.label}`;
  const defaultColumns =
    filter.type === 'group' ? [filterOption, filterGroup] : [filterOption];
  const {
    modal: { columns = defaultColumns, applyLabel = 'Apply selected' } = {},
  } = filter;

  const [selectedFilterValues, setSelectedFilterValues] =
    useState(activeFilters);

  // TODO Replace this with using the "StaticTableToolsTable" instead for cases where there is no function to fetch
  const fetchItems = useFetchItems(filter);
  const preselected = convertToSelectValues(activeFilters, filter);
  console.log(preselected);

  return (
    <Modal
      variant="medium"
      title={title}
      isOpen={isFilterModalOpen}
      footer={
        <>
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
        </>
      }
      onClose={() => {
        onClose?.();
      }}
    >
      <TableToolsTable
        variant="compact"
        items={fetchItems}
        columns={columns}
        options={{
          preselected,
          onSelect: (values) =>
            setSelectedFilterValues(convertToFilterValues(values, filter)),
        }}
      />
    </Modal>
  );
};

FilterModal.propTypes = {
  filter: propTypes.object,
  activeFilters: propTypes.array,
  onChange: propTypes.func,
  isFilterModalOpen: propTypes.bool,
  onClose: propTypes.func,
};

const FilterModalWithProvider = (props) => {
  // TODO Pass down "primary table" state

  return (
    <TableStateProvider>
      <FilterModal {...props} />
    </TableStateProvider>
  );
};

export default FilterModalWithProvider;
