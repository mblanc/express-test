
/**
 * Module dependencies.
 */

var express = require('express');
require( './db' );
 var item = require('./routes/items'),
  foo = require('./routes/foos');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/foos', foo.findAll);
app.get('/foos/:id', foo.findById);
app.post('/foos', foo.addItem);
app.put('/foos/:id', foo.updateItem);
app.delete('/foos/:id', foo.deleteItem);

app.get('/items', item.findAll);
app.get('/items/:id', item.findById);
app.post('/items', item.addItem);
app.put('/items/:id', item.updateItem);
app.delete('/items/:id', item.deleteItem);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});