import { useMemo } from 'react';
import deepmerge from 'deepmerge';

import { compileWithDefaults, collectDefaultsAndProps } from '../helpers';

const useWithDefaults = (props) => {
  const result = useMemo(() => {
    const { props: allProps, defaults: allDefaults } =
      collectDefaultsAndProps(props);
    const columns = compileWithDefaults(
      allDefaults.columns || [],
      allProps.columns,
    );

    const filters = {
      ...allDefaults.filters,
      ...allProps.filters,
      filterConfig: compileWithDefaults(
        allDefaults.filters?.filterConfig,
        allProps.filters?.filterConfig,
      ),
    };

    const options = deepmerge(
      allDefaults.options || {},
      allProps.options || {},
    );

    const result = {
      ...allProps,
      columns,
      filters,
      options,
    };

    if (result.options?.debug) {
      console.group('Table with defaults');
      console.log('Props:', props);
      console.log('Combined props:', allProps);
      console.log('Combined defaults:', allDefaults);
      console.log('Result:', result);
      console.groupEnd();
    }

    return result;
  }, [props]);

  return result;
};

export default useWithDefaults;
