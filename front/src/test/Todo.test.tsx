import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import App from '../App';
import useGetTodos from '../hooks/queries/useGetTodos';

let queryClient: QueryClient;

// 테스트 실행과 마치고 데이터 초기화
beforeEach(async () => {
  queryClient = new QueryClient();
});

afterEach(async () => {
  await queryClient.invalidateQueries({ queryKey: ['todos'] });
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('# 랜더링', () => {
  beforeEach(() => {
    render(<App />, { wrapper });
  });

  test('- 화면에 표시되는 요소들', async () => {
    const { result } = renderHook(() => useGetTodos(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(screen.getByText('할 일 목록')).toBeInTheDocument();
    expect(screen.getByTestId('input-form')).toBeInTheDocument();
    expect(screen.getByTestId('input-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
    expect(screen.getByTestId('todo-list')).toBeInTheDocument();

    expect(result.current.data).toEqual([
      { id: 1, title: '리액트 공부하기', isCompleted: false },
      { id: 2, title: 'TDD 연습하기', isCompleted: false },
    ]);
    expect(screen.getAllByTestId('todo-item').length).toBe(2);
  });
});

describe('# 할일 추가', () => {
  beforeEach(async () => {
    render(<App />, { wrapper });
  });

  test('- 입력한 값이 표시되어야 한다', () => {
    const input = screen.getByTestId('input-input');
    fireEvent.change(input, { target: { value: '할일 1' } });

    expect(input).toHaveValue('할일 1');
  });

  test('- 추가 버튼 클릭시 목록에 추가되어야 한다', async () => {
    const input = screen.getByTestId('input-input');
    fireEvent.change(input, { target: { value: '할일 1' } });

    const button = screen.getByTestId('add-button');

    if (!button.hasAttribute('disabled')) {
      expect(button).not.toBeDisabled();
      fireEvent.click(button);
    }

    const { result } = renderHook(() => useGetTodos(), { wrapper });

    await waitFor(() => {
      expect(screen.getAllByTestId('todo-item').length).toBe(3);
      expect(screen.getByText('할일 1')).toBeInTheDocument();
      expect(result.current.data).toEqual([
        { id: 1, title: '리액트 공부하기', isCompleted: false },
        { id: 2, title: 'TDD 연습하기', isCompleted: false },
        { id: 3, title: '할일 1', isCompleted: false },
      ]);
    });
  });

  test('- 엔터 키 입력시 목록에 추가되어야 한다', async () => {
    await queryClient.resetQueries({ queryKey: ['todos'] });

    const input = screen.getByTestId('input-input');
    fireEvent.change(input, { target: { value: '할일 1' } });

    const form = screen.getByTestId('input-form');

    if ((input as HTMLInputElement).value.length > 0) {
      expect(input).toHaveValue('할일 1');
      fireEvent.submit(form);
    }

    const { result } = renderHook(() => useGetTodos(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.length).toBe(3);
    });

    expect(screen.getByText('할일 1')).toBeInTheDocument();
    expect(screen.getAllByTestId('todo-item').length).toBe(3);
  });

  test('- 여러개 할일을 입력 후 추가 버튼 클릭시 목록에 추가되어야 한다', async () => {
    await queryClient.resetQueries({ queryKey: ['todos'] });

    const input = screen.getByTestId('input-input');
    const button = screen.getByTestId('add-button');

    fireEvent.change(input, { target: { value: '할일 1' } });
    fireEvent.click(button);

    const { result } = renderHook(() => useGetTodos(), { wrapper });

    await waitFor(() => {
      expect(result.current.data?.length).toBe(3);
    });

    fireEvent.change(input, { target: { value: '할일 2' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(result.current.data?.length).toBe(4);

      expect(screen.getByText('할일 1')).toBeInTheDocument();
      expect(screen.getByText('할일 2')).toBeInTheDocument();
    });
  });

  test('예외) 추가 버튼이 비활성화 되어야 한다', () => {
    const input = screen.getByTestId('input-input');
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.getByTestId('add-button')).toHaveAttribute('disabled');
  });

  test('예외) 빈 입력값으로 추가 할수 없다', () => {
    const input = screen.getByTestId('input-input');
    const button = screen.getByTestId('add-button');

    fireEvent.change(input, { target: { value: '' } });
    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: '  ' } });
    expect(button).toBeDisabled();
  });
});

// describe('# 할일 완료', () => {
//   beforeEach(() => {
//     render(<App />);
//   });

//   test('- 체크박스 클릭시 완료 상태가 변경되어야 한다', () => {
//     const input = screen.getByTestId('input-input');
//     const button = screen.getByTestId('add-button');

//     fireEvent.change(input, { target: { value: '할일 1' } });

//     if (!button.hasAttribute('disabled')) {
//       fireEvent.click(button);
//     }

//     const checkbox = screen.getByTestId('todo-checkbox');

//     fireEvent.click(checkbox);

//     expect(checkbox).toBeChecked();
//     expect(screen.getByText('할일 1')).toHaveClass(
//       'line-through text-gray-500',
//     );
//   });
// });

// describe('# 할일 삭제', () => {
//   const TODO_CONTENT = '할일 1';

//   const addTodo = () => {
//     const input = screen.getByTestId('input-input');
//     const button = screen.getByTestId('add-button');
//     fireEvent.change(input, { target: { value: TODO_CONTENT } });

//     if (!button.hasAttribute('disabled')) {
//       fireEvent.click(button);
//     }
//   };

//   beforeEach(() => {
//     render(<App />);
//     addTodo();
//     expect(screen.queryByText(TODO_CONTENT)).toBeInTheDocument();
//   });

//   test('- 삭제 버튼 클릭시 목록에서 삭제되어야 한다', () => {
//     const deleteButton = screen.getByTestId('delete-button');
//     fireEvent.click(deleteButton);

//     expect(screen.queryByText('할일 1')).not.toBeInTheDocument();
//   });
// });
