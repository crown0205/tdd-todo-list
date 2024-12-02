import { useState } from 'react';

interface TodoFormProps {
  onSubmit: (title: string) => void;
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;
    onSubmit(title);
    setTitle('');
  };

  return (
    <form
      className="flex gap-2 mb-6"
      data-testid="input-form"
      aria-label="input-form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="할 일을 입력하세요"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        data-testid="input-input"
        value={title}
        onChange={e => setTitle(e.target.value)}
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
  );
}
