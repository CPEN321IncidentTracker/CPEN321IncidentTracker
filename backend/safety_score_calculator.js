const geolib = require("geolib");

//score array holds corresponding scores to number of incidents
//anything above 10 should map to index 10 of this array
const score = [{"score": "5", "isSafe": "very safe"},
                   {"score": "4", "isSafe": "safe"},
                   {"score": "4", "isSafe": "safe"},
                   {"score": "4", "isSafe": "safe"},
                   {"score": "3", "isSafe": "somewhat safe"},
                   {"score": "3", "isSafe": "somewhat safe"},
                   {"score": "3", "isSafe": "somewhat safe"},
                   {"score": "2", "isSafe": "unsafe"},
                   {"score": "2", "isSafe": "unsafe"},
                   {"score": "2", "isSafe": "unsafe"},
                   {"score": "1", "isSafe": "very unsafe"}];

/*This function takes in a number of near incidents
  and returns a score according to the number of incidents*/
function makescore(nearIncidents){
    
    if (nearIncidents >= 10) {
        return score[10];
    } 
    else {
        return score[parseInt(nearIncidents)];
    }
}

/*This function returns the distance between
  the given location and incident in km*/
function getdist(location, incident) {
    //console.log(location);
    //console.log(incident);
    const mToKm = 0.001;
    var dist = geolib.getDistance(location, 
        {latitude: incident.latitude, longitude: incident.longitude}, 1);
    //console.log(dist * mToKm);
    return dist * mToKm;
}

function hasLocation(location) {
    if ((typeof location == "undefined") ||
        !(location.hasOwnProperty("latitude") && location.hasOwnProperty("longitude"))) {
        return true;
    }
    return false;
}

function validLatLong(location) {
    if ((typeof location.latitude) != "number" || (typeof location.longitude) != "number") {
        return true;
    }
    return false;
}

function valLoc(location) {
    if (hasLocation(location)) {
        return {"score": "-1", "isSafe": "missing latitude or longitude"};
    }
    else if (validLatLong(location)) {
        return {"score": "-1", "isSafe": "latitude or longitude not numbers"};
    }
    return 0;
}

//Checks if the incidents have valid latitude and longitudes
//returns false if all are fine
function checkIncidents(incidents) {
    var incident;
    for (incident of incidents) {
        if (!(incident.hasOwnProperty("latitude") && incident.hasOwnProperty("longitude"))) {
            return true;
        }
    }
    return false;
}

/*This module takes in a location and array of incidents,
  determines how many incidents are near the given location,
  and returns an object with a score and safety fields*/
exports.getScore = function (location, incidents) {
    const nearDist = 8;
    var incident;
    var score;
    var nearIncidents = 0;
    //console.log(incidents);
    //console.log(location);
    score = valLoc(location);
    if (score) {
        return score;
    }

    if (checkIncidents(incidents)) {
        return {"score": "-1", "isSafe": "missing latitude or longitude"};
    }

    for (incident of incidents) {
        if (getdist(location, incident) <= nearDist) {
            nearIncidents++;
        }
    }
    score = makescore(nearIncidents);
    return score;
};

