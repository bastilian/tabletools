import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@patternfly/react-core';

import { toDataViewToolbarActions } from './toDataViewToolbarActions';

describe('toDataViewToolbarActions', () => {
  const DedicatedAction = () => (
    <Button variant="primary">Dedicated Action</Button>
  );

  it('renders dedicatedAction as its own button', () => {
    render(
      toDataViewToolbarActions({
        actions: { dedicatedAction: DedicatedAction },
      }),
    );

    expect(
      screen.getByRole('button', { name: 'Dedicated Action' }),
    ).toBeInTheDocument();
  });

  it('maps string-label actions into ResponsiveActions overflow menu', () => {
    render(
      toDataViewToolbarActions({
        actions: {
          toolbarActions: [{ label: 'Action', onClick: jest.fn() }],
        },
      }),
    );

    expect(
      screen.getByRole('button', { name: 'Actions overflow menu' }),
    ).toBeInTheDocument();
  });

  it('maps column manager into ResponsiveActions overflow menu', () => {
    render(
      toDataViewToolbarActions({
        columnManager: {
          enableColumnManager: true,
          label: 'Manage columns',
          openColumnManager: jest.fn(),
        },
      }),
    );

    expect(
      screen.getByRole('button', { name: 'Actions overflow menu' }),
    ).toBeInTheDocument();
  });

  it('does not render column manager action when disabled', () => {
    render(
      toDataViewToolbarActions({
        columnManager: { enableColumnManager: false },
      }),
    );

    expect(
      screen.queryByRole('button', { name: 'Actions overflow menu' }),
    ).not.toBeInTheDocument();
  });

  it('renders element-label actions without ResponsiveAction wrapping', () => {
    render(
      toDataViewToolbarActions({
        actions: {
          toolbarActions: [
            {
              label: (
                <Button variant="link" onClick={jest.fn()}>
                  Link action
                </Button>
              ),
            },
          ],
        },
      }),
    );

    expect(
      screen.getByRole('button', { name: 'Link action' }),
    ).toBeInTheDocument();
  });
});
