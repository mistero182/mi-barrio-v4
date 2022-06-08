import {MongoClient} from 'mongodb'
const dbConfig = {
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    address: process.env.DATABASE_ADDRESS,
    port: process.env.DATABASE_PORT
};

const MONGO_URL = 'mongodb://' + dbConfig.username + ':' + dbConfig.password + '@' + dbConfig.address + ':' + dbConfig.port + '/' + dbConfig.database;

const dbConnect = async (dbInstance: any) => {
    if (dbInstance) {
        console.log('Using Previous connection to DB')
        return Promise.resolve(dbInstance);
    } else {
        try {
            const client = await MongoClient.connect(MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true });
            dbInstance = client.db(dbConfig.database);
            console.log('Connection to DB Success!!!')
            return dbInstance;
        } catch (e) {
            console.log('Connection to DB Failed!!!', e.message)
        }
    }
}

export default dbConnect