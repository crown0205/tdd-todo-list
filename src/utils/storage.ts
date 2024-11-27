type Todo = {
  id: number;
  content: string;
  isDone: boolean;
};

const STORAGE_KEY = 'todos';

const loadTodos = () => {
  const todos = localStorage.getItem(STORAGE_KEY);
  return todos ? JSON.parse(todos) : [];
};

const addTodo = (todo: Todo) => {
  const todos = loadTodos();

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...todos, todo]));
};

const deleteTodo = (id: number) => {
  const todos = loadTodos();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(todos.filter((todo: Todo) => todo.id !== id)),
  );
};

const toggleTodo = (id: number) => {
  const todos = loadTodos();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      todos.map((todo: Todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo,
      ),
    ),
  );
};

const clearTodos = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const storage = {
  loadTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
  clearTodos,
};

export { storage };
