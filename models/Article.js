// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true,
    index : { unique: true }
  },
  // link is a required string
  link: {
    type: String,
    required: true,
    index : { unique: true }
  },
  about: {
    type: String,
    required: true,
    index : { unique: true }
  },
  // shows whether articles are saved
  saved: {type: Boolean, default: 0},
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
