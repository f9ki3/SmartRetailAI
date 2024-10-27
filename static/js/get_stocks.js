
$(document).ready(function() {
    // Fetch the JSON data from the Flask endpoint
    $.ajax({
        url: '/read_stocks',
        method: 'GET',
        success: function(data) {
            // Clear the existing rows
            $('#data-table-stocks tbody').empty();

            // Loop through the data and append rows to the table
            data.forEach(function(item) {
                $('#data-table-stocks tbody').append(
                    `<tr data-bs-toggle="modal" data-bs-target="#viewStock" class="tr-stocks" data-id="${item.id}" style="cursor: pointer">
                        <td class="pt-3 pb-3 text-center">${item.id}</td>
                        <td class="pt-3 pb-3 text-center">${item.created_at}</td>
                        <td class="pt-3 pb-3">${item.product_name}</td>
                        <td class="pt-3 pb-3">${item.stock_type}</td>
                        <td class="pt-3 pb-3 text-center">${item.stocks}</td> 
                        <td class="pt-3 pb-3 text-center">
                            <button class="btn-delete-stock" style="background-color: transparent; border: none;" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#deleteStock">
                                <i class="bi bi-trash3 text-danger"></i>
                            </button>
                        </td>
                    </tr>`
                );
            });

            // Initialize DataTable with pagination (only initialize once)
            if (!$.fn.DataTable.isDataTable('#data-table-stocks')) {
                $('#data-table-stocks').DataTable({
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
            }

            // Add click event listener to delete buttons (using delegation for dynamic content)
            $('#data-table-stocks tbody').on('click', '.btn-delete-stock', function(event) {
                event.stopPropagation(); // Prevent triggering row click
                const stockId = $(this).data('id');
                $('#stock_id').val(stockId);
            });
        },
        error: function(xhr, status, error) {
            alert('Error fetching data: ' + error);
        }
    });
});

function deleteProduct() {
    const product_id = $('#stock_id').val();
    $.ajax({
        type: "POST",
        url: "/delete_stocks",
        data: JSON.stringify({ 'product_id': product_id }),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            // Optionally, close the modal and show success alert
            $('#cancel_product').click(); // Close modal
            $('#product_delete_alert').show(); // Show alert

            setTimeout(() => {
                location.reload(); // Reload the page after a short delay
            }, 1500);
        },
        error: function (xhr, status, error) {
            // Handle errors
            alert('Error deleting product: ' + error);
        }
    });
}

function addStock() {
    // Collecting input values
    const productName = $('#selected-id').val().trim(); // Get selected product name
    const productStocks = parseInt($('#product_stocks').val().trim(), 10); // Get stock input

    // Validate input fields
    if (!productName || isNaN(productStocks) || productStocks <= 0) {
        alert("Please select a product and enter a valid number of stocks.");
        return;
    }

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('id', productName);
    formData.append('stocks', productStocks); // Append stock value

    // Submit the form data via AJAX
    $.ajax({
        url: '/add_stock', // Adjust the URL for stock addition
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            $('#cancel_stock_add').click(); // Close the modal
            $('#stock_add_alert').show(); // Show success alert
            
            setTimeout(() => {
                location.reload(); // Reload the page after 1.5 seconds
            }, 1500);
        },
        error: function(xhr) {
            console.error("Error adding stock:", xhr.responseText);
            alert("Error adding stock: " + (xhr.responseJSON?.error || xhr.responseText)); // Provide user feedback
        }
    });
}
