import { Injectable } from '@nestjs/common';
// import { MongoDbConfigService } from '../../../main/config/mongodb-config.service';
import { Db, MongoClient } from 'mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoDbHelper {
  private client: MongoClient;

  constructor(private configService: ConfigService) {
    this.client = new MongoClient('mongodb://127.0.0.1:27017/db_bidding');
  }

  async connect(): Promise<void> {
    if (!this.client) {
      await this.client.connect();
    }
    console.log('Conectado ao mongodb');
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async clean(collectionName: string, document: any): Promise<any> {
    if (!this.client) {
      await this.connect();
    }
    try {
      const db: Db = this.client.db();
      const collection = db.collection(collectionName);
      await collection.deleteMany(document);
    } catch (error) {
      console.log('Erro while clean document collection', error);
    }
  }

  async saveExtractedBidding(
    collectionName: string,
    document: any,
  ): Promise<any> {
    if (!this.client) {
      await this.connect();
    }

    try {
      const db: Db = this.client.db();
      const collection = db.collection(collectionName);

      const { codigoLicitacao } = document;

      const documentAlreadyExists = collection.findOne({
        codigoLicitacao: codigoLicitacao,
      });

      if (!documentAlreadyExists) {
        await collection.insertOne(document);
      } else {
        await collection.updateOne({ codigoLicitacao }, { $set: document });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
