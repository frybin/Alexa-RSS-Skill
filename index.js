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

/*
function readFile() {
    const csv = require('ya-csv');
    const filecsv = 'data.csv';
    return new Promise((resolve, reject) => {
        let csvarray = [];
        let reader = csv.createCsvFileReader(filecsv, {
            'separator': ',',
            'quote': '"',
            'escape': '"',
            'comment': '',
        });
        reader.on('data', function (item) {
            csvarray.push(item);
            resolve(csvarray);
        })
    });

}
*/
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
/*
readFile().then(csvarray => {
    console.log(csvarray);
    rssparser(csvarray[0][2],csvarray[0][3],csvarray[0][4]).then((rss)=>{
        // takes the link in the csv file and the property for the reader
        console.log(rss)
    })
});
*/
/*
rssparser(csvarray[0][2],csvarray[0][3],csvarray[0][4]).then((rss)=>{
    // takes the link in the csv file and the property for the reader
    console.log(rss)
});
*/

let handlers = {
    'LaunchRequest': function () {
        this.emit('RSSLinkIntent');
    },

    'HelloWorldIntent': function () {
        this.emit(':tell', 'Hello World!');
    },
    'RSSWordIntent': function () {
        //let feed_name=this.event.request.intent.slots.feed_name.value;
        /*rssparser().then((rss)=>{
            this.emit(':tell', rss);
            }
        );*/
        let feedname = parseInt(this.event.request.intent.slots.feedname.value);

        //readFile().then(csvarray => {
            rssparser(csvarray[feedname][2],csvarray[feedname][3],csvarray[feedname][4]).then((rss)=>{
                // takes the link in the csv file and the property for the reader
                this.emit(':tell', rss);
            })
       // });
    },

    'RSSLinkIntent': function () {
        //readFile().then(csvarray => {
        let name = [];
        for (let value=0; value<csvarray.length; value++){
            name.push(csvarray[value][0]);
            name.push(csvarray[value][1]);
        }
        this.emit(':ask',`Would you like to open the rss feed for ${name}`, `Say: ${name}`);
        // }
        //)
    }
};

exports.handle = function(event, context, callback) {
    let alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};