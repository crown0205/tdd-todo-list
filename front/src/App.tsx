import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import useGetTodo from './hooks/queries/useGetTodo';
import useMutateCreateTodo from './hooks/queries/useMutateCreateTodo';

function App() {
  const { data: todos = [] } = useGetTodo();
  const { mutate: createTodo } = useMutateCreateTodo();

  const handleToggleTodo = (id: number) => {
    // TODO: Implement toggle functionality
  };

  const handleDeleteTodo = (id: number) => {
    // TODO: Implement delete functionality
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          할 일 목록{' '}
          <span className="text-sm text-gray-500" data-testid="todo-count">
            ({todos.length})
          </span>
        </h1>

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
