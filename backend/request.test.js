const mongoClient = require("mongodb").MongoClient;

const { expect } = require("@jest/globals");

var App = require("./app");
const supertest = require("supertest");
const request = supertest(App);

var connection;

jest.mock("./safety_score_calculator");

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
    });

    afterEach( async () => {
        await request.delete("/clear");
    });

    it("should post and get the single mocked incident successfully", 
        async (done) => {
        
        var result = await request.post("/incident").send(mockincident1());

        const mock1 = mockincident1();
        
        const response = await request.get("/incident");
        expect(response.body[0].title).toBe(mock1.title);
        expect(response.body[0].severity).toBe(mock1.severity);
        expect(response.body[0].latitude).toBe(mock1.latitude);
        expect(response.body[0].longitude).toBe(mock1.longitude);
        expect(response.status).toBe(200);
        expect(result.status).toBe(200);
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
        const response = await request.get("/score/37.36459/-122.124928");
        expect(response.body.score).toBe("Safety score at this location is 3 (somewhat safe)");
        expect(response.status).toBe(200);
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

    it("test get score with no longitude/latitude", async (done) => {
        const response = await request.get("/score//");
        expect(response.status).toBe(404);
        done();
    });

    it("test get score with no longitude", async (done) => {
        const response = await request.get("/score/100");
        expect(response.status).toBe(404);
        done();
    });

    it("test deleting an incident", async (done) => {
        var response = await request.post("/incident").send(mockincident2);
        response = await request.post("/incident").send(mockincident3);
        response = await request.post("/delete").send(mockincident2);
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
        response = await request.post("/delete").send(mockincident2);
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