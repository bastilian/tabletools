import { useMemo } from 'react';

import { toToolbarActions } from '../../PrimaryToolbar/helpers/toToolbarActions';

/**
 * Adapter: assemble useTableTools building blocks into deprecated PatternFly
 * Table + FEC PrimaryToolbar props.
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
 *  @param   {Array}            [tableToolsProps.toolbarActions]         Toolbar actions (domain)
 *  @param   {object}           [tableToolsProps.paginationToolbarProps] Pagination toolbar slice
 *  @param   {object}           [tableToolsProps.conditionalFilterProps] Filter toolbar slice
 *  @param   {object}           [tableToolsProps.bulkSelectToolbarProps] Bulk-select toolbar slice
 *  @param   {object}           [tableToolsProps.bulkSelectTableProps]   Bulk-select table slice
 *  @param   {object}           [tableToolsProps.expandableTableProps]   Expandable table slice
 *  @param   {object}           [tableToolsProps.radioSelectTableProps]  Radio-select table slice
 *  @param   {object}           [tableToolsProps.sortableTableProps]     Sort table slice
 *  @param   {object}           [tableToolsProps.tableViewToolbarProps]  Table-view toolbar slice
 *  @param   {object}           [tableToolsProps.tableViewTableProps]    Table-view table slice
 *  @param   {object}           [tableToolsProps.exportToolbarProps]     Export toolbar slice
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
  tableViewToggleProps,
  toolbarPropsOption,
  tablePropsOption,
  actionResolver,
  dedicatedAction,
  toolbarActions,
  paginationToolbarProps,
  conditionalFilterProps,
  bulkSelectToolbarProps,
  bulkSelectTableProps,
  expandableTableProps,
  radioSelectTableProps,
  sortableTableProps,
  tableViewToolbarProps,
  tableViewTableProps,
  exportToolbarProps,
}) => {
  const toolbarActionsProps = useMemo(
    () =>
      toToolbarActions({
        firstAction: dedicatedAction,
        actions: toolbarActions,
      }).toolbarProps,
    [dedicatedAction, toolbarActions],
  );

  const toolbarProps = useMemo(
    () => ({
      ...toolbarActionsProps,
      ...paginationToolbarProps,
      ...conditionalFilterProps,
      ...bulkSelectToolbarProps,
      ...exportToolbarProps,
      ...toolbarPropsOption,
      ...tableViewToolbarProps,
    }),
    [
      toolbarActionsProps,
      paginationToolbarProps,
      conditionalFilterProps,
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
