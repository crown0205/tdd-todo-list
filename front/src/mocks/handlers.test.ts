import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { handlers } from './handlers';

describe('Todo API 핸들러 테스트', () => {
  const server = setupServer(...handlers);

  // 테스트 시작 전 서버 설정
  beforeAll(() => server.listen());
  // 각 테스트 후 핸들러 초기화
  afterEach(() => server.resetHandlers());
  // 모든 테스트 완료 후 서버 종료
  afterAll(() => server.close());

  const getTodo = async () => {
    const response = await fetch('/todos');
    const todos = await response.json();
    return todos;
  };

  it('할일 목록을 조회할 수 있다', async () => {
    const response = await fetch('/todos');
    const todos = await response.json();

    expect(response.ok).toBe(true);
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBeGreaterThan(0);
  });

  it('새로운 할일을 생성할 수 있다', async () => {
    const newTodo = { title: '새로운 할일' };

    const response = await fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    });

    const todo = await response.json();

    expect(response.ok).toBe(true);
    expect(todo.title).toBe(newTodo.title);
    expect(todo.isCompleted).toBe(false);
    expect(todo.id).toBeDefined();
  });

  it('할일 완료 상태를 토글할 수 있다', async () => {
    const response = await fetch('/todos/1/toggle', {
      method: 'PATCH',
    });

    console.log({ response });
    const todo = await response.json();

    expect(response.ok).toBe(true);
    expect(todo.isCompleted).toBeDefined();
  });

  it('할일을 삭제할 수 있다', async () => {
    const initialTodo = await getTodo();

    const response = await fetch('/todos/1', {
      method: 'DELETE',
    });

    expect(response.ok).toBe(true);
    expect(await getTodo()).toHaveLength(initialTodo.length - 1);
    expect(await getTodo()).not.toContainEqual(initialTodo[0]);
  });

  it('완료된 모든 할일을 삭제할 수 있다', async () => {
    const response = await fetch('/todos/completed', {
      method: 'DELETE',
    });

    expect(response.ok).toBe(true);
    expect(await getTodo()).toHaveLength(2);
  });
});
