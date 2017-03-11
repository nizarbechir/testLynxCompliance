/**
 * Created by nizar_000 on 08/03/2017.
 */

var Books = [];
$(document).ready(function () {
    /**
     * Get data as Json format and inject it into the table => formatted with Datatable plugin
     */
    $.ajax({
        url: "/books",
        success: function (data) {
            Books = data;
            $.each(data, function (i, val) {
                $('#tbody').append("<tr><td>" + val.id + "</td><td>" + val.title + "</td><td>" + val.author + "</td><td>" + val.page + "</td><td><a onclick='affich(" + val.id + ")'><img width='30px' height='30px' class='img-thumbnail img-responsive center-block' src='/assets/images/" + val.cover + "'/></a></td><td><button class='editButton btn btn-primary' data-id='" + val.id + "' data-toggle='tooltip' title='Edit' data-title='Edit' data-toggle='modal' onclick='update(" + val.id + ")'><span class='glyphicon glyphicon-pencil'></span></button><button  data-id='val.id' data-toggle='tooltip' title='Delete' class='btn btn-danger' style='margin-left: 30px;' data-title='Delete' data-toggle='modal' onclick='del(" + val.id + ")' ><span class='glyphicon glyphicon-trash'></span></button></td>" + "</tr>");
            })
            $('#example').DataTable();
        },
        dataType: 'json'
    });

    $(document).on("click", ".editButton", function () {
        // Get the record's ID via attribute
        var id = $(this).attr('data-id');
        $.ajax({
            url: 'book/' + id,
            method: 'GET'
        }).success(function (response) {
            // Populate the form fields with the data returned from server
            $('#squarespaceModal')
                .find('[name="title"]').val(response.title).end()
                .find('[name="author"]').val(response.author).end()
                .find('[name="page"]').val(response.page).end()
                .find('[name="description"]').val(response.description).end();
        });
    });
});

/**
 * Delete Book
 * @param id {Nmber} id of the book
 */
var del = function (id) {
    $("#formdel").attr("action", "/deleteBook/" + id);
    $("#id").val(id);
    $('#delete').modal("show");
}


/**
 * Update Book
 * @param id {Nmber} id of the book
 */
var update = function (id) {
    $("#formedit").attr("action", "/editBook/" + id);
    $('#squarespaceModal').modal("show");
}


/**
 * Affich Image in Modal
 * @param id {Nmber} id of the book
 */
var affich = function (id) {
    var src = "";
    Books.map(function (book) {
        if (book.id == id)
            src = book.cover;
        return book;
    });

    $('#modalAffich').modal("show");
    $("#coverid").attr("src", "/assets/images/" + src);

}