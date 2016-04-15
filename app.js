var config = require('./config');
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(config.token, {polling: true});

bot.on('message', function (msg) {

    // "privete" в чате означате, что сообщение было отпарвлено напрямую боту
    // такие сообщение мы все пресылаем forward'ом в наш специальный чат тех.поддержки
    // делаем это именно forward'ом, чтобы в чате кто-то мог ответить reply'ем на обращение
    // и тогда ответ можно переслать именно автору обращения, даже если его нет у нас в контактах
	if (msg.chat.type === "private") {

        // console.log("Message sent from private chat.");
        var questionText = msg.chat.text || "<empty>";
        console.log("Got question: "+questionText);

        if (questionText === '/start') {
            return; // игнорируем стартовое сообщение
        }

    	bot.forwardMessage(config.chatid, msg.chat.id, msg.message_id);
    	bot.sendMessage(msg.chat.id, config.answer);
    }
    else {
        // на все остальные сообщения боту мы не реагируем,
        // если только это не ответы внутри нашей группы техподдержки
        if (msg.chat.id.toString() === config.chatid) {
    		console.log("Message sent from Tech Support chat...");
    		if ("reply_to_message" in msg) {
    			// console.log("Message sent from Tech Support chat VIA Reply!.");
                var answerText = msg.chat.text || "<empty>";
                console.log("Send answer: "+answerText);
	            bot.forwardMessage(msg.reply_to_message.forward_from.id, config.chatid, msg.message_id);
	            return;
        	}
        	else {
        		// console.log("Just corporate talk");
                // ничего не делаем на обычные сообщения в чате техподдержки
                // реагируем только на сообщени сделанные через reply_to_message (см.выше)
                return;
        	}
        }
        else {
        	// console.log("Message sent from another chat.");
            // ничего не делаем на сообщения вне чата тех.поддержки
            // и вне прямых сообщений боту
    		return;
        }
    }
 });
