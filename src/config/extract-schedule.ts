import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { runExtraction, runExtractionItems } from '../application/services';

@Injectable()
export class ExtractSchedule {
  @Cron(CronExpression.EVERY_4_HOURS)
  async start() {
    try {
      console.log('***Agendamento: iniciando extração automática');
      await runExtraction();
      await runExtractionItems();
      console.log('***Agendamento: finalizando extração automática');
    } catch (error) {
      console.error('Erro ao executar extração automática: ', error);
      throw error;
    }
  }
}
