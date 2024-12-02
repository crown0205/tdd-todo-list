import { useMutation, useQueryClient } from '@tanstack/react-query';
import todoApi from '../../api/todos';

function useMutateTodoDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todoApi.removeTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export default useMutateTodoDelete;
