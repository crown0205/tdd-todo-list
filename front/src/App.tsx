import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import useGetTodos from './hooks/queries/useGetTodos';
import useMutateCreateTodo from './hooks/queries/useMutateCreateTodo';
import useMutateRemoveCompletedTodos from './hooks/queries/useMutateRemoveCompletedTodos';
import useMutateTodoDelete from './hooks/queries/useMutateTodoDelete';
import useMutateToggleTodo from './hooks/queries/useMutateToggle';

function App() {
  const { data: todos = [] } = useGetTodos();
  const { mutate: createTodo } = useMutateCreateTodo();
  const { mutate: toggleTodo } = useMutateToggleTodo();
  const { mutate: deleteTodo } = useMutateTodoDelete();
  const { mutate: removeCompletedTodos } = useMutateRemoveCompletedTodos();

  const handleToggleTodo = (id: number) => {
    toggleTodo(id);
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
  };

  const handleRemoveCompletedTodos = () => {
    removeCompletedTodos();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            할 일 목록{' '}
            <span className="text-sm text-gray-500" data-testid="todo-count">
              ({todos.length})
            </span>
          </h1>

          <button
            className="bg-gray-500 text-white px-2 py-1 rounded disabled:opacity-50 text-[12px]"
            onClick={handleRemoveCompletedTodos}
            data-testid="clear-completed-button"
            disabled={todos.filter(todo => todo.isCompleted).length === 0}
          >
            clear
          </button>
        </div>

        <TodoForm onSubmit={createTodo} />

        <ul className="space-y-3" data-testid="todo-list">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
