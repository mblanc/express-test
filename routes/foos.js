var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {
    auto_reconnect: true
});
var db = new Db('express-test', server, {
    w: 1
});

db.open(function(err, db) {
    if (!err) {
        console.log("Connected to 'express-test' database");
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    db.collection('foos', function(err, collection) {
        collection.findOne({
            '_id': new BSON.ObjectID(id)
        }, function(err, foo) {
            if (foo) {
                res.send(foo);
            } else {
                console.log('404');
                res.status(404);
                res.end();
            }
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('foos', function(err, collection) {
        collection.find().toArray(function(err, foos) {
            res.send(foos);
        });
    });
};

exports.addItem = function(req, res) {
    var foo = req.body;
    console.log('Adding foo: ' + JSON.stringify(foo));
    db.collection('foos', function(err, collection) {
        collection.insert(foo, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.status(201);
                res.location('foos/' + result[0]._id);
                res.end();
            }
        });
    });
};

exports.updateItem = function(req, res) {
    var id = req.params.id;
    var foo = req.body;
    console.log('Updating foo: ' + id);
    console.log(JSON.stringify(foo));
    db.collection('foos', function(err, collection) {
        collection.update({
            '_id': new BSON.ObjectID(id)
        }, foo, {
            safe: true
        }, function(err, result) {
            if (err) {
                console.log('Error updating foo: ' + err);
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('' + result + ' document(s) updated');
                res.end();
            }
        });
    });
};

exports.deleteItem = function(req, res) {
    var id = req.params.id;
    console.log('Deleting foo: ' + id);
    db.collection('foos', function(err, collection) {
        collection.remove({
            '_id': new BSON.ObjectID(id)
        }, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred - ' + err
                });
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send();
            }
        });
    });
};