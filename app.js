var express = require('express');
var app = express();
var config = require('./config');

app.get('/hello', function(request, response) { 
	response.send('Hello!'); 
});
app.listen(3000);

var TelegramBot = require('node-telegram-bot-api');


// Setup polling way
var bot = new TelegramBot(config.token, {polling: true});
// Forwards message to another chat
bot.on('message', function (msg) {

	//console.log(msg);
  	var privateChatID = msg.chat.id;
  	var fromId = msg.from.id;

  	var senderName = msg.from.first_name + " " + msg.from.last_name + " @" + msg.from.username;
  	// redefines senderName if no last name or username were found
  	if (msg.from.last_name === undefined) {
  		senderName = msg.from.first_name;
  	}
  	else if (msg.from.username === undefined) {
  		senderName = msg.from.first_name + msg.from.last_name;
  	};

  	var botMsg = senderName + " написал(а): " + '"' + msg.text + '"';

	bot.sendMessage(config.chatid, botMsg);

	var reply = senderName + ", Ваше обращение принято и отправлено Вашему руководству.";

	bot.sendMessage(privateChatID, reply);

});