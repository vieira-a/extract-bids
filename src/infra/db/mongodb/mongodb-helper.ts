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
        console.log(
          `*** MongoDB: processo ${document.codigoLicitacao} salvo com sucesso`,
        );
      }
    } catch (error) {
      console.error(
        `Erro ao salvar licitação ${document.codigoLicitacao}`,
        error,
      );
      throw error;
    }
  }

  async saveProcessItems(document: any) {
    try {
      const collection = this.mongoDbConfigService
        .getDatabase()
        .collection('items');

      const { codigoLicitacao, codigo } = document;

      const itemProcessAlreadyExists = await collection.findOne({
        codigoLicitacao: codigoLicitacao,
        codigo: codigo,
      });

      if (itemProcessAlreadyExists !== null) {
        await collection.updateOne(
          { codigoLicitacao, codigo },
          { $set: document },
        );
      } else {
        await collection.insertOne(document);
        console.log(
          `*** MongoDB: itens da licitação ${document.codigoLicitacao}, código ${document.codigo} salvo com sucesso`,
        );
      }
    } catch (error) {
      console.log(
        `Erro ao salvar item da solicitação ${document.codigoLicitacao}`,
        error,
      );
      throw error;
    }
  }

  async getAllProcessCodes() {
    try {
      const collection = this.mongoDbConfigService
        .getDatabase()
        .collection('processes');

      const documentos = await collection
        .find({}, { projection: { codigoLicitacao: 1 } })
        .toArray();

      const processesCodes = documentos.map(
        (documento) => documento.codigoLicitacao,
      );
      return processesCodes;
    } catch (error) {
      console.error('Erro ao recuperar códigos de licitação:', error);
      throw error;
    }
  }
}
