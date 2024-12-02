import { useQuery } from '@tanstack/react-query';
import todoApi from '../../api/todos';

function useGetTodo() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: () => todoApi.findAllTodos(),
  });
}

export default useGetTodo;
