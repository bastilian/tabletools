import { useMemo } from 'react';

/**
 * Adapter: reshape useTableTools output for the deprecated PatternFly Table.
 *
 *  @param   {object}  tableToolsProps                        Output from useTableTools (plus extras from parent)
 *  @param   {string}  [tableToolsProps.view]                 Current table view
 *  @param   {boolean} [tableToolsProps.loading]              Loading state
 *  @param   {object}  [tableToolsProps.toolbarProps]         Toolbar props from useTableTools
 *  @param   {object}  [tableToolsProps.tableProps]           PatternFly table props from useTableTools
 *  @param   {object}  [tableToolsProps.treeTable]            Tree table config
 *  @param   {Array}   [tableToolsProps.columns]              Column definitions
 *  @param   {object}  [tableToolsProps.tableHeaderProps]     Props for TableHeader
 *  @param   {object}  [tableToolsProps.tableBodyProps]       Props for TableBody
 *  @param   {object}  [tableToolsProps.tableViewToggleProps] Props for TableViewToggle
 *  @returns {object}                                         Props ready for DeprecatedTable presentation
 *
 *  @group Hooks
 */
const useTableToolsForDeprecatedTable = ({
  view,
  loading,
  toolbarProps,
  tableProps,
  treeTable,
  columns,
  tableHeaderProps,
  tableBodyProps,
  tableViewToggleProps,
}) =>
  useMemo(
    () => ({
      view,
      loading,
      toolbarProps,
      tableProps,
      treeTable,
      columns,
      tableHeaderProps,
      tableBodyProps,
      tableViewToggleProps,
    }),
    [
      view,
      loading,
      toolbarProps,
      tableProps,
      treeTable,
      columns,
      tableHeaderProps,
      tableBodyProps,
      tableViewToggleProps,
    ],
  );

export default useTableToolsForDeprecatedTable;
