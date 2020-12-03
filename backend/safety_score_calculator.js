const geolib = require("geolib");

//score array holds corresponding scores to number of incidents
//anything above 10 should map to index 10 of this array
const score = ["Safety score at this location is 5 (very safe)",
                "Safety score at this location is 4 (safe)",
                "Safety score at this location is 4 (safe)",
                "Safety score at this location is 4 (safe)",
                "Safety score at this location is 3 (somewhat safe)",
                "Safety score at this location is 3 (somewhat safe)",
                "Safety score at this location is 3 (somewhat safe)",
                "Safety score at this location is 2 (unsafe)",
                "Safety score at this location is 2 (unsafe)",
                "Safety score at this location is 2 (unsafe)",
                "Safety score at this location is 1 (very unsafe)"];

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
    const mToKm = 0.001;
    var dist = geolib.getDistance(location, 
        {latitude: incident.latitude, longitude: incident.longitude}, 1);
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
        return -1;
    }
    if (validLatLong(location)) {
        return -1;
    }
    if (checkIncidents(incidents)) {
        return -1;
    }
    return 0;
}

/*This module takes in a location and array of incidents,
  determines how many incidents are near the given location,
  and returns an object with a score and safety fields*/
exports.getScore = function (location, incidents) {
    const nearDist = 4;
    var incident;
    var score;
    var nearIncidents = 0;
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

