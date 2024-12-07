import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Todo } from '../../types/todo';
import TodoItem from '../TodoItem/index';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    title: '테스트 할일',
    isCompleted: false,
  };

  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnDelete.mockClear();
  });

  test('할일 항목이 정상적으로 렌더링되어야 합니다', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByTestId('todo-item')).toBeInTheDocument();
    expect(screen.getByTestId('todo-title')).toHaveTextContent('테스트 할일');
    expect(screen.getByTestId('todo-checkbox')).not.toBeChecked();
  });

  test('TodoItem 스냅샷이 일치해야 합니다', () => {
    const { container } = render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  test('완료된 할일은 체크박스가 체크되어 있어야 합니다', () => {
    const completedTodo = { ...mockTodo, isCompleted: true };

    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByTestId('todo-checkbox')).toBeChecked();
    expect(screen.getByTestId('todo-title')).toHaveClass('line-through');
  });

  test('체크박스 클릭 시 onToggle이 호출되어야 합니다', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.click(screen.getByTestId('todo-checkbox'));
    expect(mockOnToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  test('삭제 버튼 클릭 시 onDelete가 호출되어야 합니다', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.click(screen.getByTestId('delete-button'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  test('키보드로 할일을 완료/삭제할 수 있어야 합니다', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />,
    );

    const checkbox = screen.getByTestId('todo-checkbox');
    fireEvent.keyDown(checkbox, { key: 'Enter', code: 'Enter' });
    expect(mockOnToggle).toHaveBeenCalled();

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.keyDown(deleteButton, { key: 'Enter', code: 'Enter' });
    expect(mockOnDelete).toHaveBeenCalled();
  });
});
