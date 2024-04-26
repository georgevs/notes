import { ToDo } from "./services";

export interface State {
  message?: string;
  error?: Error;
  todos?: ToDo[];
}

export type Action = 
  { type: 'LOADING' } |
  { type: 'LOAD_ERROR'; payload: Error } |
  { type: 'LOADED'; payload: ToDo[] };

export function loadState(_localStorage: Storage): State {
  return {};
}

export function storeState(_state: State, _localStorage: Storage) {
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADING': return { message: 'Loading...' };
    case 'LOAD_ERROR': return { error: action.payload };
    case 'LOADED': return { todos: action.payload };
    default: return state;
  }
}
