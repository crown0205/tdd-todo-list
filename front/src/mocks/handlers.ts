import { http, HttpResponse } from 'msw';
import { Todo } from '../types/todo';

let mockTodos: Todo[] = [
  {
    id: 1,
    title: '리액트 공부하기',
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: 'TDD 연습하기',
    isCompleted: false,
    createdAt: new Date(),
  },
];

export const handlers = [
  // 모든 할일 조회
  http.get('/todos', () => {
    return HttpResponse.json(mockTodos);
  }),

  // 할일 생성
  http.post('/todos', async ({ request }: { request: Request }) => {
    const { title } = await request.json();
    const newTodo = {
      id: mockTodos.length + 1,
      title,
      isCompleted: false,
      createdAt: new Date(),
    };
    mockTodos.push(newTodo);
    return HttpResponse.json(newTodo);
  }),

  // 할일 완료 상태 토글
  http.patch('/todos/:id/toggle', ({ params }) => {
    const { id } = params;
    const todo = mockTodos.find(todo => todo.id === Number(id));

    if (todo) {
      todo.isCompleted = !todo.isCompleted;
    }
    return HttpResponse.json(todo);
  }),

  // 할일 삭제
  http.delete('/todos/:id', ({ params }) => {
    const { id } = params;
    mockTodos = mockTodos.filter(todo => todo.id !== Number(id));
    return HttpResponse.json({ message: 'Todo deleted', mockTodos });
  }),

  // 모든 완료된 할일 삭제
  http.delete('/todos/completed', () => {
    mockTodos = mockTodos.filter(todo => !todo.isCompleted);
    return HttpResponse.json({ message: 'Completed todos deleted' });
  }),
];
