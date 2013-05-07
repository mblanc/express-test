var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Item = new Schema({
	title: String,
	content: String,
	updated_at: Date
});

mongoose.model('Item', Item);

mongoose.connect('mongodb://localhost/express-test');