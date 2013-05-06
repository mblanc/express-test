var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('express-test', server, {w: 1});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'express-test' database");
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    db.collection('items', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            if (item) {
                res.send(item); 
            } else {
                console.log('404');
                res.status(404);
                res.end();
            }
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('items', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addItem = function(req, res) {
    var item = req.body;
    console.log('Adding item: ' + JSON.stringify(item));
    db.collection('items', function(err, collection) {
        collection.insert(item, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.status(201);
                res.location('items/' + result[0]._id)
                res.end();
            }
        });
    });
}

exports.updateItem = function(req, res) {
    var id = req.params.id;
    var item = req.body;
    console.log('Updating item: ' + id);
    console.log(JSON.stringify(item));
    db.collection('items', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, item, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating item: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.end();
            }
        });
    });
}

exports.deleteItem = function(req, res) {
    var id = req.params.id;
    console.log('Deleting item: ' + id);
    db.collection('items', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send();
            }
        });
    });
}