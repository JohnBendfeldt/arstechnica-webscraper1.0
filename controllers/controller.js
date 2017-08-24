var request = require('request');
var cheerio = require('cheerio');
var Note = require("./../models/noteModel.js");
var News = require("./../models/newsModel.js");
module.exports = {

    scrape: function (cb) {
        //make a request to the NYT site to grab articles
        request('https://arstechnica.com/', function (err, response, html) {
            //Load the html body from request into cheerio
            var $ = cheerio.load(html);

            //For each element with a "story" class
            $('h2').each(function (i, element) {
                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");

                //create an object of every headline, link and summary
                var result = {};
                //Add content to result object
                result.title= title;
                result.link = link;;
                //create a new entry that passes the result object to the entry
                var entry = new Article(result);

                // Save entry to the db
                entry.save(function (err, doc) {
                    // Console.log any errors
                    if (err) {
                        console.log(err);
                    }
                    // Or log the doc
                    else {
                        console.log(doc);
                    }

                })

            });
            cb();
        });

    }
};

