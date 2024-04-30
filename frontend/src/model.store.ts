import { ToDo } from "./services";

export interface State {
  error?: Error;
  isLoading?: boolean;
  message?: string;
  todos?: ToDo[];
}

export type Action = 
  { type: 'LOADING' } |
  { type: 'LOAD_ERROR'; payload: Error } |
  { type: 'LOADED'; payload: ToDo[] };

export function hydrateState(state: State, _localStorage: Storage): State {
  return Object.assign(state, {});
}

export function persistState(_state: State, _localStorage: Storage) {
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADING': return { message: 'Loading...', isLoading: true };
    case 'LOAD_ERROR': return { error: action.payload };
    case 'LOADED': return { todos: action.payload };
    default: return state;
  }
}
