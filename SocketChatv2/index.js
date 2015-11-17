var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient, format = require('util').format;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
	var greetMsg = 'A user has connected';
	io.emit('chat message', greetMsg);
	console.log("user connected");
	socket.on('chat message', function(msg){
		if(msg.length == 0){
			console.log("msg too short");
		}else{
			io.emit('chat message', msg);
		}
	});

	socket.on('addToDB', function(object){

		MongoClient.connect("mongodb://localhost:27017/test", function(err, db){
			
			if(err)
			throw err;
			else
			console.log("connected");

		var collection = db.collection("posts");
		collection.insert(object, function(err, docs){
			collection.count(function(err, count){
				console.log(format("count = %s", count));
			});
		});
		});
	});
});

http.listen(3000, function(){
	console.log("listening on *:3000");
});
