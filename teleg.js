exports.telegram=function(pesan){

var telegram = require('telegram-bot-api');

var api = new telegram({
        token: '534763444:AAELTX2ZEk-buMznEg1xtZFhhSsYg5aDPDE'
});

announce();

function announce() {
    api.sendMessage({
        chat_id: '-340928961',
        text: pesan
    });
}

}