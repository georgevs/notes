import React, { createContext, useReducer, useEffect, ReactNode, useRef } from 'react';
import { hydrateState, persistState, reducer, State, Action } from './model.store';

export const StateContext = createContext<State>({});
export const DispatchContext = createContext<React.Dispatch<Action>>(() => {});

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [state, dispatch] = useReducer(reducer, {}, (initialState) => {
    return hydrateState(initialState, window.localStorage);
  });
  const ref = useRef<State | undefined>();
  
  useEffect(() => {
    ref.current = state;
  }, [state]);
  
  useEffect(() => {
    function commitState() {
      if (ref.current) {
        persistState(ref.current, window.localStorage);
        ref.current = undefined;
      }
    };
    window.addEventListener('beforeunload', commitState);
    document.addEventListener('visibilitychange', commitState);
    return () => {
      window.removeEventListener('beforeunload', commitState);
      document.removeEventListener('visibilitychange', commitState);
      commitState();
    };
  }, []);
  
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
