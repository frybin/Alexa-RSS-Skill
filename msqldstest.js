const mysql = require('mysql');
const config = require('config');
const dbConfig = config.get('db_log.dbConfig');
let con = mysql.createConnection(dbConfig);
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
*/

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

dbcall().then(feeds => {
    console.log(feeds);
});