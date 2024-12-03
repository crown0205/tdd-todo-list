import { useQuery } from '@tanstack/react-query';
import todoApi from '../../api/todos';

function useGetTodo(id: number) {
  return useQuery({
    queryKey: ['todos', id],
    queryFn: () => todoApi.findOneTodo(id),
  });
}

export default useGetTodo;
