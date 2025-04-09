# Table Tools

The "Table Tools" are a collection of hooks and components to build tables based on the PatternFly (v4) [`Table`](https://www.patternfly.org/components/table/react-deprecated) component and the Red Hat Insights [`PrimaryToolbar`](https://github.com/RedHatInsights/frontend-components/blob/master/packages/components/doc/primary_toolbar.md) component.

It provides implementations and state management for several features and provides a context to access the state to request/provide data to show on the table.

**Supported [`PrimaryToolbar`](https://github.com/RedHatInsights/frontend-components/blob/master/packages/components/doc/primary_toolbar.md) features**

 * pagination - {@link Main.usePagination usePagination}
 * exportConfig - {@link Main.useExport useExport}
 * bulkSelect - {@link Main.useBulkSelect useBulkSelect}
 * column management - {@link Main.useColumnManager useColumnManager}
 * filterConfig & activeFiltersConfig - {@link Main.useFilterConfig useFilterConfig}
 * toolbar actions

**Supported [`Table`](https://www.patternfly.org/components/table/react-deprecated) feature**

 * sorting columns - {@link Main.useTableSort useTableSort}
 * selectable rows - {@link Main.useBulkSelect useBulkSelect}
 * radio selectable rows - {@link Main.useRadioSelect useRadioSelect}
 * expandable rows - {@link Main.useTableView useTableView}
 * TreeTable - {@link Main.useTableView useTableView}
 * EmptyState - {@link Main.useTableView useTableView}

# Install

```sh
$ npm install bastilian-tabletools
```
