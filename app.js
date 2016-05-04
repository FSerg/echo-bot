var config = require('./config');
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(config.token, {
    polling: true
});
// map stores chat.id's as keys and time of appeal as values (see line 23 for explanation)
var map = new Map();
console.log("Map has been created. Map size so far: " + map.size);

bot.on('message', function(msg) {
    /* Private chat type means that the message was sent directly to the bot.
     * These messages are forwarded to our tech support chat.
     * Forward allows us to reply using "reply_to_message" so we can send the answer
     * directly to users even if we don't have them in our contact list.
     */
    if (msg.chat.type === "private") {
        // console.log("Message sent from private chat.");
        var questionText = msg.text || "<empty>";
        console.log("Got question: " + questionText);

        console.log(questionText);
        if (questionText === '/start') {
            return; // ignores /start message
        }
        bot.forwardMessage(config.chatid, msg.chat.id, msg.message_id);
        /* In order not to bother the user with automatic messages sent too frequently 
         * in case of active messaging while sorting out some issues the following algorithm 
         * stores chat.id's in a map structure as keys and uses time of appeal as their values. 
         * It sets 5 min interval betwen 'confirmation' messages and updates time value each time
         * a new message received from same id.
         */
        var d = new Date();
        // Checking if it's not the first appeal from this chat.id 
        if (map.has(msg.chat.id.toString())) {
            var prevTime = map.get(msg.chat.id.toString());
            var currentTime = new Date();
            // checking time gap beetwen messages from the same chat.id
            if (currentTime.getTime() - prevTime.getTime() > config.time) {
                bot.sendMessage(msg.chat.id, config.answer);  
            }
        }
        else { 
            bot.sendMessage(msg.chat.id, config.answer);    
        }
        map.set(msg.chat.id.toString(), d); 

    } else {
        // Ignoring other messages sent to the bot
        // unless the are replies from tech support chat
        if (msg.chat.id.toString() === config.chatid) {
            console.log("Message sent from Tech Support chat...");
            if ("reply_to_message" in msg) {
                // console.log("Message sent from Tech Support chat VIA Reply!.");
                var answerText = msg.chat.text || "<empty>";
                console.log("Send answer: " + answerText);
                bot.forwardMessage(msg.reply_to_message.forward_from.id, config.chatid, msg.message_id);
                return;
            } else {
                // console.log("Just corporate talk");

                /* Ignoring messages inside tech support chat
                 * unless they are sent via reply_to_message (see above).
                 */
                return;
            }
        } else {
            // console.log("Message sent from another chat.");

            /* Ignoring messages sent outside techsup chat or those
             * that are not sent from private chats.
             */
            return;
        }
    }
});