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
    @Query('inicio') inicio: string,
    @Query('numero') numero: string,
    @Query('resumo') resumo: string,
    @Query('itemDescricao') itemDescricao: string,
  ): Promise<any> {
    try {
      const filters = {};

      if (inicio) {
        filters['dataHoraInicioLances'] = {
          $gte: new Date(inicio),
        };
      }

      if (numero) {
        filters['numero'] = numero;
      }

      if (resumo) {
        filters['resumo'] = {
          $regex: new RegExp(resumo, 'i'),
        };
      }

      if (itemDescricao) {
        filters['items.descricao'] = {
          $regex: new RegExp(itemDescricao, 'i'),
        };
      }

      const processes = await this.mongoDbHelper.getAllProcesses(
        page,
        limit,
        filters,
      );

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
