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

exports.getScore = function (location, incidents) {
    var score;
    //console.log(location);
    if (hasLocation(location)) {
        return -1;
    }
    else if (validLatLong(location)) {
        return -1;
    }
    score = "Safety score at this location is 3 (somewhat safe)";
    return score;
};