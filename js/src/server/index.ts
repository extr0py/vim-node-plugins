var express = require("express");
var app = express();

console.log("hello world4");

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/api/vim", function (req, res) {
    res.send("Open for requests");
});

app.post("/api/vim/start/:servername/:plugin", (req, res) => {
    console.log(req.params.servername);
    console.log(req.params.plugin);
    res.send("done");
});

app.post("/api/stop", function(req, res) {
    res.send("closing server.");
    process.exit();
});

app.listen(3000, function () {
    console.log("Listening on 3000");
});
