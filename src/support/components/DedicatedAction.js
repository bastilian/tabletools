import React from 'react';
import { Button } from '@patternfly/react-core';
import { useFullTableState } from '~/hooks';

const DedicatedAction = () => {
  const tableState = useFullTableState();
  const { tableState: { selected } = {} } = tableState || {};

  return (
    <Button
      isDisabled={!selected?.length}
      variant="primary"
      ouiaId="Primary"
      onClick={() => alert('Dedicated action clicked')}
    >
      Dedicated Action
    </Button>
  );
};

export default DedicatedAction;
