import { Todo } from '../types/todo';
import axiosInstance from './axios';

const BASE_URL = '/todos';

// 모든 할일 조회
const findAllTodos = async (isCompleted?: boolean): Promise<Todo[]> => {
  const params = isCompleted !== undefined ? { isCompleted } : {};

  try {
    const response = await axiosInstance.get<Todo[]>(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetching todos:`, error);
    throw error;
  }
};

// 특정 할일 조회
const findOneTodo = async (id: number): Promise<Todo> => {
  try {
    const response = await axiosInstance.get<Todo>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetching todo with id ${id}:`, error);
    throw error;
  }
};

// 할일 생성
const createTodo = async (title: string): Promise<Todo> => {
  try {
    const response = await axiosInstance.post<Todo>(BASE_URL, { title });
    return response.data;
  } catch (error) {
    console.error(`Failed to creating todo:`, error);
    throw error;
  }
};

// 할일 완료 상태 토글
const toggleTodoComplete = async (id: number): Promise<Todo> => {
  try {
    const response = await axiosInstance.patch<Todo>(
      `${BASE_URL}/${id}/toggle`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to toggling todo with id ${id}:`, error);
    throw error;
  }
};

// 할일 삭제
const removeTodo = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Failed to deleting todo with id ${id}:`, error);
    throw error;
  }
};

// 완료된 할일 모두 삭제
const removeCompletedTodos = async (): Promise<void> => {
  try {
    await axiosInstance.delete(`${BASE_URL}/completed`);
  } catch (error) {
    console.error(`Failed to deleting completed todos:`, error);
    throw error;
  }
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
