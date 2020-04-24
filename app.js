const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));

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
    millSeconds: Number,
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

app.get("/start", function (req, res) {
    const today = new Date();
    var millSeconds = today.getTime();
    const d = today.getDate();
    const m = today.getMonth() + 1;
    const y = today.getFullYear();
    const workerID = req.query.workerID;

    Worker.findOne({
        workerID: workerID
    }, function (err, foundWorker) {
        if (err) {
            console.log(err);
            res.send("0");

        } else if (foundWorker) {
            const newTimer = new Timer({
                worker: foundWorker,
                millSeconds: millSeconds,
                date: d + "/" + m + "/" + y
            });
            newTimer.save();
            res.send(foundWorker.firstName);
        } else {
            res.send("0");
        }

    });
});

app.get("/end", function (req, res) {
    const today = new Date();
    var millSeconds = today.getTime();
    const d = today.getDate();
    const m = today.getMonth() + 1;
    const y = today.getFullYear();
    const workerID = req.query.workerID;

    Timer.findOne({
        worker: {
            $elemMatch: {
                workerID: workerID
            }
        }
    }, function (err, foundTimer) {
        if (err) {
            console.log(err);
            res.send("0");
        } else if (foundTimer) {
            var totalMillSeconds = millSeconds - foundTimer.millSeconds;
            const hours = Math.floor(totalMillSeconds / 3600000);
            totalMillSeconds = totalMillSeconds - hours * 3600000;
            const minutes = Math.floor(totalMillSeconds / 60000);
            totalMillSeconds = totalMillSeconds - minutes * 60000;
            const newTotal = new Total({
                worker: foundTimer.worker,
                total: {
                    hours: hours,
                    minutes: minutes,
                    seconds: Math.floor(totalMillSeconds / 1000)
                },
                date: d + "/" + m + "/" + y
            });
            newTotal.save();
            foundTimer.remove();
            res.send(newTotal);
        } else {
            res.send("0");
        }
    });
});

app.listen("3000", function (err) {
    console.log("server started on port 3000");
});

