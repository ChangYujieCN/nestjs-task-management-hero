import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    try {
      await task.save();
    } catch (e) {
      this.logger.error(
        `Fail to create a  task for user "${
          user.username
        }", Data: ${createTaskDto}`,
        e.stack,
      );
      throw new InternalServerErrorException();
    }
    // Don't worry, task has already saved. This action just make front-end user can not see the user data.
    delete task.user;
    return task;
  }
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title like :search or task.description like :search)',
        {
          search: `%${search}%`,
        },
      );
    }
    try {
      return await query.getMany();
    } catch (e) {
      this.logger.error(
        `Fail to get tasks for user "${
          user.username
        }", Filters: ${JSON.stringify(filterDto)}`,
        e.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
