import { useQuery } from '@tanstack/react-query';
import todoApi from '../../api/todos';

function useGetTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: () => todoApi.findAllTodos(),
  });
}

export default useGetTodos;
