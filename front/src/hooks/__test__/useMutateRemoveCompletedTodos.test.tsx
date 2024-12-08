import { describe, expect, test, vi } from 'vitest';
import useGetTodos from '../queries/useGetTodos';
import todoApi from '../../api/todos';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import useMutateRemoveCompletedTodos from '../queries/useMutateRemoveCompletedTodos';

const MOCK_TODO = [
  {
    id: 1,
    title: '리액트 공부하기',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'TDD 공부하기',
    isCompleted: true,
  },
];

const RESULT_MOCK_TODO = [
  { id: 1, title: '리액트 공부하기', isCompleted: false },
];

vi.mock('../../api/todos.ts', () => ({
  default: {
    findAllTodos: vi.fn(),
    removeCompletedTodos: vi.fn(),
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

describe('useMutateRemoveCompletedTodos', () => {
  test('완료된 할일들 삭제 성공', async () => {
    queryClient.setQueryData(['todos'], MOCK_TODO);

    (
      todoApi.removeCompletedTodos as ReturnType<typeof vi.fn>
    ).mockResolvedValue(RESULT_MOCK_TODO);

    const { result } = renderHook(() => useMutateRemoveCompletedTodos(), {
      wrapper,
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(RESULT_MOCK_TODO);
    expect(todoApi.removeCompletedTodos).toHaveBeenCalled();
  });

  test('완료된 할일들 삭제 실패', async () => {
    (todoApi.findAllTodos as ReturnType<typeof vi.fn>).mockResolvedValue(
      MOCK_TODO,
    );

    const { result: findAllTodosResult } = renderHook(() => useGetTodos(), {
      wrapper,
    });

    await waitFor(() =>
      expect(findAllTodosResult.current.isSuccess).toBe(true),
    );

    (
      todoApi.removeCompletedTodos as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error('Failed to remove completed todos'));

    const { result } = renderHook(() => useMutateRemoveCompletedTodos(), {
      wrapper,
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toMatch(
      'Failed to remove completed todos',
    );
  });

  test('완료된 할일들 없을때 삭제 실패', async () => {
    const NO_COMPLETED_TODOS = [
      {
        id: 1,
        title: '리액트 공부하기',
        isCompleted: false,
      },
    ];

    (todoApi.findAllTodos as ReturnType<typeof vi.fn>).mockResolvedValue(
      NO_COMPLETED_TODOS,
    );

    const { result: findAllTodosResult } = renderHook(() => useGetTodos(), {
      wrapper,
    });

    await waitFor(() =>
      expect(findAllTodosResult.current.isSuccess).toBe(true),
    );

    (
      todoApi.removeCompletedTodos as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error('No completed todos to remove'));

    const { result } = renderHook(() => useMutateRemoveCompletedTodos(), {
      wrapper,
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('No completed todos to remove');
  });
});
