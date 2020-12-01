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
        return {"score": "-1", "isSafe": "missing latitude or longitude"};
    }
    else if (validLatLong(location)) {
        return {"score": "-1", "isSafe": "latitude or longitude not numbers"};
    }
    score = {"score": "3", "isSafe": "somewhat safe"};
    return score;
};