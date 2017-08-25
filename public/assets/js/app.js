$(document).ready(function(){
    //onclick for
    $('.saved-buttons').on('click',  function () {
        // the NEWS article id
        console.log("click is functioning");
    
        var thisId = $(this).attr("data-value");

        //add id of the current NEWS article to modal label
        $('#noteModalLabel').append(thisId);

        //attach news article _id to the save button in the modal for use in save post
        $("#saveButton").attr({"data-value": thisId});

        $('.savenote').on('click',  function () {
                // the NEWS article id
                console.log("click is functioning");
                $('#noteModalLabel').empty();
        });       
    });
});

