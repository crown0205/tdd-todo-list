import { http, HttpResponse } from 'msw';
import { Todo } from '../types/todo';

let mockTodos: Todo[] = [
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
];

const BASE_URL = 'http://localhost:3001/todos';

export const handlers = [
  // 모든 완료된 할일 삭제
  http.delete(`${BASE_URL}/completed`, () => {
    mockTodos = mockTodos.filter(todo => !todo.isCompleted);
    return HttpResponse.json({ message: 'Completed todos deleted' });
  }),

  // 모든 할일 조회
  http.get(BASE_URL, () => {
    return HttpResponse.json(mockTodos);
  }),

  // 특정 할일 조회
  http.get(`${BASE_URL}/:id`, ({ params }) => {
    const { id } = params;
    const todo = mockTodos.find(todo => todo.id === Number(id));
    return HttpResponse.json(todo);
  }),

  // 할일 생성
  http.post(BASE_URL, async ({ request }: { request: Request }) => {
    const { title } = await request.json();
    const newTodo = {
      id: mockTodos.length + 1,
      title,
      isCompleted: false,
    };
    mockTodos.push(newTodo);
    return HttpResponse.json(newTodo);
  }),

  // 할일 완료 상태 토글
  http.patch(`${BASE_URL}/:id/toggle`, ({ params }) => {
    const { id } = params;
    const todo = mockTodos.find(todo => todo.id === Number(id));

    if (todo) {
      todo.isCompleted = !todo.isCompleted;
    }
    return HttpResponse.json(todo);
  }),

  // 할일 삭제
  http.delete(`${BASE_URL}/:id`, ({ params }) => {
    const { id } = params;
    mockTodos = mockTodos.filter(todo => todo.id !== Number(id));
    return HttpResponse.json({ message: 'Todo deleted', mockTodos });
  }),
];
