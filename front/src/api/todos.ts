import { CreateTodo, Todo } from '../types/todo';
import axiosInstance from './axios';

const BASE_URL = '/todos';

// 모든 할일 조회
const findAllTodos = async (isCompleted?: boolean): Promise<Todo[]> => {
  const params = isCompleted !== undefined ? { isCompleted } : {};
  const response = await axiosInstance.get<Todo[]>(BASE_URL, { params });
  return response.data;
};

// 특정 할일 조회
const findOneTodo = async (id: number): Promise<Todo> => {
  const response = await axiosInstance.get<Todo>(`${BASE_URL}/${id}`);
  return response.data;
};

// 할일 생성
const createTodo = async (createTodoDto: CreateTodo): Promise<Todo> => {
  const response = await axiosInstance.post<Todo>(BASE_URL, createTodoDto);
  return response.data;
};

// 할일 삭제
const removeTodo = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${BASE_URL}/${id}`);
};

// 할일 완료 상태 토글
const toggleTodoComplete = async (id: number): Promise<Todo> => {
  const response = await axiosInstance.patch<Todo>(`${BASE_URL}/${id}/toggle`);
  return response.data;
};

// 완료된 할일 모두 삭제
const removeCompletedTodos = async (): Promise<void> => {
  await axiosInstance.delete(`${BASE_URL}/completed`);
};

const todoApi = {
  findAllTodos,
  findOneTodo,
  createTodo,
  removeTodo,
  toggleTodoComplete,
  removeCompletedTodos,
};

export default todoApi;
