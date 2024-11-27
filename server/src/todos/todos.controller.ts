import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoDto } from './dto/todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}
  @Delete('completed')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeCompleted(): Promise<void> {
    return this.todosService.removeCompleted();
  }

  @Get()
  findAll(@Query('isCompleted') isCompleted?: string): Promise<TodoDto[]> {
    return this.todosService.findAll(
      isCompleted ? isCompleted === 'true' : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TodoDto> {
    return this.todosService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTodoDto: CreateTodoDto): Promise<TodoDto> {
    return this.todosService.create(createTodoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.todosService.remove(id);
  }

  @Patch(':id/toggle')
  toggleComplete(@Param('id', ParseIntPipe) id: number): Promise<TodoDto> {
    return this.todosService.toggleComplete(id);
  }
}
