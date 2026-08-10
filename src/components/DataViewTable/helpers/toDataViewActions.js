import React from 'react';
import { Button } from '@patternfly/react-core';

export const toDataViewActions = (actions) =>
  (actions || []).filter(Boolean).map((action, i) => {
    console.log('DEBUG: action', action);
    if (React.isValidElement(action)) {
      return <React.Fragment key={i}>{action}</React.Fragment>;
    }
    const { label, onClick } = action;
    return typeof label === 'string' ? (
      <Button key={i} variant="secondary" onClick={onClick}>
        {label}
      </Button>
    ) : (
      <React.Fragment key={i}>{label}</React.Fragment>
    );
  });
