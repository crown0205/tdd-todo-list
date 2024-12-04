import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { useState } from 'react';
import { Todo } from '../../types/todo';

interface TodoFormProps {
  onSubmit: UseMutateAsyncFunction<Todo, unknown, string, void>;
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '' || title.trim() === 'sss') {
      setError('할 일 추가에 실패했습니다.');
      return;
    }

    onSubmit(title);
    setTitle('');
    setError('');
  };

  return (
    <div className="mb-6 flex justify-between flex-col gap-2">
      <form
        className="flex gap-2 w-full"
        data-testid="input-form"
        aria-label="input-form"
        onSubmit={handleSubmit}
      >
        <input
          id="write-input"
          type="text"
          placeholder="할 일을 입력하세요"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          data-testid="write-input"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            setError('');
          }}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
          data-testid="add-button"
          disabled={title.trim() === ''}
          type="submit"
        >
          추가
        </button>
      </form>
      {error && <p className="text-red-500 text-[12px] pl-2">{error}</p>}
    </div>
  );
}
