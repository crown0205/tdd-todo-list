import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, test } from 'vitest';
import useGetTodo from '../../hooks/queries/useGetTodo';
import { server } from '../../mocks/server';

// 테스트용 QueryClient 생성 함수
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('useGetTodo', () => {
  test('데이터 조회 성공 시 데이터가 반환되어야 한다', async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // useGetTodo 훅 실행
    const { result } = renderHook(() => useGetTodo(), { wrapper });

    // 초기 로딩 상태 확인
    expect(result.current.isLoading).toBe(true);

    // 데이터 로드 후 결과 확인
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([
      {
        id: 1,
        title: '리액트 공부하기',
        isCompleted: false,
      },
      {
        id: 2,
        title: 'TDD 연습하기',
        isCompleted: false,
      },
    ]);
  });

  test('API 에러 시 에러가 반환되어야 한다', async () => {
    // MSW로 에러 상황 정의
    server.use(
      http.get(`http://localhost:3002/todos`, () => {
        return HttpResponse.json(
          { error: 'Internal Server Error', data: [] },
          { status: 500 },
        );
      }),
    );

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // useGetTodo 훅 실행
    const { result } = renderHook(() => useGetTodo(), { wrapper });

    // 로딩 상태 확인
    expect(result.current.isLoading).toBe(true);

    // 에러 발생 후 상태 확인
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toMatch(/500/);
    });
  });

  test('캐시 활용 시 재호출이 발생하지 않아야 한다', async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // useGetTodo 훅 첫 번째 실행
    const { result: firstResult } = renderHook(() => useGetTodo(), { wrapper });

    expect(firstResult.current.isLoading).toBe(true);

    // 첫 번째 호출 후 데이터 로드
    await waitFor(() => {
      expect(firstResult.current.isSuccess).toBe(true);
      expect(firstResult.current.data).toEqual([
        { id: 1, title: '리액트 공부하기', isCompleted: false },
        { id: 2, title: 'TDD 연습하기', isCompleted: false },
      ]);
    });

    // useGetTodo 훅 두 번째 실행
    const { result: secondResult } = renderHook(() => useGetTodo(), {
      wrapper,
    });

    // 캐시에서 데이터를 가져오므로 로딩 상태가 false
    expect(secondResult.current.isLoading).toBe(false);
    expect(secondResult.current.data).toEqual([
      { id: 1, title: '리액트 공부하기', isCompleted: false },
      { id: 2, title: 'TDD 연습하기', isCompleted: false },
    ]);
  });
});
