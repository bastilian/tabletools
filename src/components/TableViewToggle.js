import React from 'react';
import propTypes from 'prop-types';
import { ToggleGroup, ToggleGroupItem, Icon } from '@patternfly/react-core';

/**
 * Component used when more than 1 view type is available for a table
 *
 *  @returns {React.ReactElement}
 *
 *  @group Components
 *
 */
const TableViewToggle = ({ views, onToggle, currentTableView }) => (
  <ToggleGroup>
    {Object.entries(views).map(([key, { icon: ToggleIcon }]) => (
      <ToggleGroupItem
        key={key}
        icon={
          <Icon>
            <ToggleIcon />
          </Icon>
        }
        aria-label={key}
        isSelected={currentTableView === key}
        onChange={() => onToggle(key)}
      />
    ))}
  </ToggleGroup>
);

TableViewToggle.propTypes = {
  views: propTypes.object,
  onToggle: propTypes.function,
  currentTableView: propTypes.string,
};

export default TableViewToggle;
