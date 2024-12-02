import { useMutation, useQueryClient } from "@tanstack/react-query";
import todoApi from "../../api/todos";

    // 완료된 할일 모두 삭제 하는 커스텀 훅
function useMutateRemoveCompletedTodos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todoApi.removeCompletedTodos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export default useMutateRemoveCompletedTodos;
