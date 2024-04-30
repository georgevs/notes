import { useContext, useEffect, useMemo } from 'react';
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

interface Io {
  controller?: AbortController;
  cancelFetch(): void,
  fetch(): void
}

function useIo(): Io | undefined {
  const services = useContext(ServicesContext);
  const dispatch = useContext(DispatchContext);

  const io = useMemo<Io | undefined>(() => (!services ? undefined : {
    cancelFetch() {
      this.controller?.abort();
    },
    fetch() {
      const prevController = this.controller;
      this.controller = new AbortController();
      const { signal } = this.controller;
      prevController?.abort();
      dispatch({ type: 'LOADING' });
      services.datasets!.todos.getAll({ signal })
        .then(todos => { !signal.aborted && dispatch({ type: 'LOADED', payload: todos }) })
        .catch(error => { this.controller!.signal === signal && dispatch({ type: 'LOAD_ERROR', payload: error }) });
    }
  }), [services, dispatch]);

  return io;
}

function ToDoPage() {
  const state = useContext(StateContext);
  const io = useIo();

  useEffect(() => {
    if (io) {
      io.fetch();
      return io.cancelFetch.bind(io);
    }
  }, [io]);

  const { message, error, todos, isLoading } = state;
  const canceled = error?.name === 'AbortError';

  return (
    <>
      {message && <Message message={message} />}
      {error && !canceled && <Message className='error' message={error.message} />}
      {canceled && <Message className='warning' message={'Canceled!'} />}
      {todos && <ToDosList todos={todos} />}
      <div className='actions'>
        {io && !isLoading && <button onClick={io.fetch.bind(io)}>Fetch</button>}
        {isLoading && <button onClick={io!.cancelFetch.bind(io)}>Cancel</button>}
      </div>
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
    <ol className='todos'>
      {todos.map(({ id, text }) => (
        <li key={id}>{text}</li>
      ))}
    </ol>
  );
}
