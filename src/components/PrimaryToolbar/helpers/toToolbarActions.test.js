import { toToolbarActions } from './toToolbarActions';

describe('toToolbarActions', () => {
  it('returns nothing if no actions are given', () => {
    expect(toToolbarActions({})).toEqual({});
  });

  it('prepends an empty/undefined "firstAction"', () => {
    expect(
      toToolbarActions({
        actions: ['exaple-action'],
      }).toolbarProps.actionsConfig.actions[0],
    ).toBeUndefined();
  });

  it('it uses the firstAction if set in options', () => {
    const firstAction = () => 'first-action';

    expect(
      toToolbarActions({
        actions: ['example-action'],
        firstAction,
      }).toolbarProps.actionsConfig.actions[0],
    ).toBeDefined();
  });
});
