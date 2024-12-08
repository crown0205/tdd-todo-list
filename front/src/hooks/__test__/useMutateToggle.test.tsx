import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import todoApi from '../../api/todos';
import useMutateToggleTodo from '../queries/useMutateToggle';

const MOCK_TODO = { id: 1, title: '리액트 공부하기', isCompleted: false };

vi.mock('../../api/todos', () => ({
  default: {
    toggleTodoComplete: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useMutateToggle', () => {
  test('할일 상태 변경 성공', async () => {
    const todoId = MOCK_TODO.id;
    const isCompleted = true;

    (todoApi.toggleTodoComplete as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...MOCK_TODO,
      isCompleted,
    });

    const { result } = renderHook(() => useMutateToggleTodo(), {
      wrapper,
    });

    act(() => {
      result.current.mutate(todoId);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ ...MOCK_TODO, isCompleted });
  });

  test('할일 상태 변경 실패', async () => {
    const todoId = MOCK_TODO.id;
    const ERROR_MESSAGE = 'Internal Server Error';

    (todoApi.toggleTodoComplete as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error(ERROR_MESSAGE),
    );

    const { result } = renderHook(() => useMutateToggleTodo(), {
      wrapper,
    });

    act(() => {
      result.current.mutate(todoId);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
  test('할일 상태 변경 실패 시 오류 메시지가 반환되어야 합니다', async () => {});
});
