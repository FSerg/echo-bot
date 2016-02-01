var config = require('./config');
var TelegramBot = require('node-telegram-bot-api');

// Setup polling way
var bot = new TelegramBot(config.token, {polling: true});
// Forwards message to another chat
bot.on('message', function (msg) {

    if (msg.text === "/start") {
        return;
    }

    var privateChatID = msg.chat.id;
  	var fromId = msg.from.id;

    var sender = msg.from;
  	var senderName = "Отправитель: ";
    if (sender.first_name !== undefined) {
        senderName = senderName + sender.first_name;
    }
    if (sender.last_name !== undefined) {
        senderName = senderName + " " + sender.last_name;
    }
    if (sender.username !== undefined) {
        senderName = senderName + " @" + sender.username;
    }
    senderName = senderName + " ("+fromId+")\n";

    // пересылаем обращение в наш закрытый чат
    var botMsg = senderName +"Сообщение: " + msg.text;
    bot.sendMessage(config.chatid, botMsg);

    // отправляем подтверждение, что обращение принято
	bot.sendMessage(privateChatID, config.answer);

});
