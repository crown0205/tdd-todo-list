import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import App from '../App';

describe('# 랜더링', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('화면에 표시되는 요소들', () => {
    expect(screen.getByText('할 일 목록')).toBeInTheDocument();
    expect(screen.getByTestId('input-form')).toBeInTheDocument();
    expect(screen.getByTestId('input-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
  });
});

describe('# 할일 추가', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('입력한 값이 표시되어야 한다', () => {
    const input = screen.getByTestId('input-input');
    fireEvent.change(input, { target: { value: '할일 1' } });

    expect(input).toHaveValue('할일 1');
  });

  test('추가 버튼 클릭시 목록에 추가되어야 한다', () => {
    const input = screen.getByTestId('input-input');
    fireEvent.change(input, { target: { value: '할일 1' } });

    const button = screen.getByTestId('add-button');

    if (!button.hasAttribute('disabled')) {
      fireEvent.click(button);
    }

    expect(screen.getAllByTestId('todo-item').length).toBe(1);
    expect(screen.getByText('할일 1')).toBeInTheDocument();
  });

  test('엔터 키 입력시 목록에 추가되어야 한다', () => {
    const input = screen.getByTestId('input-input');
    fireEvent.change(input, { target: { value: '할일 1' } });

    const form = screen.getByTestId('input-form');

    // input의 length가 0이 아니면 엔터 키 입력
    if ((input as HTMLInputElement).value.length > 0) {
      fireEvent.submit(form);
    }

    expect(screen.getAllByTestId('todo-item').length).toBe(1);
    expect(screen.getByText('할일 1')).toBeInTheDocument();
  });

  test('여러개 할일을 입력 후 추가 버튼 클릭시 목록에 추가되어야 한다', () => {
    const input = screen.getByTestId('input-input');
    const button = screen.getByTestId('add-button');

    ['할일 1', '할일 2'].forEach(content => {
      fireEvent.change(input, { target: { value: content } });
      fireEvent.click(button);
    });

    expect(screen.getAllByTestId('todo-item').length).toBe(2);
    expect(screen.getByText('할일 1')).toBeInTheDocument();
    expect(screen.getByText('할일 2')).toBeInTheDocument();
  });
});
