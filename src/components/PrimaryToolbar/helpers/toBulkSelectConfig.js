/**
 * Maps bulk select props to FEC PrimaryToolbar `bulkSelect` props.
 *
 *  @param   {object}        [params]                  Bulk select inputs
 *  @param   {boolean}       [params.enableBulkSelect] Whether bulk selection is enabled
 *  @param   {boolean}       [params.loading]          Whether a select-all request is in progress
 *  @param   {string|object} [params.title]            Toolbar title while loading
 *  @param   {number}        [params.selectedIdsTotal] Number of selected items
 *  @param   {boolean}       [params.isDisabled]       Whether the bulk select control is disabled
 *  @param   {Array}         [params.bulkSelectItems]  Dropdown menu items
 *  @param   {boolean|null}  [params.checked]          Checkbox state
 *  @param   {Function}      [params.onToolbarSelect]  Handler for the toolbar checkbox
 *  @returns {object}                                  `{ toolbarProps }` or `{}`
 */
export const toBulkSelectConfig = ({
  enableBulkSelect,
  loading,
  title,
  selectedIdsTotal,
  isDisabled,
  bulkSelectItems,
  checked,
  onToolbarSelect,
} = {}) =>
  enableBulkSelect
    ? {
        toolbarProps: {
          bulkSelect: {
            ...(loading
              ? { toggleProps: { children: [title] } }
              : { count: selectedIdsTotal }),
            isDisabled,
            items: bulkSelectItems,
            checked,
            onSelect: !isDisabled ? onToolbarSelect : undefined,
          },
        },
      }
    : {};
