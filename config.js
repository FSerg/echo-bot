module.exports = {
    'token':process.env.TOKEN,
    'chatid':process.env.CHATID,
    'time':process.env.TIME || 600000, // in miliseconds
    'answer':process.env.ANSWER || "Спасибо, ваше обращение принято.\nМы постараемся ответить в ближайшее время..."
};
