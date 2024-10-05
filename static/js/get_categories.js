$(document).ready(function() {
    // Fetch the JSON data from the Flask endpoint
    $.ajax({
        url: '/read_categories',
        method: 'GET',
        success: function(data) {
            // Clear the existing rows
            $('#data-table-categories tbody').empty();

            // Loop through the data and append rows to the table
            data.forEach(function(item) {
                $('#data-table-categories tbody').append(
                    `<tr data-bs-toggle="modal" data-bs-target="#viewCategory" class="tr-categories" data-id="${item.id}" style="cursor: pointer">
                        <td class="pt-3 pb-3">${item.id}</td>
                        <td class="pt-3 pb-3">${item.created_at}</td>
                        <td class="pt-3 pb-3">${item.name}</td>
                        <td class="pt-3 pb-3 text-center">
                            <button class="btn-delete" style="background-color: transparent; border: none;" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#deleteCategory">
                                <i class="bi bi-trash3 text-danger"></i>
                            </button>
                        </td>
                    </tr>`
                );
                
                // Append options to the select dropdown in the admin
                $('#category-select').append(
                    `<option value="${item.id}">${item.name}</option>`
                );
                
            });

            // Initialize DataTable with pagination
            $('#data-table-categories').DataTable({
                paging: true,
                pageLength: 10,
                lengthMenu: [5, 10, 25, 50],
                language: {
                    paginate: {
                        previous: "Previous",
                        next: "Next",
                    }
                }
            });

            // Add click event listener to delete buttons
            $('.btn-delete').on('click', function(event) {
                event.stopPropagation(); // Prevent triggering row click
                const categoryId = $(this).data('id');
                $('#category_id').val(categoryId);
            });

            // Add click event listener to table rows for alerting category ID
            $('#data-table-categories tbody').on('click', '.tr-categories', function() {
                const categoryId = $(this).data('id');
                $('#category_id_view').val(categoryId);
                $.ajax({
                    type: "POST",
                    url: "/retrieved_category",
                    data: JSON.stringify({'category_id': categoryId}),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (response) {
                        const cat_name = response.name
                        $('#edit_cat_name').val(cat_name)
                    }
                });
            });
        }
    });
});

function deleteCategory() {
    const category_id = $('#category_id').val(); // Change to the correct ID
    $.ajax({
        type: "POST",
        url: "/delete_category",
        data: JSON.stringify({ 'category_id': category_id }),
        dataType: "json",
        contentType: "application/json", // Fixed contentType
        success: function (response) {
            console.log(response)
            // Optionally, close the modal
            $('#cancel_category').click();
            $('#category_delete_alert').show();
            setTimeout(() => {
                location.reload()
            }, 1500);
        },
        error: function (xhr, status, error) {
            // Handle errors
            alert('Error deleting category: ' + error);
        }
    });
}

function addCategory(){
    const category_name = $('#category_name').val(); // Change to the correct ID
    $.ajax({
        type: "POST",
        url: "/add_category",
        data: JSON.stringify({ 'category_name': category_name }),
        dataType: "json",
        contentType: "application/json", // Fixed contentType
        success: function (response) {
            console.log(response)
            // Optionally, close the modal
            $('#cancel_category_add').click();
            $('#category_add_alert').show();
            setTimeout(() => {
                location.reload()
            }, 1500);
        },
        error: function (xhr, status, error) {
            // Handle errors
            alert('Error deleting category: ' + error);
        }
    });
}

function editCategory(){
    const cat_name = $('#edit_cat_name').val(); 
    const cat_id = $('#category_id_view').val(); 
    $.ajax({
        type: "POST",
        url: "/update_category",
        data: JSON.stringify({ 
            'cat_id': cat_id,
        'cat_name': cat_name }),
        dataType: "json",
        contentType: "application/json", // Fixed contentType
        success: function (response) {
            // Optionally, close the modal
            $('#cancel_category_edit').click();
            $('#category_edit_alert').show();
            setTimeout(() => {
                location.reload()
            }, 1500);
        },
        error: function (xhr, status, error) {
            // Handle errors
            alert('Error deleting category: ' + error);
        }
    });
}


