import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import useGetTodos from './hooks/queries/useGetTodos';
import useMutateCreateTodo from './hooks/queries/useMutateCreateTodo';
import useMutateRemoveCompletedTodos from './hooks/queries/useMutateRemoveCompletedTodos';
import useMutateTodoDelete from './hooks/queries/useMutateTodoDelete';
import useMutateToggleTodo from './hooks/queries/useMutateToggle';
import { useState, useMemo } from 'react';

function App() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'alphabetical'>('created');
  const { data: todos = [] } = useGetTodos();
  const { mutate: createTodo } = useMutateCreateTodo();
  const { mutate: toggleTodo } = useMutateToggleTodo();
  const { mutate: deleteTodo } = useMutateTodoDelete();
  const { mutate: removeCompletedTodos } = useMutateRemoveCompletedTodos();

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.isCompleted);
      case 'completed':
        return todos.filter(todo => todo.isCompleted);
      default:
        return todos;
    }
  }, [todos, filter]);

  const sortedTodos = useMemo(() => {
    return [...filteredTodos].sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return a.id - b.id; // created 순서
    });
  }, [filteredTodos, sortBy]);

  const handleToggleTodo = (id: number) => {
    toggleTodo(id);
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
  };

  const handleRemoveCompletedTodos = () => {
    removeCompletedTodos();
  };

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.isCompleted).length;
    const active = total - completed;
    const percentComplete =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, active, percentComplete };
  }, [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">
            할 일 목록{' '}
            <span className="text-sm text-gray-500" data-testid="todo-count">
              ({todos.length})
            </span>
          </h1>

          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full disabled:opacity-50 text-[12px] transition duration-300"
            onClick={handleRemoveCompletedTodos}
            data-testid="clear-completed-button"
            disabled={todos.filter(todo => todo.isCompleted).length === 0}
          >
            완료 항목 삭제
          </button>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-full transition duration-300 ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            className={`px-4 py-2 rounded-full transition duration-300 ${
              filter === 'active'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('active')}
          >
            진행중
          </button>
          <button
            className={`px-4 py-2 rounded-full transition duration-300 ${
              filter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('completed')}
          >
            완료
          </button>
        </div>

        <div className="mb-4">
          <select
            className="border rounded-full p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            value={sortBy}
            onChange={e =>
              setSortBy(e.target.value as 'created' | 'alphabetical')
            }
          >
            <option value="created">생성순</option>
            <option value="alphabetical">가나다순</option>
          </select>
        </div>

        <TodoForm onSubmit={createTodo} />

        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
          <ul className="space-y-3" data-testid="todo-list">
            {sortedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </ul>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-inner">
          <div className="text-sm text-gray-600">
            <p>전체: {stats.total}개</p>
            <p>완료: {stats.completed}개</p>
            <p>진행중: {stats.active}개</p>
            <p>진행률: {stats.percentComplete}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentComplete}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
