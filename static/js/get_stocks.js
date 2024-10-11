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
            $('#cancel_product_add').click(); // Close the modal
            $('#product_add_alert').show(); // Show success alert
            
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
