var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient, format = require('util').format;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){

	//getList();

	var posts = [];
	MongoClient.connect("mongodb://localhost:27017/test", function(err, db){
		if(err)
			throw err;
		else
			console.log("connected");

		var collection = db.collection("posts");
		collection.find({"type":"post"}, {_id:0}).each(function(err, doc){
			if(err)
				throw err;
			else
				console.log("no error");

			if(doc != null)
				posts.push(doc);

			io.emit('showList', posts);
		});
	});

	

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
					//print out the count
				});
			});
		});
	});

	socket.on('updateDBUP', function(id){
		MongoClient.connect("mongodb://localhost:27017/test", function(err, db){
			if(err)
				throw err;
			else
				console.log("update");

			/* --------------REMOVE THIS CODE BELOW--------------- */
			var temp1, temp2, collection; 
			collection = db.collection("posts");
			temp1 = collection.find({"id":id});
			temp2 = collection.find({"id":id++});
			console.log(collection.find({"id":id}));
			
			/* -----------ADD THE CODE I UPLOADED HERE------------ */

		});
	});

	socket.on('updateDBDOWN', function(id){
		MongoClient.connect("mongodb://localhost:27017/test", function(err, db){
			if(err)
				throw err;
			else
				console.log("test");
		});
	});

});

http.listen(3000, function(){
	console.log("listening on *:3000");
});
