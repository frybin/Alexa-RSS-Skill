# Alexa RSS Feed Reader

This is a Amazon Alexa skill built using Node.JS and deployed on Amazon AWS Lambda.<br>
It connects to a MySQL database that has

1. A unique id for each RSS Feed in the database
2. A name that Alexa would use to refer to an RSS Feed
3. A link to the RSS Feed
4. A tag from the RSS Feed that Alexa would read out in the order it appears
5. A second optional tag that could be left out
6. A hash column which is char(32) in the databse and is used to keep track of new feeds.

Before uploading the skill to AWS a config folder has to be created with a default.json inside setup as shown below so Lambda could connect to the MySQL external database

```json
{
  "db_log": {
    "dbConfig": {
      "host": "host name",
      "user": "user name",
      "password": "password",
      "database": "database name"
    }
  }
}
```

When starting the skill, Alexa will read out to you the RSS Feed Names in the order they appear with a number in-front of each name<br>
Example Response from Alexa:

- Would you like to open the RSS Feed for 1 Wuxiaworld, 2 Blue Silver Translations

Then, by saying the number that is associated with the RSS Feed, Alexa will read out the first 20 items from the RSS Feed that the specified tags
