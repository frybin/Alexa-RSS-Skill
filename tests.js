const mysql = require('mysql');
const config = require('config');
const dbConfig = config.get('db_log.dbConfig');
let pool = mysql.createPool(dbConfig);
const sanitizeHtml = require('sanitize-html');
const stripAnsi = require('strip-ansi');
let md5 = require('md5');

function dbcall() {
    ///returns a promised function filled with entries from the DB
    let feeds=[];
    return new Promise((resolve, reject) => {
        setTimeout(() => reject('woops'), 50000);
        pool.getConnection(function(err, connection) {
            // Use the connection to DB
            connection.query("SELECT * FROM feed", function (err, result, fields) {
                if (err) throw err;
                for (i = 0; i < result.length; i++) {
                    //Put results from database into array
                    feeds.push([(i+1).toString(),result[i].name,result[i].link,result[i].article_1,result[i].article_2,result[i].rss_i,result[i].hash])
                }
                resolve(feeds);
                connection.release();
                // Handle error after the release.
                if (err) throw err;
                // Don't use the connection here, it has been returned to the pool.
            });
        });
    })
}

function dbhashadd(hash,id) {
    setTimeout(() => reject('woops'), 50000);
    pool.getConnection(function(err, connection) {
        // Use the connection to DB
        connection.query(`UPDATE feed SET hash = '${hash}' WHERE feed.rss_i = ${id}` );
        connection.release();
        // Handle error after the release.
        if (err) throw err;
        // Don't use the connection here, it has been returned to the pool.
    });
}

function rssparser(link,article1,article2,id,hash,all) {
    //Function used to return promised feed
    let newHash = '';
    let num = 1;
    const feedparser = require('feedparser-promised');
    return feedparser.parse(link).then((items) => {
        let rss = [];
        for (let i = 0; i < items.length; ++i){
            let item = items[i];
            let string = '';
            string = item[article1];
            string = sanitizeHtml(string,{allowedTags: [  ]});
            string = stripAnsi(string);
            newHash=md5(string);
            if(num === 1){dbhashadd(newHash,id);}
            num++;
            rss.push(string);
            if (newHash === hash && all){break;}
            if (article2 ===''){
            }else {
                string = item[article2];
                string = sanitizeHtml(string,{allowedTags: [  ]});
                string = stripAnsi(string);
                rss.push(string);
            }
        }
        // Makes so there there can be a max of only 20 tag iteams from a feed
        if (rss.length>20){
            rss=rss.slice(0,20)
        }
        return rss;
    }).catch(error => console.error('error: ', error));
}

function feedUpdates() {
    return new Promise((resolve, reject) => {
        dbcall().then(function (feeds) {
            let updatedFeed = '';
            let counter = 1;
            feeds.forEach(feed => {
                rssparser(feed[2], feed[3], feed[4], feed[5], feed[6],true).then(function (rss) {
                    // takes the link in the array and the tag for the reader and read out results
                    updatedFeed += (` The updated feed for ${feed[1]} is : ` + rss.toString() + ";");
                    if (counter >= feeds.length) {
                        resolve(updatedFeed)
                    }
                    counter++;
                });
            });
        })
    })
}


dbcall().then(feeds => {
    rssparser(feeds[0][2],feeds[0][3],feeds[0][4],feeds[0][5],feeds[0][6],false).then((rss)=>{
        // takes the link in the array and the tag for the reader and read out results
        console.log(rss);
    })
});

feedUpdates().then(updatedFeed=>{
    console.log(updatedFeed)
    }
);

