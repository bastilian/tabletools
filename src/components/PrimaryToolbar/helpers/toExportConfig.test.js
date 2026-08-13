import { toExportConfig } from './toExportConfig';

describe('toExportConfig', () => {
  it('returns nothing if exportWithFormat is missing', () => {
    expect(toExportConfig({})).toEqual({});
  });

  it('maps export data to FEC exportConfig toolbar props', () => {
    const exportWithFormat = jest.fn();

    expect(
      toExportConfig({
        isDisabled: true,
        exportWithFormat,
      }),
    ).toEqual({
      toolbarProps: {
        exportConfig: {
          isDisabled: true,
          onSelect: expect.any(Function),
        },
      },
    });
  });

  it('forwards the selected format to exportWithFormat', () => {
    const exportWithFormat = jest.fn();
    const { toolbarProps } = toExportConfig({ exportWithFormat });

    toolbarProps.exportConfig.onSelect(null, 'csv');

    expect(exportWithFormat).toHaveBeenCalledWith('csv');
  });
});
