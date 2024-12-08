import { useMutation, useQueryClient } from '@tanstack/react-query';
import todoApi from '../../api/todos';

function useMutateCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => todoApi.createTodo(title),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export default useMutateCreateTodo;
