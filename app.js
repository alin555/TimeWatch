const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/workersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const workerScheme = new mongoose.Schema({
    workerID: Number,
    firstName: String,
    lastName: String
});

const timerScheme = new mongoose.Schema({
    worker: [workerScheme],
    seconds: Number,
    date: String
});

const totalScheme = new mongoose.Schema({
    worker: [workerScheme],
    total: {
        hours: Number,
        minutes: Number,
        seconds: Number
    },
    date: String
});

const Worker = new mongoose.model("Worker", workerScheme);

const Timer = new mongoose.model("Timer", timerScheme);

const Total = new mongoose.model("Total", totalScheme);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// const worker1 = new Worker({
//     workerID: 1,
//     firstName: "alon",
//     lastName: "zrihen"
// });

// const worker2 = new Worker({
//     workerID: 2,
//     firstName: "yael",
//     lastName: "tamir"
// });

// const worker3 = new Worker({
//     workerID: 3,
//     firstName: "nati",
//     lastName: "hazbani"
// });
// worker1.save();
// worker2.save();

// worker3.save();


app.post("/post", function (req, res) {
    const today = new Date();
    var millSeconds = today.getTime();
    const y = today.getDate();
    const m = today.getMonth() + 1;
    const d = today.getDay() + 1;
    const action = req.body.submit;
    const workerID = req.body.workerID;

    if (action === "enter") {
        Worker.findOne({
            workerID: workerID
        }, function (err, foundWorker) {
            if (err) {
                console.log(err);
            } else {
                if (foundWorker) {
                    const newTimer = new Timer({
                        worker: foundWorker,
                        seconds: millSeconds,
                        date: d + "/" + m + "/" + y
                    });
                    newTimer.save();
                    res.redirect("/");
                }
            }
        });
    } else {
        Timer.findOne({
            worker: {
                $elemMatch: {
                    workerID: workerID
                }
            }
        }, function (err, foundTimer) {
            if (foundTimer) {
                var totalSeconds = millSeconds - foundTimer.seconds;
                const totalHours = Math.floor(totalSeconds / 3600000);
                totalSeconds = totalSeconds - (totalHours * 3600000);
                const totalMinutes = Math.floor(totalSeconds / 60000);
                totalSeconds = totalSeconds - (totalMinutes * 60000);
                const newTotal = new Total({
                    worker: foundTimer.worker,
                    total: {
                        hours: totalHours,
                        minutes: totalMinutes,
                        seconds: totalSeconds / 1000
                    },
                    date: foundTimer.date
                });
                newTotal.save();
                foundTimer.remove();
                res.redirect("/");
            }
        });
    }
});




app.listen("3000", function (err) {
    console.log("server started on port 3000");
});