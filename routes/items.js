var mongoose = require('mongoose');
var Item = mongoose.model('Item');
var utils    = require( 'connect' ).utils;

exports.findById = function(req, res) {
	Item.findById(req.params.id, function(err, item) {
		if (item) {
			res.send(item);
		} else {
			res.status(404);
			res.end();
		}
	});
};

exports.findAll = function(req, res) {
	Item.find(function(err, items, count) {
		res.send(items);
	});
};

exports.addItem = function(req, res, next) {
	new Item({
		title: req.body.title,
		content: req.body.content,
		updated_at: Date.now()
	}).save(function(err, item, count) {
		if (err) {
			console.log(err);
			return next( err );
		} else {
			console.log('Success: ' + JSON.stringify(item));
			res.status(201);
			res.location('items/' + item._id);
			res.end();
		}
	});
};

exports.updateItem = function(req, res) {
	Item.findById(req.params.id, function(err, item) {
		item.title = req.body.title;
		item.content = req.body.content;
		item.updated_at = Date.now();
		item.save(function(err, item, count) {
			if (err) {
				console.log('Error updating item: ' + err);
				res.send({
					'error': 'An error has occurred'
				});
			} else {
				console.log('' + item + ' document(s) updated');
				res.end();
			}
		});
	});
};

exports.deleteItem = function(req, res) {
	var id = req.params.id;
	Item.findById(req.params.id, function(err, item) {
		item.remove(function(err, item) {
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