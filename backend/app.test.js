//installs:
//npm install --save-dev jest
//npm install supertest --save-dev supertest
//npm install @shelf/jest-mongodb --dev
//npm install mongodb-memory-server --save-dev
//npm install mongodb-memory-server-core --save-dev

/*
const {MongoMemoryServer} = require('mongodb-memory-server');
const jestMongodbConfig =  require('./jest-mongodb-config');
const mongod = new MongoMemoryServer();
*/
const mongoClient = require("mongodb").MongoClient;

const { expect } = require("@jest/globals");

var App = require("./app");
const supertest = require("supertest");
const request = supertest(App);

var connection;

describe("Integration tests", () => {    

    beforeAll(async () => {
        connection = await mongoClient.connect("mongodb://localhost:27017");
        //db = await connection.db(global.__MONGO_DB_NAME__);

    });

    const mockincidentlist = jest.fn();

    mockincidentlist.mockReturnValue([{"id" : "1", "title" : "mock1", "severity" : 5, 
                       "latitude" : 37.3631, "longitude" : -122.123},
                       {"id" : "2", "title" : "mock2", "severity" : 4, 
                       "latitude" : 37.222, "longitude" : -122.321},
                       {"id" : "3", "title" : "mock3", "severity" : 3, 
                       "latitude" : 37.444, "longitude" : -122.909}]);

    const mockincident1 = jest.fn();
    mockincident1.mockReturnValue({"title" : "mock1", "severity" : 5, 
                           "latitude" : 37.3631, "longitude" : -122.123});
    const mockincident2 = {"title" : "mock2", "severity" : 4, 
                           "latitude" : 37.361, "longitude" : -122.121};
    const mockincident3 = {"title" : "mock3", "severity" : 3, 
                           "latitude" : 37.3694, "longitude" : -122.1269};
    const malIncident1 = {"title" : "mal1", "severity" : 3.9, 
                            "latitude" : 37.3694, "longitude" : -122.1269};
    const malIncident2 = {"title" : "mal2", "severity" : 4, 
                            "latitude" : "BAD", "longitude" : "BAD"};
    const malIncident3 = {"title" : "mal3", "severity" : 2};

    afterAll(async (done) => {
        await request.delete("/shutdown");
        await connection.close(done);
        
        //await global.__MONGOD__.stop();
    });
    
    beforeEach(async () => {
        //to be added once more tests are implemented
    });

    afterEach( async () => {
        await request.delete("/clear");
    });
    
    it("should post and get the single mocked incident successfully", 
        async (done) => {
        
        var result = await request.post("/incident").send(mockincident1());

        const mock1 = mockincident1();
        
        //console.log(result);
        const response = await request.get("/incident");
        //console.log(response.body);
        expect(response.body[0].title).toBe(mock1.title);
        expect(response.body[0].severity).toBe(mock1.severity);
        expect(response.body[0].latitude).toBe(mock1.latitude);
        expect(response.body[0].longitude).toBe(mock1.longitude);
        expect(response.status).toBe(200);
        expect(result.status).toBe(200);

        //result = await request.delete("/incident");
        //console.log(mockincidentlist())
        done();
    });
    
    
    it("test posting incident with malformed severity",
        async (done) => {
        const response = await request.post("/incident").send(malIncident1);
        expect(response.status).toBe(401);
        done();
    });
    
    it("test posting incident with malformed latitude, longitude",
        async (done) => {
        const response = await request.post("/incident").send(malIncident2);
        expect(response.status).toBe(402);
        done();
    });

    it("test posting incident with no latitude, longitude",
        async (done) => {
        const response = await request.post("/incident").send(malIncident3);
        expect(response.status).toBe(403);
        done();
    });
    
    
    it("test get incident with an empty database", async (done) => {
        const response = await request.get("/incident");
        expect(response.status).toBe(201);
        done();
    });
    
    
    it("test getting a score", async (done) => {
        // reference location = [37.36459, -122.124928];

        //populate the database with some incidents

        //var result = await request.post("/incident").send(mockincident1());
        var result = await request.post("/incident").send(mockincident2);
        result = await request.post("/incident").send(mockincident3);
        result = await request.get("/score/37.36459/-122.124928").send(location);
        //console.log(result);
        expect(result.body.score).toBe("4");
        expect(result.body.isSafe).toBe("safe");
        expect(result.status).toBe(200);
        done();
    });
    
    it("test get score with malformed longitude/latitude", async (done) => {
        const response = await request.get("/score/BAD/BAD");
        expect(response.status).toBe(402);
        done();
    });

    it("test get score with no longitude/latitude", async (done) => {
        const response = await request.get("/score");
        expect(response.status).toBe(404);
        done();
    });
    
    it("test deleting an incident", async (done) => {
        var response = await request.post("/incident").send(mockincident2);
        response = await request.post("/incident").send(mockincident3);
        response = await request.delete("/incident").send(mockincident2);
        const result = await request.get("/incident");
        //console.log(mockincident2);
        expect(response.status).toBe(200);
        expect(result.body).toHaveLength(1);
        expect(result.body[0].title).toBe(mockincident3.title);
        expect(result.body[0].severity).toBe(mockincident3.severity);
        expect(result.body[0].latitude).toBe(mockincident3.latitude);
        expect(result.body[0].longitude).toBe(mockincident3.longitude);
        done();
    });

    it("test deleting incident that is not in database", async (done) => {
        var response = await request.post("/incident").send(mockincident3);
        response = await request.delete("/incident").send(mockincident2);
        const result = await request.get("/incident");
        expect(response.status).toBe(400);
        expect(result.body).toHaveLength(1);
        expect(result.body[0].title).toBe(mockincident3.title);
        expect(result.body[0].severity).toBe(mockincident3.severity);
        expect(result.body[0].latitude).toBe(mockincident3.latitude);
        expect(result.body[0].longitude).toBe(mockincident3.longitude);
        done();
    });
});
