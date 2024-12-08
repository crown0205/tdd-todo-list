import { useMutation, useQueryClient } from '@tanstack/react-query';
import todoApi from '../../api/todos';

function useMutateToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => todoApi.toggleTodoComplete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export default useMutateToggleTodo;
