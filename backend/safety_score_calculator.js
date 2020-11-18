const geolib = require("geolib");

/*This module takes in a locatin and array of incidents,
  determines how many incidents are near the given location,
  and returns an object with a score and safety fields*/
exports.getScore = function (location, incidents) {
    const near_dist = 4;
    var incident;
    var score;
    var near_incidents = 0;
    //console.log(incidents);
    for (incident of incidents) {
        if (getdist(location, incident) <= near_dist)
        near_incidents++;
    }
    if (near_incidents >= 10) {
        score = {"score": "1", "isSafe": "very unsafe"};
    } else if (near_incidents >= 7) {
        score = {"score": "2", "isSafe": "unsafe"};
    } else if (near_incidents >= 4) {
        score = {"score": "3", "isSafe": "somewhat safe"};
    } else if (near_incidents >= 1) {
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