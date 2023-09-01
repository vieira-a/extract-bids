import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MongoDbConfigService implements OnApplicationBootstrap {
  private client: MongoClient;
  private db: Db;

  async onApplicationBootstrap() {
    try {
      this.client = new MongoClient('mongodb://localhost:27017');

      await this.client.connect();
      this.db = this.client.db('db_bidding');
      console.log(
        `MongoDB is running at localhost:27017/${this.db.databaseName}`,
      );
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error);
      throw error;
    }
  }

  getDatabase() {
    return this.db;
  }
}
