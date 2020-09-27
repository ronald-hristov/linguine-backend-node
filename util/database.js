const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb://localhost:27017/Linguine')
        .then(client => {
            console.log('Connected');
            _db = client.db();
            callback(client);
        }).catch(error => {
        console.log(error);
        throw error;
    });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found';
}

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;