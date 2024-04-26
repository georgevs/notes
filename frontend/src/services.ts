import { BadStateError } from "./utils";

export default class Services {
  datasets?: Db.Datasets;

  async init(): Promise<Services> {
    const [remoteDb, localDb] = await Promise.all([
      new Db.Remote.Db().init(),
      new Db.Local.Db(window.indexedDB).open()
    ])
    this.datasets = new Db.Datasets(remoteDb, localDb);
    return this;
  }
}

export namespace Db {

  export class Datasets {
    todos: Remote.ToDos;

    constructor(remoteDb: Remote.Db, _localDb: Local.Db) {
      this.todos = new Remote.ToDos(remoteDb);
    }
  }

  export namespace Local {

    export class Db {
      static name = 'ToDos';
  
      db?: IDBDatabase;
  
      constructor(public indexedDb: IDBFactory) { }
      
      async open(): Promise<Db> {
        const upgrade = (db: IDBDatabase, _event: IDBVersionChangeEvent) => {
          db.createObjectStore(ToDos.storeName, { autoIncrement: true, keyPath: 'id' });
        };
        this.db = await new Promise((resolve, reject) => {
          const req = this.indexedDb.open(Db.name, 1);
          req.onerror = () => { reject(req.error) };
          req.onsuccess = () => { resolve(req.result) };
          req.onupgradeneeded = (event) => { upgrade(req.result, event) };
        });
        return this;
      }
  
      async get<T>(storeName: string): Promise<T[]> {
        const { db } = this;
        if (!db) { throw new BadStateError() }
        return new Promise((resolve, reject) => {
          const tr = db.transaction([storeName], 'readonly');
          tr.onerror = () => { reject(tr.error) };
          const store = tr.objectStore(storeName);
          const req = store.getAll();
          req.onsuccess = () => { resolve(req.result) };
        });
      }
      
      async put<T>(values: T[], storeName: string): Promise<void> {
        const { db } = this;
        if (!db) { throw new BadStateError() }
        return new Promise((resolve, reject) => {
          const tr = db.transaction(ToDos.storeName, 'readwrite');
          tr.onerror = () => { reject(tr.error) };
          tr.oncomplete = () => { resolve() };
          const store = tr.objectStore(storeName);
          values.forEach(value => { store.put(value) });
        });
      }

      async delete(ids: number[], storeName: string): Promise<void> {
        const { db } = this;
        if (!db) { throw new BadStateError() }
        return new Promise((resolve, reject) => {
          const tr = db.transaction([storeName], 'readwrite');
          tr.onerror = () => { reject(tr.error) };
          tr.oncomplete = () => { resolve() };
          const store = tr.objectStore(storeName);
          ids.forEach(id => { store.delete(id) });
        });
      }
    }
  
    export class ToDos {
      static storeName = 'ToDos';
      constructor(public db: Db) { }
      
      get(): Promise<ToDo[]> { 
        return this.db.get(ToDos.storeName);
      }

      put(values: ToDo[]) {
        return this.db.put(values, ToDos.storeName);
      }
    }
  }

  export namespace Remote {
    
    export class Db {
      async init() { // TODO
        return this;
      }

      async get<T>(url: string, options?: RequestInit): Promise<T> {
        const response = await fetch(url, options);
        if (!response.ok) { throw new Error(response.statusText) }
        return await response.json();
      }
    }
  
    export class ToDos {
      constructor(public db: Db) {}

      get(options?: RequestInit): Promise<ToDo[]> {
        return this.db.get('./data/todos.json', options);
      }
    }
  }
}

export interface ToDo { 
  id: number; 
  text: string; 
}
