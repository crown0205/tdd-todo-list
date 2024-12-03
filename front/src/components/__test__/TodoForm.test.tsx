import { render, screen, fireEvent } from '@testing-library/react';
import TodoForm from '../TodoForm/index';
import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('TodoForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();

    render(<TodoForm onSubmit={mockOnSubmit} />);
  });

  test('폼이 정상적으로 렌더링되어야 합니다', () => {
    expect(screen.getByTestId('input-form')).toBeInTheDocument();
    expect(screen.getByTestId('input-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
  });

  test('입력값이 없을 때 버튼이 비활성화되어야 합니다', () => {
    const button = screen.getByTestId('add-button');
    expect(button).toBeDisabled();
  });

  test('입력값이 있을 때 버튼이 활성화되어야 합니다', () => {
    const input = screen.getByTestId('input-input');
    fireEvent.change(input, { target: { value: '새로운 할일' } });

    const button = screen.getByTestId('add-button');
    expect(button).not.toBeDisabled();
  });

  test('폼 제출 시 onSubmit이 호출되어야 합니다', () => {
    const input = screen.getByTestId('input-input');
    const form = screen.getByTestId('input-form');

    fireEvent.change(input, { target: { value: '새로운 할일' } });
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledWith('새로운 할일');
    expect(input).toHaveValue('');
  });
});
