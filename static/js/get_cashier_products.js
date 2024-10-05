$(document).ready(function() {
    // Fetch and render categories
    $.ajax({
        url: '/read_categories',
        method: 'GET',
        success: function(data) {
            // Loop through the data and append category buttons
            data.forEach(function(item) {
                $('#cashier-category').append(
                    `<button class="btn btn-sm category-btn" data-categoryId="${item.id}">${item.name}</button>`
                );
            });

            // Add click event listener to category buttons
            $('.category-btn').on('click', function() {
                const categoryId = $(this).data('categoryid');
                // Fetch products based on the selected category
                fetchProducts(categoryId);
            });
        },
        error: function(xhr, status, error) {
            alert('Error fetching categories: ' + error);
        }
    });

    // Function to fetch products based on category ID
    function fetchProducts(categoryId) {
        $.ajax({
            url: '/read_products',
            method: 'GET',
            success: function(data) {
                // Clear the existing products
                $('#product-grid').empty();

                // Loop through the data and append product cards
                data.forEach(function(item) {
                    // If categoryId is null, show all products, otherwise filter by category
                    if (!categoryId || item.category_id === categoryId) {
                        $('#product-grid').append(
                            `<div class="col-6 col-md-4">
                                <div class="p-3">
                                    <div style="position: relative; z-index: -10">
                                        <div style="width: 100%; height: 200px;">
                                            <img style="object-fit: cover; width: 100%; height: 100%;" src="${item.product_image}" alt="Product Image">
                                            <button style="position: absolute; right: 10px; bottom: 10px;" class="btn border btn-dark rounded-5" data-id="${item.id}">
                                                <i class="bi bi-cart-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="mb-0">${item.name}</p>
                                    <h6 class="fw-bolder mt-0">₱ ${item.price.toFixed(2)} PHP</h6>
                                </div>
                            </div>`
                        );
                    }
                });

                // Add click event listener to the "Add to Cart" buttons
                $('#product-grid').on('click', '.btn', function() {
                    const productId = $(this).data('id');
                    // Handle add to cart functionality here
                    console.log("Product ID:", productId);
                });
            },
            error: function(xhr, status, error) {
                alert('Error fetching products: ' + error);
            }
        });
    }

    // Add click event listener for the "All" button
    $('#all_category').on('click', function() {
        // Fetch and display all products when "All" button is clicked
        fetchProducts(null); // Passing null to fetch all products
    });

    // Initially fetch all products (without any category filtering)
    fetchProducts(null); // Passing null to fetch and display all products initially
});
