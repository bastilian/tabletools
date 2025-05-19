import { useState, useCallback } from 'react';
import { stringToId } from '../helpers';

const useFilterModal = ({ filterConfig, activeFilters, onFilterUpdate }) => {
  const [modalFilter, setModalFilter] = useState();
  const isFilterModalOpen = !!modalFilter;
  const filter = filterConfig.find(
    ({ label }) => stringToId(label) === modalFilter
  );

  const openFilterModal = useCallback((filter) => {
    setModalFilter(filter);
  }, []);

  const closeFilterModal = useCallback(() => {
    setModalFilter(undefined);
  }, []);

  return {
    isFilterModalOpen,
    closeFilterModal,
    openFilterModal,
    filterModalProps: {
      filter,
      isFilterModalOpen,
      activeFilters: activeFilters[modalFilter],
      onChange: (values) =>
        onFilterUpdate(stringToId(filter.label), undefined, values),
      onClose: closeFilterModal,
    },
  };
};

export default useFilterModal;
