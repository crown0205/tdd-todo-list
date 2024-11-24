import { useState } from 'react';

type Todo = {
  id: number;
  content: string;
  isDone: boolean;
};

function App() {
  const [content, setContent] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleAddTodo = () => {
    if (content.trim() === '') return;

    setTodos([...todos, { id: todos.length + 1, content, isDone: false }]);
    setContent('');
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo,
      ),
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">할 일 목록</h1>

        {/* 입력 폼 */}
        <form
          className="flex gap-2 mb-6"
          data-testid="input-form"
          aria-label="input-form"
          onSubmit={e => {
            e.preventDefault();
            handleAddTodo();
          }}
        >
          <input
            type="text"
            placeholder="할 일을 입력하세요"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            data-testid="input-input"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
            data-testid="add-button"
            disabled={content.trim() === ''}
            type="submit"
          >
            추가
          </button>
        </form>

        {/* 할 일 목록 */}
        <ul className="space-y-3" data-testid="todo-list">
          {todos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              data-testid="todo-item"
            >
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={todo.isDone}
                onChange={() => handleToggleTodo(todo.id)}
                data-testid="todo-checkbox"
              />
              <span
                className={`flex-1 ${
                  todo.isDone ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.content}
              </span>
              <button
                className="text-red-500 hover:text-red-600"
                data-testid="delete-button"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
