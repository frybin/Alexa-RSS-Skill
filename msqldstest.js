const mysql = require('mysql');
const config = require('config');
const dbConfig = config.get('db_log.dbConfig');
///let con = mysql.createConnection(dbConfig);
let pool = mysql.createPool(dbConfig);

/*
con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM rss_feed", function (err, result, fields) {
        if (err) throw err;
        let names=[];
        let link = [];
        let article_1 =[];
        let article_2 =[];
        console.log(result);
        for (i = 0; i < result.length; i++) {
            names.push(result[i].name);
            link.push(result[i].link);
            article_1.push(result[i].article_1);
            article_2.push(result[i].article_2);
        }
        console.log(names);
        console.log(link);
        console.log(article_1);
        console.log(article_2);
    });
});


function dbcall() {
    let feeds=[];
    return new Promise((resolve, reject) => {
        setTimeout(() => reject('woops'), 500);
        con.connect(function (err) {
            if (err) throw err;
            con.query("SELECT * FROM rss_feed", function (err, result, fields) {
                if (err) throw err;
                for (i = 0; i < result.length; i++) {
                    feeds.push([i.toString(),result[i].name,result[i].link,result[i].article_1,result[i].article_2])
                }
                resolve(feeds);
            });
        });
    })
}
*/

function dbcall2() {
    let feeds=[];
    return new Promise((resolve, reject) => {

        setTimeout(() => reject('woops'), 50000);
        pool.getConnection(function(err, connection) {
            // Use the connection
            connection.query("SELECT * FROM rss_feed", function (err, result, fields) {
                if (err) throw err;
                for (i = 0; i < result.length; i++) {
                    feeds.push([i.toString(),result[i].name,result[i].link,result[i].article_1,result[i].article_2])
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



function rssparser(link,article1,article2) {
    //Function used to return promised feed
    const feedparser = require('feedparser-promised');

    return feedparser.parse(link).then((items) => {
        let rss = [];
        items.forEach(item => {
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
        if (rss.length>20){
            rss=rss.slice(0,20)
        }
        return rss;
    }).catch(error => console.error('error: ', error));
}


/*dbcall2().then(feeds => {
    let name = [];
    ///console.log(feeds);
    for (let value=0; value<feeds.length; value++){
        name.push(feeds[value][0]);
        name.push(feeds[value][1]);
    }
    console.log(name);
});*/


dbcall2().then(feeds => {
    let feedname =1;
rssparser(feeds[feedname][2],feeds[feedname][3],feeds[feedname][4]).then((rss)=>{
    console.log(rss)
    });
});