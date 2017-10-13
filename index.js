const Alexa = require('alexa-sdk');
//const reader = require('./rss_feed');

const feedparser = require('feedparser-promised');
const url = 'http://www.wuxiaworld.com/feed/';
function whatever() {
    return feedparser.parse(url).then((items) => {
        let rss = [];
        items.forEach(item => {
            //console.log('title:', item.categories[0])
            let string = item.categories[0].replace('&', 'and');
            rss.push(string);
        });
        return rss;
    }).catch(error => console.error('error: ', error));
}


let handlers = {
    'LaunchRequest': function () {
        this.emit('RSSWordIntent');
    },

    'HelloWorldIntent': function () {
        this.emit(':tell', 'Hello World!');
    },
    'RSSWordIntent': function () {
        whatever().then((rss)=>{
            this.emit(':tell', rss);
            }
        )

    }
};

exports.handle = function(event, context, callback) {
    let alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};