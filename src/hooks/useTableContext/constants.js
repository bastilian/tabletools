import { createContext } from 'react';

/**
 * This context is used to hold the state for various hooks and allows access to it by wrapping the component in a {@link TableStateProvider}
 *
 *  @returns {object} Table state context
 *
 */
export const TableContext = createContext();
