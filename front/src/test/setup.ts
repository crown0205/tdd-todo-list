import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '../mocks/server';

// 테스트 전체 시작 전 한번 실행
// => 처리되지 않은 요청에 대해 에러 발생
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// 각 테스트 케이스 실행 후 실행
afterEach(() => server.resetHandlers());
// 테스트 전체 종료 후 한번 실행
afterAll(() => server.close());
