import { useMemo } from 'react';

import { toToolbarActions } from '../../PrimaryToolbar/helpers/toToolbarActions';
import { toExportConfig } from '../../PrimaryToolbar/helpers/toExportConfig';
import { toPaginationConfig } from '../../PrimaryToolbar/helpers/toPaginationConfig';
import { toBulkSelectConfig } from '../../PrimaryToolbar/helpers/toBulkSelectConfig';
import { toFilterToolbarConfig } from '../../PrimaryToolbar/helpers/toFilterToolbarConfig';
import { toRadioSelectTableProps } from '../helpers/toRadioSelectTableProps';
import { toSortTableProps } from '../helpers/toSortTableProps';
import { toExpandableTableProps } from '../helpers/toExpandableTableProps';
import { toBulkSelectTableProps } from '../helpers/toBulkSelectTableProps';
import { toTableViewTableProps } from '../helpers/toTableViewTableProps';
import { toTableViewToolbarProps } from '../helpers/toTableViewToolbarProps';
import { toTableViewToggleProps } from '../../PrimaryToolbar/helpers/toTableViewToggleProps';
import { toColumnManagerAction } from '../../PrimaryToolbar/helpers/toColumnManagerAction';

/**
 * Adapter: assemble useTableTools building blocks into deprecated PatternFly table props.
 *
 *  @param   {object}           tableToolsProps                          Output from useTableTools (plus presentation extras)
 *  @param   {string}           [tableToolsProps.view]                   Current table view
 *  @param   {boolean}          [tableToolsProps.loading]                Loading state
 *  @param   {Array}            [tableToolsProps.columns]                Managed column definitions
 *  @param   {object}           [tableToolsProps.treeTable]              Tree table config
 *  @param   {object}           [tableToolsProps.tableHeaderProps]       Props for TableHeader
 *  @param   {object}           [tableToolsProps.tableBodyProps]         Props for TableBody
 *  @param   {object}           [tableToolsProps.tableViewToggleProps]   Props for TableViewToggle
 *  @param   {object}           [tableToolsProps.toolbarPropsOption]     Consumer toolbar props
 *  @param   {object}           [tableToolsProps.tablePropsOption]       Consumer table props
 *  @param   {Function|boolean} [tableToolsProps.actionResolver]         Row action resolver
 *  @param   {object}           [tableToolsProps.dedicatedAction]        Primary/dedicated toolbar action
 *  @param   {Array}            [tableToolsProps.toolbarActions]         Toolbar actions
 *  @param   {object}           [tableToolsProps.columnManager]          Column manager building blocks
 *  @param   {object}           [tableToolsProps.pagination]             Pagination props
 *  @param   {object}           [tableToolsProps.conditionalFilterProps] Filter toolbar slice
 *  @param   {object}           [tableToolsProps.bulkSelect]             Bulk select props
 *  @param   {object}           [tableToolsProps.expandable]             Expandable props
 *  @param   {object}           [tableToolsProps.radioSelect]            Radio-select props
 *  @param   {object}           [tableToolsProps.tableSort]              Sort props
 *  @param   {object}           [tableToolsProps.tableViewToolbarProps]  Table-view toolbar slice
 *  @param   {object}           [tableToolsProps.tableViewTableProps]    Table-view table slice
 *  @param   {boolean}          [tableToolsProps.exportIsDisabled]       Whether export is disabled
 *  @param   {Function}         [tableToolsProps.exportWithFormat]       Export runner
 *  @returns {object}                                                    Props ready for DeprecatedTable presentation
 *
 *  @group Hooks
 */
const useTableToolsForDeprecatedTable = ({
  view,
  loading,
  columns,
  treeTable,
  tableHeaderProps,
  tableBodyProps,
  toolbarPropsOption,
  tablePropsOption,
  actionResolver,
  dedicatedAction,
  toolbarActions,
  columnManager,
  pagination,
  filters,
  bulkSelect,
  expandable,
  radioSelect,
  tableSort,
  tableView,
  exportIsDisabled,
  exportWithFormat,
}) => {
  const actionsWithColumnManager = useMemo(() => {
    const columnManagerAction = toColumnManagerAction(columnManager);

    return [
      ...(toolbarActions || []),
      ...(columnManagerAction ? [columnManagerAction] : []),
    ];
  }, [toolbarActions, columnManager]);

  const toolbarActionsProps = useMemo(
    () =>
      toToolbarActions({
        firstAction: dedicatedAction,
        actions: actionsWithColumnManager,
      }).toolbarProps,
    [dedicatedAction, actionsWithColumnManager],
  );

  const exportToolbarProps = useMemo(
    () =>
      toExportConfig({
        isDisabled: exportIsDisabled,
        exportWithFormat,
      }).toolbarProps,
    [exportIsDisabled, exportWithFormat],
  );

  const paginationToolbarProps = useMemo(
    () => toPaginationConfig(pagination).toolbarProps,
    [pagination],
  );

  const filterToolbarProps = useMemo(
    () => toFilterToolbarConfig(filters).toolbarProps,
    [filters],
  );

  const bulkSelectToolbarProps = useMemo(
    () => toBulkSelectConfig(bulkSelect).toolbarProps,
    [bulkSelect],
  );

  const radioSelectTableProps = useMemo(
    () => toRadioSelectTableProps(radioSelect),
    [radioSelect],
  );

  const sortableTableProps = useMemo(
    () => toSortTableProps(tableSort),
    [tableSort],
  );

  const expandableTableProps = useMemo(
    () => toExpandableTableProps(expandable),
    [expandable],
  );

  const bulkSelectTableProps = useMemo(
    () => toBulkSelectTableProps(bulkSelect),
    [bulkSelect],
  );

  const tableViewTableProps = useMemo(
    () => toTableViewTableProps(tableView),
    [tableView],
  );

  const tableViewToolbarProps = useMemo(
    () => toTableViewToolbarProps(tableView).toolbarProps,
    [tableView],
  );

  const tableViewToggleProps = useMemo(
    () => toTableViewToggleProps(tableView),
    [tableView],
  );

  const toolbarProps = useMemo(
    () => ({
      ...toolbarActionsProps,
      ...paginationToolbarProps,
      ...filterToolbarProps,
      ...bulkSelectToolbarProps,
      ...exportToolbarProps,
      ...toolbarPropsOption,
      ...tableViewToolbarProps,
    }),
    [
      toolbarActionsProps,
      paginationToolbarProps,
      filterToolbarProps,
      bulkSelectToolbarProps,
      exportToolbarProps,
      toolbarPropsOption,
      tableViewToolbarProps,
    ],
  );

  const tableProps = useMemo(
    () => ({
      // TODO we should have a hook that maintains columns.
      // at least the columns manager and table sort hook "act" on columns, currently without a good interface
      cells: columns,
      ...sortableTableProps,
      ...bulkSelectTableProps,
      ...expandableTableProps,
      ...tablePropsOption,
      onSelect: bulkSelectTableProps?.onSelect || tablePropsOption?.onSelect,
      ...radioSelectTableProps,
      actionResolver,
      ...tableViewTableProps,
    }),
    [
      columns,
      sortableTableProps,
      bulkSelectTableProps,
      expandableTableProps,
      tablePropsOption,
      radioSelectTableProps,
      actionResolver,
      tableViewTableProps,
    ],
  );

  return {
    view,
    loading,
    toolbarProps,
    tableProps,
    treeTable,
    columns,
    tableHeaderProps,
    tableBodyProps,
    tableViewToggleProps,
  };
};

export default useTableToolsForDeprecatedTable;
