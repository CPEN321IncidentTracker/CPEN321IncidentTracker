//installs:
//npm install --save-dev jest
//npm install supertest --save-dev supertest
//npm install @shelf/jest-mongodb --dev
//npm install mongodb-memory-server --save-dev
//npm install mongodb-memory-server-core --save-dev

const { expect } = require("@jest/globals");

const app = require('./app')
const supertest = require('supertest')
const request = supertest(app)
const {MongoClient} = require('mongodb');


describe('GET tests', () =>{
    let connection;
    let db;

    beforeAll(async ()=> {
        console.log(global.__MONGO_URI__);
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser : true
        });
        //db = await connection.db(global.__MONGO_DB_NAME__);
        db = await connection.db(global.__MONGO_DB_NAME__);
    });

    afterAll(async ()=> {
        await connection.close();
        await db.close();
    });

    const mockincidentlist = jest.fn();

    mockincidentlist.mockReturnValue([{"id" : "1", "title" : "mock1", "severity" : 5, 
                       "latitude" : 37.3631, "longitude" : -122.123},
                       {"id" : "2", "title" : "mock2", "severity" : 4, 
                       "latitude" : 37.222, "longitude" : -122.321},
                       {"id" : "3", "title" : "mock3", "severity" : 3, 
                       "latitude" : 37.444, "longitude" : -122.909}]);

    it('should return a collection consisting of three mocked incidents', 
        async done=>{

        const response = await request.get('/incident')
        //console.log(response)
        expect(response == mockincidentlist)
        //console.log(mockincidentlist())
        done();
    });
});