import { useContext } from 'react';

import { TableContext } from './constants';

const useTableContext = () => {
  const tableContext = useContext(TableContext);

  return tableContext;
};

export default useTableContext;
