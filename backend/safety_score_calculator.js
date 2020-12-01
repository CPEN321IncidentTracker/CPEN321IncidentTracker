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
        return score[parseInt(nearIncidents, 10)];
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

function filterBad(location, incidents) {
    if (hasLocation(location)) {
        return {"score": "-1", "isSafe": "missing latitude or longitude"};
    }
    if (validLatLong(location)) {
        return {"score": "-1", "isSafe": "latitude or longitude not numbers"};
    }
    if (checkIncidents(incidents)) {
        return {"score": "-1", "isSafe": "missing latitude or longitude"};
    }
    return 0;
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
    score = filterBad(location, incidents);
    if (score) {
        return score;
    }
    for (incident of incidents) {
        if (getdist(location, incident) <= nearDist) {
            nearIncidents++;
        }
    }
    score = makescore(nearIncidents);
    return score;
};

