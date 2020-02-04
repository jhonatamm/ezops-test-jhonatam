var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var app = express();
var http = require('http').Server(app);

//var io = require('socket.io').listen(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(__dirname));
var server = app.listen(3000, () => {
 console.log('server is running on port', server.address().port);
});
var io = require('socket.io').listen(server);

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

  const robootSchema = new mongoose.Schema({nome : String, pergunta : String, resposta : String});
  const ChatBot = mongoose.model('chat',robootSchema);
  var chatbots;

app.get('/messages', (req, res) => {

  
  ChatBot.find({},(err, chats) =>{
  	console.log(chats);
  	chatbots = chats;
  	
  });
  

  Message.find({},(err, messages)=> {
    res.send(messages);
  })
});

app.post('/messages', (req, res) => {
	console.log(req.body);

  var message = new Message(req.body);
  //var chatbot = new ChatBot({nome :"roobot",pergunta:"sim",resposta:"diga?"});
  var temResposta;
  var reposta;
 	for(let i in chatbots){
 		if (checkMensagem(chatbots[i].pergunta,message.message)){
 			temResposta = true;
 			reposta = new Message({ name : chatbots[i].nome, message : chatbots[i].resposta});
 			console.log(reposta);
 			break;
 		}
 	}
 
 if(temResposta){
 	io.emit('message', req.body);
 	message.save((err) =>{
	    if(err)
	      sendStatus(500);
	  	
	  });
 	 reposta.save((err) =>{
	    if(err)
	      sendStatus(500);
	    res.sendStatus(200);
	  });
 }

 else{
	  message.save((err) =>{
	    if(err)
	      sendStatus(500);
	  	io.emit('message', req.body);
	    res.sendStatus(200);
	  })
	}
	if(temResposta){
		io.emit('message', reposta); 
	}
});

function checkMensagem(item,pergunta){
	var item = item.trim();
	if(item.toLowerCase() == pergunta.toLowerCase()){
		return true;
	}else{
		return false;
	}
}



mongoose.connect('mongodb+srv://medina:cT2yAZvJ6ancCB1h@medinacluster-t5evt.mongodb.net/simple-chat?retryWrites=true&w=majority', { useNewUrlParser: true }).then(() =>{
	console.log('conection to database established');
}).catch(error => handleError(error));
var Message = mongoose.model('Message',{ name : String, message : String});











