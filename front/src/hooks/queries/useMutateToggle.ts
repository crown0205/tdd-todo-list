import { useMutation, useQueryClient } from '@tanstack/react-query';
import todoApi from '../../api/todos';

function useMutateToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todoApi.toggleTodoComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export default useMutateToggleTodo;
