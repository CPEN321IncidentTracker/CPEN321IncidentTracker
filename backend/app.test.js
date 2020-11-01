//installs:
//npm install --save-dev jest
//npm install supertest --save-dev supertest
//npm install @shelf/jest-mongodb --dev
//npm install mongodb-memory-server --save-dev
//npm install mongodb-memory-server-core --save-dev


const {MongoMemoryServer} = require('mongodb-memory-server');
const jestMongodbConfig =  require('./jest-mongodb-config');
const mongod = new MongoMemoryServer();

const {MongoClient} = require('mongodb');

const { expect } = require("@jest/globals");

const App = require('./app')
const supertest = require('supertest')
const request = supertest(App)

describe('GET tests', () =>{
    let connection;
    let db;

    beforeAll(async ()=> {
        
        const uri = await mongod.getUri();
        const dbName = await mongod.getDbName();
        //console.log(uri);
        //console.log(dbName);
        connection = await MongoClient.connect(uri, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
        });
        //db = await connection.db(global.__MONGO_DB_NAME__);
        db = await connection.db(dbName);
        
    });

    afterAll(async ()=> {
        
        await connection.deleteMany();
        await connection.close();
        await db.close();
        await jestMongodbConfig.stop();
        
        await MongoClient.close();
    });

    const mockincidentlist = jest.fn();

    mockincidentlist.mockReturnValue([{"id" : "1", "title" : "mock1", "severity" : 5, 
                       "latitude" : 37.3631, "longitude" : -122.123},
                       {"id" : "2", "title" : "mock2", "severity" : 4, 
                       "latitude" : 37.222, "longitude" : -122.321},
                       {"id" : "3", "title" : "mock3", "severity" : 3, 
                       "latitude" : 37.444, "longitude" : -122.909}]);

    const mockincident1 = {"title" : "mock1", "severity" : 5, 
                           "latitude" : 37.3631, "longitude" : -122.123};
    const mockincident2 = {"title" : "mock2", "severity" : 4, 
                           "latitude" : 37.222, "longitude" : -122.321};
    const mockincident3 = {"title" : "mock3", "severity" : 3, 
                           "latitude" : 37.444, "longitude" : -122.909};

    

    it('should return a an array consisting of the mocked incident', 
        async done=>{
        
        const collection = db.collection('myTable');

        //await collection.insertOne(mockincident1);
        
        var result = await request.post('/incident').send(mockincident1)
        
        //console.log(result);
        const response = await request.get('/incident')
        console.log(response.body)
        expect(response.body[0].title).toBe(mockincident1.title);
        expect(response.body[0].severity).toBe(mockincident1.severity);
        expect(response.body[0].latitude).toBe(mockincident1.latitude);
        expect(response.body[0].longitude).toBe(mockincident1.longitude);
        
        //console.log(mockincidentlist())
        done();
    });
});