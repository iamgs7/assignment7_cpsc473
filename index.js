//////// MODULES ///////////
var express = require('express');
var bodyParser = require('body-Parser');
var MongoClient = require('mongodb').MongoClient;

/////// VARIABLES /////////
var url = 'mongodb://localhost:27017/test';

////// EXPRESS CONNECT ////
var app = express();
app.use(bodyParser.json());


////// ROUTES ///////
app.get("/links", function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.warn(err.message);
        }
        else {
            var collection = db.collection('links');
            collection.find().toArray(function (err, items) {
                res.json(items);
            });
        }
    });
});

app.post("/links", function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.warn(err.message);
            res.send("Failed to connect to the db");
        }
        else {
            var link = req.body.link;
            var title = req.body.title;
            var collection = db.collection('links');
            collection.insert({title: title, link: link, clicks: 0 }, function (err, result) {
                console.log("Successfully created and updated the db");
                res.json({"Status" : "Successfully Inserted Data"});
            });
        }
    });
});

app.get("/click/:title", function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.warn(err.message);
            res.send("failed to connect to the db");
        }
        else {
            var collection = db.collection('links');
            collection.update(
                { title: req.params.title },
                { 
                  $inc: 
                    { clicks: 1 } 
                },
                function (err, object) {
                    if (err) {
                        console.warn(err.message);
                    } else {
                        //res.redirect(object.value.link);
                        console.log("Updated");
                        res.json({"Status" : "Updated Clicks"});
                    }
                });
            }
    });
});

/////// APP START //////////
app.listen(3000, function () {
    console.log('App running on port 3000!');
});