import { render, screen, fireEvent } from '@testing-library/react';
import TodoForm from '../TodoForm/index';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// @coderabbitai review
describe('TodoForm', () => {
  const mockOnSubmit = vi.fn<(value: string) => void>();

  beforeEach(() => {
    mockOnSubmit.mockClear();

    render(<TodoForm onSubmit={mockOnSubmit} />);
  });

  test('폼이 정상적으로 렌더링되어야 합니다', () => {
    expect(screen.getByTestId('input-form')).toBeInTheDocument();
    expect(screen.getByTestId('write-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
  });

  test('폼이 접근성 기준을 충족해야 합니다', () => {
    const form = screen.getByTestId('input-form');

    expect(form).toHaveAttribute('aria-label', 'input-form');
    expect(screen.getByRole('button')).toHaveAccessibleName('추가');
  });

  test('공백만 있는 경우 버튼이 비활성화 되어야 한다.', () => {
    const input = screen.getByTestId('write-input');
    fireEvent.change(input, { target: { value: '' } });

    const button = screen.getByTestId('add-button');
    expect(button).toBeDisabled();
  });

  test('입력값이 없을 때 버튼이 비활성화되어야 합니다', () => {
    const button = screen.getByTestId('add-button');
    expect(button).toBeDisabled();
  });

  test('입력값이 있을 때 버튼이 활성화되어야 합니다', () => {
    const input = screen.getByTestId('write-input');
    fireEvent.change(input, { target: { value: '새로운 할일' } });

    const button = screen.getByTestId('add-button');
    expect(button).not.toBeDisabled();
  });

  test('폼 제출 시 onSubmit이 호출되어야 합니다', () => {
    const input = screen.getByTestId('write-input');
    const form = screen.getByTestId('input-form');

    fireEvent.change(input, { target: { value: '새로운 할일' } });
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledWith('새로운 할일');
    expect(input).toHaveValue('');
  });

  test('제출 중 에러 발생 시 에러 메시지가 표시되어야 합니다', () => {
    const input = screen.getByTestId('write-input');
    fireEvent.change(input, { target: { value: 'sss' } });
    fireEvent.submit(screen.getByTestId('input-form'));

    expect(screen.getByText('할 일 추가에 실패했습니다.')).toBeInTheDocument();
  });
});
