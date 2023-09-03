import { MongoClient } from 'mongodb';

const url = 'mongodb://mongodb:27017';

async function initializeDatabase() {
  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    await client.connect();
    const db = client.db('db_bidding');

    await db.createCollection('processes');
    await db.createCollection('items');

    const lockExtractionsCollection = db.collection('lock_extractions');
    await lockExtractionsCollection.insertOne({
      _id: '64f3b2235462418e6ace2f3c',
      name: 'extraction',
      isLocked: false,
    });

    console.log('Banco de dados inicializado com sucesso.');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  } finally {
    client.close();
  }
}

initializeDatabase();
