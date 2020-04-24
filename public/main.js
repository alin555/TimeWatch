var today = new Date();

const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

var currentDate = today.toLocaleDateString('he-IL', options);

$("#date").html(currentDate);

startTime();

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);    
    $("#time").html(h + ":" + m + ":" + s);
    setTimeout(startTime, 500);
};

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }; // add zero in front of numbers < 10
    return i;
};
