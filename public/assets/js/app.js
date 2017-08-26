
$(document).on("click", ".addnotes", function() {
  console.log("The add notes button worked!")
  var thisId = $(this).attr("data-value");

  $("#noteModalLabel").append(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // If there's a note in the article
      if (data.note) {
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  console.log("The save note button worked!");
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-value");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from note textarea
        body: $("#notestext").val()
      }
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notestext").empty();
      });
    $("#bodyinput").val("");
  });

