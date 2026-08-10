import React from 'react';
import { DataViewState } from '@patternfly/react-data-view';
import {
  SkeletonTableBody,
  SkeletonTableHead,
} from '@patternfly/react-component-groups';

import { getDefaultEmptyBodyState, getErrorBodyState } from './bodyStates';

const DEFAULT_SKELETON_ROWS = 10;

export const getDataViewStateProps = ({
  loading,
  error,
  rows,
  columns,
  emptyState,
  perPage,
}) => {
  let activeState;

  if (loading) {
    activeState = DataViewState.loading;
  } else if (error) {
    activeState = DataViewState.error;
  } else if (!rows?.length) {
    activeState = DataViewState.empty;
  }

  return {
    activeState,
    headStates: {
      loading: <SkeletonTableHead columns={columns} />,
    },
    bodyStates: {
      loading: (
        <SkeletonTableBody
          rowsCount={perPage || DEFAULT_SKELETON_ROWS}
          columnsCount={columns.length}
        />
      ),
      error: getErrorBodyState(columns.length),
      empty: emptyState || getDefaultEmptyBodyState(columns),
    },
  };
};
