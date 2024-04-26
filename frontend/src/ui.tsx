import { useContext, useEffect } from 'react';
import { ServicesProvider, ServicesContext } from './ui.services-context';
import { StoreProvider, StateContext, DispatchContext } from './ui.store-context';
import { ToDo } from './services';

export default function App() {
  return (
    <ServicesProvider>
      <StoreProvider>
        <ToDoPage />
      </StoreProvider>
    </ServicesProvider>
  );
}

function ToDoPage() {
  const services = useContext(ServicesContext);
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    let canceled = false;
    const controller = new AbortController();
    if (services) {
      dispatch({ type: 'LOADING' });
      services.datasets!.todos.get({ signal: controller.signal })
        .then(todos => { !canceled && dispatch({ type: 'LOADED', payload: todos }) })
        .catch(error => { !canceled && dispatch({ type: 'LOAD_ERROR', payload: error }) });
    }
    return () => { canceled = true; controller.abort() }
  }, [services]);
  
  const { message, error, todos } = state;
  
  return (
    <>
      {message && <Message message={message} />}
      {error && <Message className='error' message={error.message} />}
      {todos && <ToDosList todos={todos} />}
    </>
  );
}

interface MessageProps {
  className?: string;
  message: string;
}

function Message({ className, message }: MessageProps) {
  return (
    <p className={['message', className].join(' ')}>{message}</p>
  );
}

interface ToDosListProps {
  todos: ToDo[];
}
function ToDosList({ todos }: ToDosListProps) {
  return (
    <ul className='todos'>
      {todos.map(({ id, text }) => (
        <li key={id}>{text}</li>
      ))}
    </ul>
  );
}
