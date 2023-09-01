import { Injectable } from '@nestjs/common';
import { MongoDbConfigService } from '../../../config/mongodb-config.service';

@Injectable()
export class MongoDbHelper {
  constructor(private readonly mongoDbConfigService: MongoDbConfigService) {}

  async saveExtractedBidding(document: any) {
    try {
      const collection = this.mongoDbConfigService
        .getDatabase()
        .collection('processes');

      const { codigoLicitacao } = document;

      const biddingAlreadyExists = await collection.findOne({
        codigoLicitacao: codigoLicitacao,
      });

      if (biddingAlreadyExists !== null) {
        await collection.updateOne({ codigoLicitacao }, { $set: document });
      } else {
        await collection.insertOne(document);
      }
    } catch (error) {
      console.error(
        `Erro ao salvar licitação ${document.codigoLicitacao}`,
        error,
      );
      throw error;
    }
  }
}
