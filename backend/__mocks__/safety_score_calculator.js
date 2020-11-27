exports.getScore = function (location, incidents) {
    var score;
    //console.log(location);
    if ((typeof location == "undefined") ||
        !(location.hasOwnProperty("latitude") && location.hasOwnProperty("longitude"))) {
        score = {"score": "-1", "isSafe": "missing latitude or longitude"};
        return score;
    }
    else if ((typeof location.latitude) != "number" || (typeof location.longitude) != "number") {
        score = {"score": "-1", "isSafe": "latitude or longitude not numbers"};
        return score;
    }
    score = {"score": "3", "isSafe": "somewhat safe"};
    return score;
};