import { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
      data-testid="todo-item"
    >
      <input
        type="checkbox"
        className="w-5 h-5"
        checked={todo.isCompleted}
        onChange={() => onToggle(todo.id)}
        data-testid="todo-checkbox"
      />
      <span
        className={`flex-1 ${
          todo.isCompleted ? 'line-through text-gray-500' : ''
        }`}
      >
        {todo.title}
      </span>

      <button
        className="text-red-500 hover:text-red-600"
        data-testid="delete-button"
        onClick={() => onDelete(todo.id)}
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
  );
}
