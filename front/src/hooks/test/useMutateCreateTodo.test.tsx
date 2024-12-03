import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, test } from 'vitest';
import { server } from '../../mocks/server';
import useGetTodos from '../queries/useGetTodos';
import useMutateCreateTodo from '../queries/useMutateCreateTodo';

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useMutateCreateTodo', () => {
  test('할일 생성 성공 시 쿼리 무효화', async () => {
    const { result: getResult } = renderHook(() => useGetTodos(), { wrapper });

    await waitFor(() => expect(getResult.current.isSuccess).toBe(true));
    expect(getResult.current.data).toHaveLength(2);

    // 훅 실행
    const { result: createMutateResult } = renderHook(
      () => useMutateCreateTodo(),
      {
        wrapper,
      },
    );

    // mutate 호출
    act(() => {
      createMutateResult.current.mutate('Test Todo');
    });

    // 비동기 작업 기다리기
    await waitFor(() => {
      expect(createMutateResult.current.isSuccess).toBe(true);
    });

    // queryClient.invalidateQueries 호출 여부 확인
    expect(queryClient.getQueryData(['todos'])).toHaveLength(3);
  });

  test('할일 생성 실패 시 에러 처리', async () => {
    // createTodo API 모킹 (실패 시나리오)
    server.use(
      http.post(`http://localhost:3002/todos`, () => {
        return HttpResponse.json(
          { error: 'Internal Server Error' },
          { status: 500 },
        );
      }),
    );

    // 훅 실행
    const { result: createMutateResult } = renderHook(
      () => useMutateCreateTodo(),
      { wrapper },
    );

    // mutate 호출
    act(() => {
      createMutateResult.current.mutate('Test Todo');
    });

    // 비동기 작업을 기다리고, mutationFn 호출 여부 확인
    await waitFor(() => expect(createMutateResult.current.isError).toBe(true));
    expect(createMutateResult.current.error).toBeDefined();
    expect(createMutateResult.current.error?.name).toBe('AxiosError');
  });
});
