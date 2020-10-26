const express = require('express')
const { read } = require('fs')
const app = express()
const mongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017"

app.use(express.json()) //enable json parsing

mongoClient.connect(url, (err, db) => {

    if (err) {
        console.log("Error while connecting mongo client")
    } else {
        const myDb = db.db('myDb')
        const collection = myDb.collection('myTable')

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


        collection.find({}).toArray((err, result) => {
            if (err) throw err
            console.log(result)

        })


        app.get('/incident', (req, res) => {
            collection.find({}).toArray((err, result) => {
                if (err) throw err
                console.log(result)
                res.send(result)
            })
        })
        
        app.post('/incident', (req, res) => {

            const newIncident = {
                title: req.body.title,
                severity: parseInt(req.body.severity),
                latitude: parseFloat(req.body.latitude),
                longitude: parseFloat(req.body.longitude)
            }

            console.log(newIncident.title)
            console.log(newIncident.severity)
            console.log(newIncident.latitude)
            console.log(newIncident.longitude)

            collection.insertOne(newIncident)
            res.status(200).send()

            
        })

        
    }
})

app.listen(3000, () => {
    console.log("Listening on port 3000...")
})

