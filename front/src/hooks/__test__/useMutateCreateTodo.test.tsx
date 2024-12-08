import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import todoApi from '../../api/todos';
import useMutateCreateTodo from '../queries/useMutateCreateTodo';
import useGetTodos from '../queries/useGetTodos';

const MOCK_TODOS = [
  { id: 1, title: '리액트 공부하기', isCompleted: false },
  { id: 2, title: 'TDD 연습하기', isCompleted: false },
];

// API 함수 목킹
vi.mock('../../api/todos', () => ({
  default: {
    createTodo: vi.fn(),
    findAllTodos: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useMutateCreateTodo', () => {
  beforeEach(async () => {
    queryClient.setQueryData(['todos'], MOCK_TODOS);
  });

  test('할일 생성시 쿼리 무효화', async () => {
    const newTodo = {
      id: 3,
      title: '새로운 할일',
      isCompleted: false,
    };

    (todoApi.createTodo as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );

    const { result } = renderHook(() => useMutateCreateTodo(), { wrapper });

    await act(async () => {
      result.current.mutate('새로운 할일');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(todoApi.createTodo).toHaveBeenCalledWith('새로운 할일');

    await queryClient.invalidateQueries({ queryKey: ['todos'] });

    (todoApi.findAllTodos as ReturnType<typeof vi.fn>).mockResolvedValue([
      ...MOCK_TODOS,
      newTodo,
    ]);

    const { result: queryResult } = renderHook(() => useGetTodos(), {
      wrapper,
    });

    await waitFor(() => {
      expect(queryResult.current.data).toEqual([...MOCK_TODOS, newTodo]);
    });
  });

  test('할일 생성 실패시 에러 처리', async () => {
    const error = new Error('Failed to create todo');
    (todoApi.createTodo as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    const { result } = renderHook(() => useMutateCreateTodo(), { wrapper });

    await act(async () => {
      result.current.mutate('Test Todo');
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('Failed to create todo');
    });

    expect(todoApi.createTodo).toHaveBeenCalledWith('Test Todo');
    expect(await queryClient.getQueryData(['todos'])).toEqual(MOCK_TODOS);
  });
});
