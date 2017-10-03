const feedparser = require('feedparser-promised');
const url = 'http://www.wuxiaworld.com/feed/';
function whatever() {


    return feedparser.parse(url).then((items) => {
        let rss = [];
        items.forEach(item => {
            //console.log('title:', item.categories[0])
            rss.push(item.categories[0]);
        });
        return rss;
    }).catch(error => console.error('error: ', error));
}

export default whatever;

/*
const FeedParser = require('feedparser');
const request = require('request'); // for fetching the feed

const req = request('http://www.wuxiaworld.com/feed/');
const feedparser = new FeedParser();


//req.on('error',done)

req.on('response', function (res) {
    if (res.statusCode !== 200) {
        this.emit('error', new Error('Bad status code'));
    }
    else {
        this.pipe(feedparser);
    }
});


function call() {
    let temp = [];
    return new Promise((resolve, reject) => {
        feedparser.on('readable', function () {
            // This is where the action is!
            let item;
            let cat_array = [];

            while (item = this.read()) {
                cat_array = (item.categories[0]);//makes the array equal to categories array
            }
            //var temp=objToString(cat_array);
            //console.log(temp[0]);
            temp.push(cat_array);
            //console.log(cat_array[0]);
            //console.log(temp);
            resolve(temp);
        });
    })
}
/*
call().then(temp => {
    console.log(temp);
});
*/
