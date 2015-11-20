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

			var temp1, temp2, collection; 
			collection = db.collection("posts");

			var cursor = collection.find({"id":id});
			cursor.each(function(err, doc){
				if(err)
					throw err;
				else
					console.log("all good");

				if(doc != null){
					temp1 = doc;
				}else{
					console.log("there was an issue");
				}
			});

			var cursor2 = collection.find({"id":id + 1});
			cursor2.each(function(err, doc){
				if(err)
					throw err;
				else
					console.log("all good");

				if(doc != null){
					temp2 = doc;

					//this is fantastic news

					var temp3; //super temp variable that isn't really needed but am making it for general use
					temp3 = temp1.content; //save temp2's content so we can update in a sec

					collection.update({"id":id}, {$set: {"content":temp2.content}});
					collection.update({"id":id + 1}, {$set: {"content":temp3}});

					var posts = []; 

					//gather posts to send back the user; i think it will
					//be the easiest if we use a different socket method here
					//so i can do a better type of comparison
					//because in reality the list would be the same minus 2 posts?
					//im not sure on this part to be honest

					//actually i'll just send the list to the .html page
					//and will gather up the current posts
					//and iterate over them, and if the currentPost that im on != currntPost on .html
					//don't match, i will force them to match

					collection.find({"type":"post"}, {_id:0}).each(function(err, doc){
						if(err)
							throw err;
						else
							console.log("no error!!");

						if(doc != null)
							posts.push(doc);

						io.emit('updateList', posts);
					});

				}else{
					console.log("there was an issue");
				}
			});
		});
	});

socket.on('updateDBDOWN', function(id){
		
		MongoClient.connect("mongodb://localhost:27017/test", function(err, db){
			if(err)
				throw err;
			else
				console.log("update");

			var temp1, temp2, collection; 
			collection = db.collection("posts");

			var cursor = collection.find({"id":id});
			cursor.each(function(err, doc){
				if(err)
					throw err;
				else
					console.log("all good");

				if(doc != null){
					temp1 = doc;
				}else{
					console.log("there was an issue");
				}
			});

			var cursor2 = collection.find({"id":id - 1});
			cursor2.each(function(err, doc){
				if(err)
					throw err;
				else
					console.log("all good");

				if(doc != null){
					temp2 = doc;

					//this is fantastic news

					var temp3; //super temp variable that isn't really needed but am making it for general use
					temp3 = temp1.content; //save temp2's content so we can update in a sec

					collection.update({"id":id}, {$set: {"content":temp2.content}});
					collection.update({"id":id - 1}, {$set: {"content":temp3}});

					var posts = []; 

					//gather posts to send back the user; i think it will
					//be the easiest if we use a different socket method here
					//so i can do a better type of comparison
					//because in reality the list would be the same minus 2 posts?
					//im not sure on this part to be honest

					//actually i'll just send the list to the .html page
					//and will gather up the current posts
					//and iterate over them, and if the currentPost that im on != currntPost on .html
					//don't match, i will force them to match

					collection.find({"type":"post"}, {_id:0}).each(function(err, doc){
						if(err)
							throw err;
						else
							console.log("no error!!");

						if(doc != null)
							posts.push(doc);

						io.emit('updateList', posts);
					});

				}else{
					console.log("there was an issue");
				}
			});
		});
	});

});

http.listen(3000, function(){
	console.log("listening on *:3000");
});