$(document).ready(function(){
    //onclick for
    $('.saved-buttons').on('click',  function () {
        // the NEWS article id
        var thisId = $(this).attr("data-value");

        //attach news article _id to the save button in the modal for use in save post
        $("#saveButton").attr({"data-value": thisId});

        //make an ajax call for the notes attached to this article
        $.get("/notes/" + thisId, function(data){
            console.log(data);
            //empty modal title, textarea and notes
            $('#noteModalLabel').empty();
            $('#notesBody').empty();
            $('#notestext').val('');

            //add id of the current NEWS article to modal label
            $('#noteModalLabel').append(thisId);
            //add notes to body of modal, will loop through if multiple notes
            for(var i = 0; i<data.notes.length; i++) {
                var button = ' <a href=/deleteNote/' + data.notes[i]._id + '><button type="button" class="btn btn-danger">Delete</button></a>';
                $('#notesBody').append('<li>' + data.notes[i].body + '  ' + button + '</li>');
            }
        });
    });
});

