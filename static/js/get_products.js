// $(document).ready(function() {
//     // Fetch the JSON data from the Flask endpoint
//     $.ajax({
//         url: '/read_products',
//         method: 'GET',
//         success: function(data) {
//             // Clear the existing rows
//             $('#data-table-products tbody').empty();

//             // Loop through the data and append rows to the table
//             data.forEach(function(item) {
//                 $('#data-table-products tbody').append(
//                     `<tr data-bs-toggle="modal" data-bs-target="#viewProduct" class="tr-products" data-id="${item.id}" style="cursor: pointer">
//                         <td class="pt-3 pb-3">${item.id}</td>
//                         <td class="pt-3 pb-3">${item.created_at}</td>
//                         <td class="pt-3 pb-3">${item.name}</td>
//                         <td class="pt-3 pb-3 text-center">
//                             <button class="btn-delete" style="background-color: transparent; border: none;" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#deleteProduct">
//                                 <i class="bi bi-trash3 text-danger"></i>
//                             </button>
//                         </td>
//                     </tr>`
//                 );
//             });

//             // Initialize DataTable with pagination
//             $('#data-table-products').DataTable({
//                 paging: true,
//                 pageLength: 10,
//                 lengthMenu: [5, 10, 25, 50],
//                 language: {
//                     paginate: {
//                         previous: "Previous",
//                         next: "Next",
//                     }
//                 }
//             });

//             // Add click event listener to delete buttons
//             $('.btn-delete').on('click', function(event) {
//                 event.stopPropagation(); // Prevent triggering row click
//                 const productId = $(this).data('id');
//                 $('#product_id').val(productId);
//             });

//             // Add click event listener to table rows for alerting product ID
//             $('#data-table-products tbody').on('click', '.tr-products', function() {
//                 const productId = $(this).data('id');
//                 $('#product_id_view').val(productId);
//                 $.ajax({
//                     type: "POST",
//                     url: "/retrieve_product",
//                     data: JSON.stringify({'product_id': productId}),
//                     dataType: "json",
//                     contentType: "application/json",
//                     success: function (response) {
//                         const product_name = response.name
//                         $('#edit_product_name').val(product_name)
//                     }
//                 });
//             });
//         }
//     });
// });

// function deleteProduct() {
//     const product_id = $('#product_id').val();
//     $.ajax({
//         type: "POST",
//         url: "/delete_product",
//         data: JSON.stringify({ 'product_id': product_id }),
//         dataType: "json",
//         contentType: "application/json",
//         success: function (response) {
//             console.log(response)
//             // Optionally, close the modal
//             $('#cancel_product').click();
//             $('#product_delete_alert').show();
//             setTimeout(() => {
//                 location.reload()
//             }, 1500);
//         },
//         error: function (xhr, status, error) {
//             // Handle errors
//             alert('Error deleting product: ' + error);
//         }
//     });
// }

function addProduct() {
    // Collecting input values
    const productName = $('#product_name').val();
    const productPrice = $('#product_price').val();
    const productSize = $('input[name="size"]:checked').val(); // Get the selected size value
    const barcodeId = $('#barcode_id').val(); // Ensure correct ID for the barcode input
    const categoryIds = $('#category-select').val(); // Get selected category ID

    // Get the selected file
    const productImage = $('input[type="file"]')[0]?.files[0]; // Use optional chaining to prevent errors

    // Validate input fields
    if (!productName || !productPrice || !productSize || !barcodeId || !categoryIds || !productImage) {
        alert("Please fill in all fields and select an image.");
        return;
    }

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
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
            console.log("Product added successfully:", response);
            alert("Product added successfully!"); // Provide user feedback
        },
        error: function(xhr) {
            console.error("Error adding product:", xhr.responseText);
            alert("Error adding product: " + xhr.responseText); // Provide user feedback
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
