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

//This function converts the input parameters to numbers
//only if they can be converted into such. If they cannot
//be converted, it directly feeds the inputs parameters and lets
//getScore deal with the irregularities, and returns the result
function reqToScore (req, result) {
    var score;
    if (!isNaN(Number(req.params.latitude)) && !isNaN(Number(req.params.latitude))) {
        var lat = parseFloat(req.params.latitude);
        var long = parseFloat(req.params.longitude);
        var location = {latitude: lat, longitude: long};
        score = scoreCalc.getScore(location, result);
    }
    else {
        score = scoreCalc.getScore(req.params, result);
    }
    return score;
}

function checkLatLong (req) {
    if ((typeof req.body.latitude != "number") || 
             (typeof req.body.longitude != "number")) {
        return 402;
    }
    return 0;
}

function checkPost(req) {
    if (!Number.isInteger(req.body.severity)) {
        return 401;
    }
    if (!(req.body.hasOwnProperty("latitude") && req.body.hasOwnProperty("longitude"))){
        return 403;
    }
    else {
        return checkLatLong(req);
    }
}

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
                    return;
                }
                res.send(result);
                });
        });

        //If latitude or longitude are not present, then this request
        //handler will not be be triggered, causing an automatic 404 error
        app.get("/score/:latitude/:longitude", async (req, res) => {
            collection.find({}).toArray((err, result) => {
                var score;
                //console.log(result)
                //console.log(req.params);
                
                //console.log(score);
                score = reqToScore(req, result);

                if (score === -1){
                    res.status(402).send();
                    return;
                }
                //console.log(score);
                res.send({score});
                //collection.deleteMany()
                });
        });
        
        app.post("/incident", async (req, res) => {
            var status;
            
            status = checkPost(req);

            if (status) {
                res.status(status).send();
                return;
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

        app.post("/delete", async (req, res) => {
            var deleted;
            var item;
            //item = await collection.findOne({title: req.body.title, latitude: req.body.latitude,
            //    longitude: req.body.longitude});
            //console.log(item);
            
            deleted = await collection.deleteOne({title: req.body.title, latitude: req.body.latitude,
                longitude: req.body.longitude}, true);
            //console.log(req.body);
            //console.log(deleted);
            if (deleted.deletedCount !== 1) {
                res.status(400).send();
            }
            else {
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
