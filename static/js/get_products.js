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
                    `<tr  class="tr-products" data-id="${item.id}" style="cursor: pointer">
                        <td class="pt-3 pb-3 text-center">${item.id}</td>
                        <td class="pt-3 pb-3 text-center">
                            <img src="${item.product_image}" alt="Product Image" style="width: 70px; height: 70px;"> <!-- Display product image -->
                        </td>
                        <td class="pt-3 pb-3">${item.name}</td>
                        <td class="pt-3 pb-3">${item.created_at}</td>
                        <td class="pt-3 pb-3 text-center">${item.size}</td> <!-- Added size -->
                        <td class="pt-3 pb-3 text-center">${item.price.toFixed(2)}</td> <!-- Added price -->
                        <td class="pt-3 pb-3 text-center">${item.stock}</td> <!-- Added stock -->
                        <td class="pt-3 pb-3 text-center">
                            <img src="${item.barcode_image}" alt="Barcode" style="width: 100px; height: auto;"> <!-- Display barcode image -->
                        </td>
                        <td class="pt-3 pb-3 text-center">
                            <button class="btn-delete-product" style="background-color: transparent; border: none;" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#deleteProduct">
                                <i class="bi bi-trash3 text-danger"></i>
                            </button>
                        </td>
                    </tr>`
                );
            });

            // Initialize DataTable with pagination (only initialize once)
            if (!$.fn.DataTable.isDataTable('#data-table-products')) {
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
            }

            // Add click event listener to delete buttons (using delegation for dynamic content)
            $('#data-table-products tbody').on('click', '.btn-delete-product', function(event) {
                event.stopPropagation(); // Prevent triggering row click
                const productId = $(this).data('id');
                $('#product_id').val(productId);
            });
        },
        error: function(xhr, status, error) {
            alert('Error fetching data: ' + error);
        }
    });
});

function deleteProducts() {
    const product_id = $('#product_id').val();
    console.log('click')
    $.ajax({
        type: "POST",
        url: "/delete_product",
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

function addProduct() {
    // Collecting input values
    const productName = $('#product_name').val().trim(); // Trim whitespace
    const productPrice = $('#product_price').val().trim(); // Trim whitespace
    const productSize = $('input[name="size"]:checked').val(); // Get the selected size value
    let barcodeId = $('#barcode_id').val().trim(); // Ensure correct ID for the barcode input
    const categoryIds = $('#category-select').val(); // Get selected category ID

    // Get the selected file
    const productImage = $('input[type="file"]')[0]?.files[0]; // Use optional chaining to prevent errors

    // Validate input fields
    if (!productName || !productPrice || !productSize || !categoryIds || !productImage) {
        alert("Please fill in all fields and select an image.");
        return;
    }

    // Validate price to ensure it's a valid number
    const priceFloat = parseFloat(productPrice);
    if (isNaN(priceFloat) || priceFloat <= 0) {
        alert("Please enter a valid price.");
        return;
    }

    // Validate barcodeId to ensure it's 13 digits
    if (!barcodeId) {
        // Generate a random 13-digit number
        barcodeId = Math.floor(Math.random() * 1e13).toString().padStart(13, '0'); // Ensure 13 digits
    } else if (barcodeId.length !== 13 || isNaN(barcodeId)) {
        alert("Barcode ID must be exactly 13 digits.");
        return;
    }

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', priceFloat); // Append the parsed price value
    formData.append('size', productSize); // Append the size value directly
    formData.append('barcode_id', barcodeId);
    formData.append('category_id', categoryIds);
    formData.append('image', productImage);

    // Submit the form data via AJAX
    $.ajax({
        url: '/add_product',
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            $('#cancel_product_add').click(); // Close the modal or clear the form
            $('#product_add_alert').show(); // Show success alert
            setTimeout(() => {
                location.reload(); // Reload the page after 1.5 seconds
            }, 1500);
        },
        error: function(xhr) {
            console.error("Error adding product:", xhr.responseText);
            alert("Error adding product: " + (xhr.responseJSON?.error || xhr.responseText)); // Provide user feedback
        }
    });
}






// function editProduct(){
//     const product_name = $('#edit_product_name').val(); 
//     const product_id = $('#product_id_view').val(); 
//     $.ajax({
//         type: "POST",
//         url: "/update_product",
//         data: JSON.stringify({ 
//             'product_id': product_id,
//             'product_name': product_name }),
//         dataType: "json",
//         contentType: "application/json",
//         success: function (response) {
//             // Optionally, close the modal
//             $('#cancel_product_edit').click();
//             $('#product_edit_alert').show();
//             setTimeout(() => {
//                 location.reload()
//             }, 1500);
//         },
//         error: function (xhr, status, error) {
//             // Handle errors
//             alert('Error editing product: ' + error);
//         }
//     });
// }
