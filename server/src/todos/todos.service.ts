import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { Todo } from './todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  // 모든 할일 조회 (완료 여부로 필터링 가능)
  async findAll(isCompleted?: boolean): Promise<TodoDto[]> {
    const query = this.todoRepository.createQueryBuilder('todo');

    if (isCompleted !== undefined) {
      query.where('todo.isCompleted = :isCompleted', { isCompleted });
    }

    query.orderBy('todo.createdAt', 'DESC');

    return await query.getMany();
  }

  // 특정 할일 조회
  async findOne(id: number): Promise<TodoDto> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  // 할일 생성
  async create(createTodoDto: CreateTodoDto): Promise<TodoDto> {
    try {
      const todo = this.todoRepository.create(createTodoDto);
      return await this.todoRepository.save(todo);
    } catch (error) {
      throw new BadRequestException(`Could not create todo: ${error.message}`);
    }
  }

  // 할일 삭제
  async remove(id: number): Promise<void> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }

  // 할일 완료 상태 토글
  async toggleComplete(id: number): Promise<TodoDto> {
    const todo = await this.findOne(id);
    todo.isCompleted = !todo.isCompleted;
    return await this.todoRepository.save(todo);
  }

  // 모든 완료된 할일 삭제
  async removeCompleted(): Promise<void> {
    await this.todoRepository
      .createQueryBuilder()
      .delete()
      .where('isCompleted = :isCompleted', { isCompleted: true })
      .execute();
  }
}
