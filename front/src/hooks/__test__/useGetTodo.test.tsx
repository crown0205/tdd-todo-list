import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import useGetTodo from '../queries/useGetTodo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../../api';
import { server } from '../../mocks/server';

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

const MOCK_TODO = { id: 1, title: '리액트 공부하기', isCompleted: false };

describe('useGetTodo', () => {
  test('처음에는 로딩 상태여야 합니다', () => {
    const { result } = renderHook(() => useGetTodo(1), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  test('데이터 조회 성공', async () => {
    const { result } = renderHook(() => useGetTodo(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(MOCK_TODO);
  });

  test('데이터 조회 실패', async () => {
    const todoId = 1;
    const ERROR_MESSAGE = 'Internal Server Error';

    server.use(
      http.get(`${BASE_URL}/todos/${todoId}`, () => {
        return HttpResponse.json({ error: ERROR_MESSAGE }, { status: 500 });
      }),
    );
    const { result } = renderHook(() => useGetTodo(todoId), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
