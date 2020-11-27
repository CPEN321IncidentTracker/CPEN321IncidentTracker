


describe("safety score calculator tests", () => {
    var scoreCalc = require("./safety_score_calculator");
    jest.unmock("./safety_score_calculator");
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