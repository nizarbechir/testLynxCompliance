/**
 * Created by nizar_000 on 08/03/2017.
 */


var Books = [];
$(document).ready(function() {
    $.ajax({
        url: "/books",
        success: function (data)
        {
            Books = data;
            $.each( data, function( i, val ) {
                $('#tbody').append("<tr><td>" + val.id + "</td><td>" + val.title + "</td><td>" + val.author + "</td><td>" + val.page + "</td><td><a onclick='affich("+val.id+")'><img width='30px' height='30px' class='img-thumbnail img-responsive center-block' src='/assets/images/" + val.cover + "'/></a></td><td><button class='editButton btn btn-primary' data-id='"+val.id+"' data-toggle='tooltip' title='Edit' data-title='Edit' data-toggle='modal' onclick='update("+val.id+")'><span class='glyphicon glyphicon-pencil'></span></button><button  data-id='val.id' data-toggle='tooltip' title='Delete' class='btn btn-danger' style='margin-left: 30px;' data-title='Delete' data-toggle='modal' onclick='del("+val.id+")' ><span class='glyphicon glyphicon-trash'></span></button></td>"+"</tr>");
            })
            $('#example').DataTable();


        },
        dataType: 'json'
    });

    }
);



$(document).ready(function() {
     //{
    //     "ajax":
    //         {
    //             "url":'/books',
    //             "dataSrc":""
    //
    //         },
    //     "columns": [
    //         {"data": "id"},
    //         {"data": "title" },
    //         {"data": "author" },
    //
    //     ]
    //
    //
    // } );

        $(document).on("click", ".editButton", function () {
        // Get the record's ID via attribute
        console.log("hi");
        var id = $(this).attr('data-id');

        $.ajax({
            url: 'book/'+id,
            method: 'GET'
        }).success(function(response) {
            // Populate the form fields with the data returned from server
            $('#squarespaceModal')
                .find('[name="title"]').val(response.title).end()
                .find('[name="author"]').val(response.author).end()
                .find('[name="page"]').val(response.page).end()
                .find('[name="description"]').val(response.description).end();

            // Show the dialog

        });
    });



    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone("div#myDropzone", { url: "/public/images"});

    Dropzone.options.myDropzone = { // The camelized version of the ID of the form element

        // The configuration we've talked about above
        autoProcessQueue: false,
        paramName:"picture",
        uploadMultiple: true,
        parallelUploads: 100,
        maxFiles: 100,

        // The setting up of the dropzone
        init: function() {
            var myDropzone = this;

            // First change the button to actually tell Dropzone to process the queue.
            this.element.querySelector("button[type=submit]").addEventListener("click", function(e) {
                // Make sure that the form isn't actually being sent.
                e.preventDefault();
                e.stopPropagation();
                myDropzone.processQueue();
            });

            // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
            // of the sending event because uploadMultiple is set to true.
            this.on("sendingmultiple", function() {
                // Gets triggered when the form is actually being sent.
                // Hide the success button or the complete form.
            });
            this.on("successmultiple", function(files, response) {
                // Gets triggered when the files have successfully been sent.
                // Redirect user or notify of success.
            });
            this.on("errormultiple", function(files, response) {
                // Gets triggered when there was an error sending the files.
                // Maybe show form again, and notify user of error
            });
        }

    }



} );

/**
 * Delete Book
 * @param id {Nmber} id of the book
 * @Input id {Number}
 * @Output result {Object} status of the request
 */
var del = function (id) {
    //console.log(id);
    $("#formdel").attr("action","/deleteBook/"+id);

    $("#id").val(id);
    $('#delete').modal("show");



}

/**
 *
 * @param id
 */

var update = function (id) {
    $("#formedit").attr("action","/editBook/"+id);
    $('#squarespaceModal').modal("show");
}
var affich = function (id) {
    console.log("hello");
    var src = "";
    Books.map(function (book) {
        if(book.id == id)
            src = book.cover;
    return book;
    });

    $('#modalAffich').modal("show");
    $("#coverid").attr("src","/assets/images/"+src);

}