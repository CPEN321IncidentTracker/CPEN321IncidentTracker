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

//I Can't figure out how to unmock between tests yet, when 
//focusing on Test request handler, uncomment below
//jest.mock("./safety_score_calculator");

describe("safety score calculator tests", () => {
    var scoreCalc = require("./safety_score_calculator");
    jest.unmock("./safety_score_calculator")
    const location = {latitude: 100, longitude: 100};
    var score;

    var incidentList = [];
    const incident1 = {"id": 1, "title" : "1", "severity" : 5, 
                "latitude" : 200, "longitude" : -122.123};
    const incident2 = {"id": 2, "title" : "2", "severity" : 5, 
                "latitude" : 100.001, "longitude" : 100.001};
    const incident3 = {"id": 3, "title" : "3", "severity" : 5, 
                "latitude" : 99.999, "longitude" : 99.999};
    const incident4 = {"id": 4, "title" : "4", "severity" : 4, 
                "latitude" : 100.002, "longitude" : 100.002};
    const incident5 = {"id": 5, "title" : "5", "severity" : 5, 
                "latitude" : 100.003, "longitude" : 100.003};
    const incident6 = {"id": 6, "title" : "6", "severity" : 4, 
                "latitude" : 100.004, "longitude" : 100.004};
    const incident7 = {"id": 7, "title" : "7", "severity" : 3, 
                "latitude" : 100.005, "longitude" : 100.005};
    const incident8 = {"id": 8, "title" : "8", "severity" : 2, 
                "latitude" : 99.998, "longitude" : 99.998};
    const incident9 = {"id": 9, "title" : "9", "severity" : 4, 
                "latitude" : 99.997, "longitude" : 99.997};
    const incident10 = {"id": 10, "title" : "10", "severity" : 1, 
                "latitude" : 99.996, "longitude" : 99.996};
    const incident11 = {"id": 11, "title" : "11", "severity" : 3, 
                "latitude" : 99.995, "longitude" : 99.995};

    const badIncident = {"id": 12, "title" : "badincident", "severity" : 3};
    const badLocation = {what: "nothing"};
    const malLocation = {latitude: "wrong", longitude: "wrong"};

    beforeAll(async () => {
        jest.unmock("./safety_score_calculator");
    });

    it("Location near no incidents", async (done) => {
        incidentList.push(incident1);
        score = scoreCalc.getScore(location, incidentList);
        expect(score.score).toBe("5");
        expect(score.isSafe).toBe("very safe");
        done();
    });

    it("Location near 2 incidents", async (done) => {
        incidentList.push(incident2);
        incidentList.push(incident3);
        score = scoreCalc.getScore(location, incidentList);
        expect(score.score).toBe("4");
        expect(score.isSafe).toBe("safe");
        done();
    });

    it("Location near 5 incidents", async (done) => {
        incidentList.push(incident4);
        incidentList.push(incident5);
        incidentList.push(incident6);
        score = scoreCalc.getScore(location, incidentList);
        expect(score.score).toBe("3");
        expect(score.isSafe).toBe("somewhat safe");
        done();
    });

    it("Location near 7 incidents", async (done) => {
        incidentList.push(incident7);
        incidentList.push(incident8);
        score = scoreCalc.getScore(location, incidentList);
        expect(score.score).toBe("2");
        expect(score.isSafe).toBe("unsafe");
        done();
    });

    it("Location near 10 incidents", async (done) => {
        incidentList.push(incident9);
        incidentList.push(incident10);
        incidentList.push(incident11);
        score = scoreCalc.getScore(location, incidentList);
        expect(score.score).toBe("1");
        expect(score.isSafe).toBe("very unsafe");
        done();
    });

    it("Location is missing latitude and longitude", async (done) => {
        score = scoreCalc.getScore(badLocation, incidentList);
        expect(score.score).toBe("-1");
        expect(score.isSafe).toBe("missing latitude or longitude");
        done();
    });

    it("An incident is missing latitude and longitude", async (done) => {
        incidentList.push(badIncident);
        score = scoreCalc.getScore(location, incidentList);
        expect(score.score).toBe("-1");
        expect(score.isSafe).toBe("missing latitude or longitude");
        done();
    });

    it("Location latitude and longitude malformed", async (done) => {
        score = scoreCalc.getScore(malLocation, incidentList);
        expect(score.score).toBe("-1");
        expect(score.isSafe).toBe("latitude or longitude not numbers");
        done();
    });

});

describe("Test request handler", () => {
    
    beforeAll(async () => {
        connection = await mongoClient.connect("mongodb://localhost:27017");
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
                           "latitude" : 37.3610, "longitude" : -122.121};
    const mockincident3 = {"title" : "mock3", "severity" : 3, 
                           "latitude" : 37.3694, "longitude" : -122.1269};
    const malIncident1 = {"title" : "mal1", "severity" : 3.9, 
                            "latitude" : 37.3694, "longitude" : -122.1269};
    const malIncident2 = {"title" : "mal2", "severity" : 4, 
                            "latitude" : "BAD", "longitude" : "BAD"};
    const malIncident3 = {"title" : "mal3", "severity" : 2};

    afterAll(async (done) => {
        
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

    it("test getting score", async (done) => {
        
        const response = await request.get("/score/123.123/-321.321");
        expect(response.body.score).toBe("3");
        expect(response.body.isSafe).toBe("somewhat safe");
        expect(response.status).toBe(200);
        done();
    });

    it("test get score with malformed longitude/latitude", async (done) => {
        const response = await request.get("/score/BAD/BAD");
        expect(response.status).toBe(402);
        done();
    })

    it("test get score with no longitude/latitude", async (done) => {
        const response = await request.get("/score");
        expect(response.status).toBe(401);
        done();
    })

});


describe("Integration tests", () => {    

    beforeAll(async () => {
        
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
                           "latitude" : 37.3610, "longitude" : -122.121};
    const mockincident3 = {"title" : "mock3", "severity" : 3, 
                           "latitude" : 37.3694, "longitude" : -122.1269};

    afterAll(async (done) => {
        await request.delete("/incident");
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
        
        done();
    });

    it("test get score with malformed longitude/latitude", async (done) => {
        const response = await request.get("/score/BAD/BAD");
        expect(response.status).toBe(402);
        done();
    })

    it("test get score with no longitude/latitude", async (done) => {
        const response = await request.get("/score");
        expect(response.status).toBe(401);
        done();
    })

});