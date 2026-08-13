/**
 * Maps export props to FEC PrimaryToolbar `exportConfig` props.
 *
 *  @param   {object}   [params]                  Export inputs
 *  @param   {boolean}  [params.isDisabled]       Whether export is disabled
 *  @param   {Function} [params.exportWithFormat] Export runner
 *  @returns {object}                             `{ toolbarProps }` or `{}`
 */
export const toExportConfig = ({ isDisabled, exportWithFormat } = {}) =>
  exportWithFormat
    ? {
        toolbarProps: {
          exportConfig: {
            isDisabled,
            onSelect: (_, format) => exportWithFormat(format),
          },
        },
      }
    : {};
