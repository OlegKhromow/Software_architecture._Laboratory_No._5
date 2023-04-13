const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const {
    MONGO_DB_HOSTNAME,
    MONGO_DB_PORT,
    MONGO_DB
} = process.env
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    //useFindAndModify: false
}

const url = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;
const sessionScheme = new Schema({movie: String, date: String, time: String}, {versionKey: false});
const Session = mongoose.model("Session", sessionScheme);

app.use(express.static(__dirname + "/public"));

mongoose.set("strictQuery", false);
mongoose.connect(url, options,
    function(err){
        if(err) return console.log(err);
        app.listen(3000, function(){
            console.log("Сервер очікує підключення...");
        });
    });

app.get("/api/sessions", function(req, res){

    Session.find({}, function(err, sessions){

        if(err) return console.log(err);
        res.send(sessions)
    });
});

app.get("/api/sessions/:id", function(req, res){

    const id = req.params.id;
    Session.findOne({_id: id}, function(err, session){
        if(err) return console.log(err);
        res.send(session);
    });
});

app.post("/api/sessions", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const sessionmovie = req.body.movie;
    const sessiondate = req.body.date;
    const sessiontime = req.body.time;
    const session = new Session({movie: sessionmovie, date: sessiondate, time: sessiontime});

    session.save(function(err){
        if(err) return console.log(err);
        res.send(session);
    });
});

app.delete("/api/sessions/:id", function(req, res){

    const id = req.params.id;
    Session.findByIdAndDelete(id, function(err, session){
        if(err) return console.log(err);
        res.send(session);
    });
});

app.put("/api/sessions", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const sessionmovie = req.body.movie;
    const sessiondate = req.body.date;
    const sessiontime = req.body.time;
    const newsession = {date: sessiondate, movie: sessionmovie, time: sessiontime};

    Session.findOneAndUpdate({_id: id}, newsession, {new: true}, function(err, session){
        if(err) return console.log(err);
        res.send(session);
    });
});
