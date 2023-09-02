import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MongoDbHelper } from '../../infra/db/mongodb/mongodb-helper';

@Controller('processes')
export class ProcessesController {
  constructor(private readonly mongoDbHelper: MongoDbHelper) {}

  @Get()
  async loadProcesses(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<any> {
    try {
      const processes = await this.mongoDbHelper.getAllProcesses(page, limit);

      if (processes.length > 0) {
        return {
          data: processes,
          page,
          limit,
        };
      } else {
        return {
          message: 'Nenhum processo encontrado.',
        };
      }
    } catch (error) {
      console.log('Erro ao obter processos');
      return {
        message: 'Ocorreu um erro ao carregar os processos',
      };
    }
  }
}
