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

			var collections = db.collection('posts');

			/*var temp1;
			console.log(id);
			function a() {
				return collections.findOne({id:id}, function(err, document) {
				console.log("In function "+ document.content);
				return document.content;
				//console.log(temp1);
			});
				console.log(temp1);
			}
*/
			var temp1 = collections.findOne({id:id});
			var temp2 = collections.findOne({id:(id+1)});

			var content1, content2;

			if(temp1)
			{
				var postContent = temp1.content;
				content1 = postContent.toJSON();
			}

			if(temp2)
			{
				var postContent = temp2.content;
				content2 = tojson(postContent);
			}

			collections.update({id:id}, {$set: {content:content2}});
			collections.update({id:(id+1)}, {$set: {content:content1}});
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
