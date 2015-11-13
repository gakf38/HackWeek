var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');

	res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
	console.log("Cookies: ", req.cookies);
});

io.on('connection', function(socket){
	var greetMsg = 'A user has connected'; 
	io.emit('chat message', greetMsg);
	console.log('a user connected');
	socket.on('chat message', function(msg){

		if(msg.length == 0){
			console.log("msg too short");
		}else{
			io.emit('chat message', msg);
		}
	});
	socket.on('disconnect', function(){
		var leavingMsg = 'A user has left';
		io.emit('chat message', leavingMsg);
		console.log("user has left");
		socket.on('chat message', function(msg){

			if(msg.length == 0)
				console.log("msg too short");
			else
				io.emit('chat message', msg);

		});
		console.log("a user has left");
	});
});

http.listen(3000, function(){
	console.log("listening on *:3000");
});