var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Requiring our Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

// Routes
// ======

router.get("/", function(req, res){
    res.render("index");
});

router.get("/saved", function(req, res){
    res.render("saved");
});

// A GET request to scrape the Ars Technica website
router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("https://arstechnica.com/", function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      // Now, we grab every h2 within an article tag, and do the following:
      $("h2").each(function(i, element) {
  
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).children("a").text();
        result.link = $(this).children("a").attr("href");
  
        // Using our Article model, create a new entry
        // This effectively passes the result object to the entry (and the title and link)
        var entry = new Article(result);
  
        // Now, save that entry to the db
        entry.save(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          // Or log the doc
          else {
            console.log(doc);
          }
        });
  
      });
    });
    // Tell the browser that we finished scraping the text
    res.send("Scrape Complete");
  });
  
  // This will get the articles we scraped from the mongoDB
  router.get("/articles", function(req, res) {
  
  
    // TODO: Finish the route so it grabs all of the articles
    Article.find({}, function(err, data) {
      res.send(data);
    })
    
  
  
  });
  
  // This will grab an article by it's ObjectId
  router.get("/articles/:id", function(req, res) {
  
    // Use our Note model to make a new note from the req.body
    Article.findOne({"_id":req.params.id}).populate("note")
    
      .exec(function(error, doc) {
    
        if (error) {
          res.send(error);
        }
        else {
          res.send(doc);
        }
      });
    
    });
   
  
  
  // Create a new note or replace an existing note
  router.post("/articles/:id", function(req, res) {
  
    // and update it's "note" property with the _id of the new note
    var newNote = new Note(req.body);
    console.log(newNote);
    // Save the new note to mongoose
    newNote.save(function(error, doc) {
      // Send any errors to the browser
      if (error) {
        res.send(error);
      }
      // Otherwise
      else {
        // Find our user and push the new note id into the User's notes array
        Article.findOneAndUpdate({"_id":req.params.id}, { $set: { "note": doc._id } }, { new: true }, function(err, newdoc) {
          // Send any errors to the browser
          if (err) {
            res.send(err);
          }
          // Or send the newdoc to the browser
          else {
            console.log(newdoc);
            res.send(newdoc);
          }
        });
      }
    });
  
  });

    // Save the article by updating the articles saved to 1(true);
    router.get('/save/:id?', function (req, res) {
        // Set the _id retrieved from the req.params.id of the article the user would like to save to a variable
        var id = req.params.id;
        // Find the news article by id
        Article.findById(id, function (err, news) {
            if (err) return handleError(err);
            //set saved to 1(true)
            article.saved = 1;
            //save the update in mongoDB
            article.save(function (err, updatedNews) {
                if (err) return handleError(err);
                //no redirect since it is only updating data and not affecting the view
            })

        })
    });

    // Bring user to the saved html page showing all their saved articles
    router.get('/saved', function (req, res) {
        //find all news articles
        Article.find({}, function (err, doc) {
            if (err) return handleError (err);
                //set up data to show in handlebars
                var hbsObject = {news: doc};
                res.render('saved', hbsObject);
        });
    });
    // Delete News article from teh saved articles page
    router.get('/delete/:id?', function (req, res) {
        var id = req.params.id; // set the _id of the article the user would like to delete from saved to a variable
        // Find the news article by id
        Article.findById(id, function (err, news) {
            article.saved = 0; //set saved to 0(false) so it will be removed from the saved page

            // save the updated changes to the article
            article.save(function (err, updatedNews) {
                if (err) return handleError(err); //if err
                res.redirect('/saved'); //redirect back to the saved page as the updated data will effect the view
            })
        })
    });

    //retrieve the notes attached to saved articles to be displayed in the notes modal
    router.get('/notes/:id', function (req, res) {
        //Query to find the matching id to the passed in it
        Article.findOne({_id: req.params.id})
            .populate("notes") //Populate all of the notes associated with it
            .exec(function (error, doc) { //execute the query
                if (error) console.log(error);
                // Otherwise, send the doc to the browser as a json object
                else {
                    res.json(doc);
                }
            });
    });

    // Add a note to a saved article
    router.post('/notes/:id', function (req, res) {
        //create a new note with req.body
        var newNote = new Note(req.body);
        //save newNote to the db
        newNote.save(function (err, doc) {
            // Log any errors
            if (err) console.log(err);
            //find and update the note
            Article.findOneAndUpdate(
                {_id: req.params.id}, // find the _id by req.params.id
                {$push: {notes: doc._id}}, //push to the notes array
                {new: true},
                function(err, newdoc){
                    if (err) return handleError(err);
                    res.send(newdoc);
            });
        });
    });

    //delete note, remove by the note id in the params
    router.get('/deleteNote/:id', function(req, res){
        Note.remove({"_id": req.params.id}, function(err, newdoc){
            if(err) console.log(err);
            res.redirect('/saved'); //redirect to reload the page
        });
    });


module.exports = router;