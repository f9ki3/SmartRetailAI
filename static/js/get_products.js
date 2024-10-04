$(document).ready(function() {
    // Fetch the JSON data from the Flask endpoint
    $.ajax({
        url: '/read_products',
        method: 'GET',
        success: function(data) {
            // Clear the existing rows
            $('#data-table-products tbody').empty();

            // Loop through the data and append rows to the table
            data.forEach(function(item) {
                $('#data-table-products tbody').append(
                    `<tr data-bs-toggle="modal" data-bs-target="#viewProduct" class="tr-products" data-id="${item.id}" style="cursor: pointer">
                        <td class="pt-3 pb-3">${item.id}</td>
                        <td class="pt-3 pb-3">${item.created_at}</td>
                        <td class="pt-3 pb-3">${item.name}</td>
                        <td class="pt-3 pb-3 text-center">
                            <button class="btn-delete" style="background-color: transparent; border: none;" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#deleteProduct">
                                <i class="bi bi-trash3 text-danger"></i>
                            </button>
                        </td>
                    </tr>`
                );
            });

            // Initialize DataTable with pagination
            $('#data-table-products').DataTable({
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
                const productId = $(this).data('id');
                $('#product_id').val(productId);
            });

            // Add click event listener to table rows for alerting product ID
            $('#data-table-products tbody').on('click', '.tr-products', function() {
                const productId = $(this).data('id');
                $('#product_id_view').val(productId);
                $.ajax({
                    type: "POST",
                    url: "/retrieve_product",
                    data: JSON.stringify({'product_id': productId}),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (response) {
                        const product_name = response.name
                        $('#edit_product_name').val(product_name)
                    }
                });
            });
        }
    });
});

function deleteProduct() {
    const product_id = $('#product_id').val();
    $.ajax({
        type: "POST",
        url: "/delete_product",
        data: JSON.stringify({ 'product_id': product_id }),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
            console.log(response)
            // Optionally, close the modal
            $('#cancel_product').click();
            $('#product_delete_alert').show();
            setTimeout(() => {
                location.reload()
            }, 1500);
        },
        error: function (xhr, status, error) {
            // Handle errors
            alert('Error deleting product: ' + error);
        }
    });
}

function addProduct(){
    const product_name = $('#product_name').val();
    $.ajax({
        type: "POST",
        url: "/add_product",
        data: JSON.stringify({ 'product_name': product_name }),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
            console.log(response)
            // Optionally, close the modal
            $('#cancel_product_add').click();
            $('#product_add_alert').show();
            setTimeout(() => {
                location.reload()
            }, 1500);
        },
        error: function (xhr, status, error) {
            // Handle errors
            alert('Error adding product: ' + error);
        }
    });
}

function editProduct(){
    const product_name = $('#edit_product_name').val(); 
    const product_id = $('#product_id_view').val(); 
    $.ajax({
        type: "POST",
        url: "/update_product",
        data: JSON.stringify({ 
            'product_id': product_id,
            'product_name': product_name }),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
            // Optionally, close the modal
            $('#cancel_product_edit').click();
            $('#product_edit_alert').show();
            setTimeout(() => {
                location.reload()
            }, 1500);
        },
        error: function (xhr, status, error) {
            // Handle errors
            alert('Error editing product: ' + error);
        }
    });
}
