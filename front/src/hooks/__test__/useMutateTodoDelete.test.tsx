import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import todoApi from '../../api/todos';
import useMutateTodoDelete from '../queries/useMutateTodoDelete';

const MOCK_TODOS = [
  { id: 1, title: '리액트 공부하기', isCompleted: false },
  { id: 2, title: 'TDD 공부하기', isCompleted: true },
];

vi.mock('../../api/todos', () => ({
  default: {
    removeTodo: vi.fn(),
  },
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useMutateTodoDelete', () => {
  beforeEach(() => {
    queryClient.setQueryData(['todos'], MOCK_TODOS);
  });

  test('할일 삭제 성공', async () => {
    const todoId = 1;
    (todoApi.removeTodo as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );

    const { result } = renderHook(() => useMutateTodoDelete(), { wrapper });

    act(() => {
      result.current.mutate(todoId);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      queryClient.setQueryData(
        ['todos'],
        MOCK_TODOS.filter(todo => todo.id !== todoId),
      );
    });

    expect(queryClient.getQueryData(['todos'])).toEqual(
      MOCK_TODOS.filter(todo => todo.id !== todoId),
    );
  });
  test('할일 삭제 실패 시 에러 발생', async () => {
    const todoId = 1;
    (todoApi.removeTodo as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Failed to delete todo'),
    );

    const { result } = renderHook(() => useMutateTodoDelete(), { wrapper });

    act(() => {
      result.current.mutate(todoId);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to delete todo');
    expect(queryClient.getQueryData(['todos'])).toEqual(MOCK_TODOS);
  });
});
