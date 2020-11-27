const express = require("express");
const { read } = require("fs");
const app = express();
const mongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const scoreCalc = require("./safety_score_calculator");
//const url = "mongodb://localhost:27017/app"

app.use(express.json()); //enable json parsing

const server = app.listen(3000);
/*
const server = app.listen(3000, () => {
    console.log("Listening on port 3000...")
});
*/
module.exports = server;

var myDb;
var collection;

mongoClient.connect(url, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    },(err, db) => {
    
    
    //if (err) {
        //console.log("Error while connecting mongo client");
        //throw err;
    //} else {
        myDb = db.db("myDb");
        collection = myDb.collection("myTable");

        /*const listOfIncidents = {incidentList : [
            {
                title: "Example1",
                severity: 5,
                latitude: 37.4567,
                longitude: -122.11475
            },
            {
                title: "Example2",
                severity: 3,
                latitude: 37.47347,
                longitude: -122.1349
            },
            {
                title: "Example3",
                severity: 2,
                latitude: 37.4631,
                longitude: -122.13859,
            }
        ]}

        collection.insertOne(listOfIncidents)*/
/*
        collection.insertOne({
            title: "Example1",
            severity: 5,
            latitude: 37.4567,
            longitude: -122.11475
        })

        collection.insertOne({
            title: "Example2",
            severity: 3,
            latitude: 37.47347,
            longitude: -122.1349
        })

        collection.insertOne({
            title: "Example3",
            severity: 2,
            latitude: 37.4631,
            longitude: -122.13859,
        })

*/
        collection.find({}).toArray((err, result) => {
            /*
            if (err){
                throw err;
            }
            */
            //console.log(result)
        }); 

        app.get("/incident", async (req, res) => {
            collection.find({}).toArray((err, result) => {
                if (result.length === 0) {
                    res.status(201).send(result);
                }
                else res.send(result);
                });
        });

        app.get("/score/:latitude/:longitude", async (req, res) => {
            collection.find({}).toArray((err, result) => {
                var score;
                //console.log(result)
                //console.log(req.params);
                if (!isNaN(Number(req.params.latitude)) && !isNaN(Number(req.params.latitude))) {
                    var lat = parseFloat(req.params.latitude);
                    var long = parseFloat(req.params.longitude);
                    var location = {latitude: lat, longitude: long};
                    score = scoreCalc.getScore(location, result);
                }
                else {
                    score = scoreCalc.getScore(req.params, result);
                }
                //console.log(score);

                if (score.score === "-1"){
                    if (score.isSafe.localeCompare("missing latitude or longitude")){
                        res.status(402).send();
                    }
                    else {
                        res.status(401).send();
                    }
                } 
                else {
                    res.send(score);
                }
                //collection.deleteMany()
                });
        });
        
        app.post("/incident", async (req, res) => {

            if (!Number.isInteger(req.body.severity)) {
                res.status(401).send();
            }
            else if (!(req.body.hasOwnProperty("latitude") && req.body.hasOwnProperty("longitude"))){
                res.status(403).send();
            }
            else if ((typeof req.body.latitude != "number") || 
                     (typeof req.body.longitude != "number")) {
                res.status(402).send();
            }
            else {
                const newIncident = {
                    title: req.body.title,
                    severity: parseInt(req.body.severity, 10),
                    latitude: parseFloat(req.body.latitude),
                    longitude: parseFloat(req.body.longitude)
                };
            /*
            console.log(newIncident.title)
            console.log(newIncident.severity)
            console.log(newIncident.latitude)
            console.log(newIncident.longitude)
            */
                collection.insertOne(newIncident);
                res.status(200).send();
            }
        });        

        //this function is used to close the
        //database connection and clear it,
        //also closes the app.listen port.
        //it shuts down the server and should not be
        //called from the frontend.
        app.delete("/shutdown", async (req, res) => {
            await collection.deleteMany();
            res.send("database cleared");
            db.close();
            server.close();
        });

        //this function is used to clear the database
        //The front end should not call this function
        app.delete("/clear", async (req, res) => {
            await collection.deleteMany();
            res.send("database cleared");
        });

    //}
});


//module.exports = app;
