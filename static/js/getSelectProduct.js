$(document).ready(function() {
    // Fetch products from the server
    $.ajax({
        url: '/read_products',
        method: 'GET',
        success: function(products) {
            products.forEach(function(product) {
                $('#product-list').append(
                    $('<div>', {
                        class: 'product-option',
                        text: product.name,
                        'data-value': product.id
                    })
                );
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching products:', error);
        }
    });

    // Toggle the search container
    $('#selected-product').on('click', function() {
        $('#search-container').toggle();
        $('#search-input').val('').focus(); // Clear and focus the input
        filterProducts(''); // Show all products
    });

    // Filter products based on search input
    $('#search-input').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterProducts(searchTerm);
    });

    // Select a product
    $(document).on('click', '.product-option', function() {
        const productName = $(this).text();
        const productId = $(this).data('value');

        $('#selected-product').text(productName);
        $('#selected-id').val(productId);
        $('#search-container').hide();
    });

    // Function to filter products
    function filterProducts(searchTerm) {
        $('.product-option').each(function() {
            const productName = $(this).text().toLowerCase();
            $(this).toggle(productName.includes(searchTerm));
        });
    }

    // Hide search container when clicking outside
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.custom-select').length) {
            $('#search-container').hide();
        }
    });
});
