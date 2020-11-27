const geolib = require("geolib");

/*This module takes in a locatin and array of incidents,
  determines how many incidents are near the given location,
  and returns an object with a score and safety fields*/
exports.getScore = function (location, incidents) {
    const nearDist = 8;
    var incident;
    var score;
    var nearIncidents = 0;
    //console.log(incidents);
    //console.log(location);
    if ((typeof location == "undefined") ||
        !(location.hasOwnProperty("latitude") && location.hasOwnProperty("longitude"))) {
        score = {"score": "-1", "isSafe": "missing latitude or longitude"};
        return score;
    }

    if ((typeof location.latitude) != "number" || (typeof location.longitude) != "number") {
        score = {"score": "-1", "isSafe": "latitude or longitude not numbers"};
        return score;
    }

    for (incident of incidents) {
        if (!(incident.hasOwnProperty("latitude") && incident.hasOwnProperty("longitude"))) {
            score = {"score": "-1", "isSafe": "missing latitude or longitude"};
            return score;
        }
        else if (getdist(location, incident) <= nearDist) {
            nearIncidents++;
        }
    }
    score = makescore(nearIncidents);
    return score;
};

function makescore(nearIncidents){
    if (nearIncidents >= 10) {
        score = {"score": "1", "isSafe": "very unsafe"};
    } else if (nearIncidents >= 7) {
        score = {"score": "2", "isSafe": "unsafe"};
    } else if (nearIncidents >= 4) {
        score = {"score": "3", "isSafe": "somewhat safe"};
    } else if (nearIncidents >= 1) {
        score = {"score": "4", "isSafe": "safe"};
    } else {
        score = {"score": "5", "isSafe": "very safe"};
    }
    return score;
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