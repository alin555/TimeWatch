var today = new Date();
const apiUrl = "http://localhost:3000";

const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

var currentDate = today.toLocaleDateString('he-IL', options);

$("#date").html(currentDate);

startTime();

$("#start").click(function () {
    const workerID = $("#workerID").val();
    $("#workerID").val("");

    $.get(apiUrl + "/start?workerID=" + workerID, function (data) {
        if (data === "0") {
            $("#total").html("מספר עובד לא קיים, נסה שנית");
            setTimeout(function () {
                $("#total").html(" ");
            }, 1000);

        } else {
            $("#total").html(data + " נכנסת בהצלחה");
            setTimeout(function () {
                $("#total").html(" ");
            }, 1000);
        }
    });
});

$("#end").click(function () {
    const workerID = $("#workerID").val();
    $("#workerID").val("");

    $.get(apiUrl + "/end?workerID=" + workerID, function (data) {
        if (data === "0") {
            $("#total").html("מספר עובד לא קיים, נסה שנית");
            setTimeout(function () {
                $("#total").html(" ");
            }, 1000);
        } else {
            var h = data.total.hours;
            var m = data.total.minutes;
            var s = data.total.seconds;
            m = checkTime(m);
            s=checkTime(s);
            $("#total").html("עבדת: " + h + ":" + m + ":" + s + data.worker[0].firstName + " יצאת בהצלחה");
            setTimeout(function () {
                $("#total").html(" ");
            }, 3000);
        }
    });
});

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