import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import todoApi from '../../api/todos';
import useMutateCreateTodo from '../queries/useMutateCreateTodo';
import { MOCK_TODOS } from './useGetTodos.test';

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
    vi.clearAllMocks();
    queryClient.clear();

    // 초기 데이터 설정
    await queryClient.setQueryData(['todos'], MOCK_TODOS);

    // findAllTodos 목 구현
    (todoApi.findAllTodos as ReturnType<typeof vi.fn>).mockResolvedValue(
      MOCK_TODOS,
    );
  });

  test('할일 생성시 쿼리 무효화', async () => {
    const newTodo = { id: 3, title: 'Test Todo', isCompleted: false };
    // createTodo 목 구현
    (todoApi.createTodo as ReturnType<typeof vi.fn>).mockResolvedValue(newTodo);

    const { result } = renderHook(() => useMutateCreateTodo(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate('Test Todo');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(todoApi.createTodo).toHaveBeenCalledWith('Test Todo');
    expect(await queryClient.getQueryData(['todos'])).toHaveLength(3);
  });

  test('할일 생성 실패시 에러 처리', async () => {
    const error = new Error('Failed to create todo');
    (todoApi.createTodo as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    const { result } = renderHook(() => useMutateCreateTodo(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate('Test Todo');
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(error);
    });

    expect(todoApi.createTodo).toHaveBeenCalledWith('Test Todo');
    expect(await queryClient.getQueryData(['todos'])).toEqual(MOCK_TODOS);
  });
});
