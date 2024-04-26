import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { loadState, storeState, reducer, State, Action } from './model.store';

export const StateContext = createContext<State>({});  // empty default
export const DispatchContext = createContext<React.Dispatch<Action>>(()=>{}); // noop default

const initialState = loadState(window.localStorage);

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    return () => { storeState(state, window.localStorage) };
  }, []);
  
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
