const Alexa = require('alexa-sdk');
//const reader = require('./rss_feed');

function rssparser(link,article1,article2) {
    //Function used to return promised feed
    const feedparser = require('feedparser-promised');
    //const url = 'http://www.wuxiaworld.com/feed/';
    return feedparser.parse(link).then((items) => {
        //returns polulated rss array from the link in csv file
        let rss = [];
        items.forEach(item => {
            //console.log('title:', item.categories[0])
            let string = '';
            if (article1 === 'categories'){
                string = item[article1][0].replace('&', 'and');
                rss.push(string);
            }else {
                string = item[article1].replace('&', 'and');
                rss.push(string);
            }
            if (article2 ===''){
            }else {
                string = item[article2].replace('&', 'and');
                rss.push(string);
            }
        });
        return rss;
    }).catch(error => console.error('error: ', error));
}


const csvarray = [ [ '0',
    'Wuxiaworld',
    'http://www.wuxiaworld.com/feed/',
    'categories',
    'title' ],
    [ '1',
        'Calculus',
        'https://mycourses.rit.edu/d2l/le/news/rss/657095/course?token=avafqi245o0qvo7ddd22',
        'title',
        'description' ],
    [ '2',
        'Csec 101',
        'https://mycourses.rit.edu/d2l/le/news/rss/660943/course?token=avafqi245o0qvo7ddd22',
        'title',
        'description' ] ];

let handlers = {
    'LaunchRequest': function () {
        this.emit('RSSLinkIntent');
    },

    'HelloWorldIntent': function () {
        this.emit(':tell', 'Hello World!');
    },

    'RSSWordIntent': function () {
        let feedname = parseInt(this.event.request.intent.slots.feedname.value);
        rssparser(csvarray[feedname][2],csvarray[feedname][3],csvarray[feedname][4]).then((rss)=>{
            // takes the link in the array and the property for the reader
            this.emit(':tell', rss);
        })
    },

    'RSSLinkIntent': function () {
        let name = [];
        for (let value=0; value<csvarray.length; value++){
            name.push(csvarray[value][0]);
            name.push(csvarray[value][1]);
        }
        this.emit(':ask',`Would you like to open the rss feed for ${name}`, `Say: ${name}`);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'This is the RSS Feed Reader Skill. ';
        const reprompt = 'Say read, to hear me speak.';

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },

    'AMAZON.CancelIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    },

    'AMAZON.StopIntent': function () {
        this.response.speak('See you later!');
        this.emit(':responseReady');
    }
};

exports.handle = function(event, context, callback) {
    let alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};