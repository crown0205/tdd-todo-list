interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
}

interface CreateTodo {
  title: string;
}

export type { Todo, CreateTodo };
