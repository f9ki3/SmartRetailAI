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

    // Function to fetch products based on category ID or search query
    function fetchProducts(categoryId, searchQuery = '') {
        $.ajax({
            url: '/read_products',
            method: 'GET',
            success: function(data) {
                // Clear the existing products
                $('#product-grid').empty();

                // Array to hold matched products
                const matchedProducts = [];

                // Loop through the data and append product cards
                data.forEach(function(item) {
                    // If categoryId is null, show all products, otherwise filter by category
                    const matchesCategory = !categoryId || item.category_id === categoryId;
                    const matchesSearchQuery = !searchQuery || 
                        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.barcode_id.toLowerCase().includes(searchQuery.toLowerCase());

                    if (matchesCategory && matchesSearchQuery) {
                        matchedProducts.push(item);
                    }
                });

                // Check if there are matched products
                if (matchedProducts.length > 0) {
                    // Display matched products
                    matchedProducts.forEach(function(item) {
                        $('#product-grid').append(
                            `<div class="col-6 col-md-4">
                                <div class="p-3">
                                    <div style="position: relative; ">
                                        <div style="width: 100%; height: 200px;">
                                            <img style="object-fit: cover; width: 100%; height: 100%;" src="${item.product_image}" alt="Product Image">
                                            <button style="position: absolute; right: 10px; bottom: 10px;" class="btn border btn-dark rounded-5 add-to-cart" data-id="${item.id}" data-image="${item.product_image}" data-name="${item.name}" data-size="${item.size}" data-price="${item.price}">
                                                <i class="bi bi-cart-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="mb-0">${item.name}</p>
                                    <h6 class="fw-bolder mt-0">₱ ${item.price.toFixed(2)} PHP</h6>
                                </div>
                            </div>`
                        );
                    });
                } else {
                    // Show no results image or message
                    $('#product-grid').append(
                        `<div class="text-center" style="margin: 20px;">
                            <img src="../static/img/lost.svg" alt="No results found" style="max-width: 50%; opacity: 75%; height: auto; margin-top: 100px">
                            <p class="mt-3 text-muted">No results found.</p>
                        </div>`
                    );
                }

                // Add click event listener to the "Add to Cart" buttons
                $('#product-grid').on('click', '.add-to-cart', function() {
                    const productId = $(this).data('id');
                    const productImage = $(this).data('image');
                    const productName = $(this).data('name');
                    const productSize = $(this).data('size');
                    const productPrice = parseFloat($(this).data('price'));
                    console.log('click!')
                    // Create the cart item object
                    const cartItem = {
                        id: productId,
                        product_image: productImage,
                        name: productName,
                        size: productSize,
                        qty: 1, // Default quantity
                        price: productPrice,
                        subtotal: productPrice // Subtotal is equal to price for 1 item
                    };

                    // Get existing cart items from local storage
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];

                    // Check if the item already exists in the cart
                    const existingItemIndex = cart.findIndex(item => item.id === productId);
                    if (existingItemIndex > -1) {
                        // Item exists, update quantity and subtotal
                        cart[existingItemIndex].qty += 1; // Increment quantity
                        cart[existingItemIndex].subtotal += productPrice; // Update subtotal
                    } else {
                        // Item does not exist, add new item to the cart
                        cart.push(cartItem);
                    }

                    // Save updated cart to local storage
                    localStorage.setItem('cart', JSON.stringify(cart));

                    // Optional: Provide user feedback (e.g., alert, notification)
                    alert(`${productName} has been added to your cart.`);
                    populateCart()
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

    // Add input event listener for the search box
    $('#search-pos').on('input', function() {
        const searchQuery = $(this).val().trim(); // Get the search query
        // Fetch all products and filter based on the search query
        fetchProducts(null, searchQuery); // Passing null to fetch all products
    });

    // Initially fetch all products (without any category filtering)
    fetchProducts(null); // Passing null to fetch and display all products initially
});

// Function to populate the cart items from local storage
function populateCart() {
    // Get cart items from local storage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Get the tbody element where rows will be appended
    const cartItemsContainer = $('#cart-items');

    // Clear existing rows in the cart
    cartItemsContainer.empty();

    // Check if the cart has items
    if (cart.length > 0) {
        cart.forEach(item => {
            // Create a new row for each cart item
            const row = `
                <tr>
                    <td>
                        <div style="height: 100px;">
                            <img style="object-fit: cover; width: 100%; height: 100%;" src="${item.product_image}" alt="">
                        </div>
                    </td>
                    <td>
                        <p class="p-0 mb-1">${item.name}</p>
                        <p class="p-0 mb-1">₱ ${item.price.toFixed(2)} x ${item.qty}</p>
                    </td>
                    <td>
                        <input class="form-control bg-muted form-control-sm qty-input" type="text" value="${item.qty}" data-id="${item.id}">
                    </td>
                    <td>
                        <button class="btn remove-item" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
            // Append the row to the tbody
            cartItemsContainer.append(row);
        });
    } else {
        // Optionally show a message when the cart is empty
        cartItemsContainer.append(
            `<tr>
                <td colspan="4" class=" text-center text-muted" style="font-size: 20px; padding-top: 10rem; padding-bottom: 10rem">
                    <i class="bi bi-cart2 fs-3"></i> No items in the cart.
                </td>
            </tr>`
        );
        
    }
}

// Call the function to populate the cart on page load
$(document).ready(function() {
    populateCart();

    // Event delegation to handle removing items from the cart
    $('#cart-items').on('click', '.remove-item', function() {
        const productId = $(this).data('id');
        
        // Remove the item from the cart array
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        
        // Update local storage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Repopulate the cart
        populateCart();
    });

    // Function to update the quantity in local storage
    function updateCartQuantity(productId, newQty) {
        // Get cart items from local storage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Ensure the quantity is at least 1
        newQty = Math.max(1, newQty); // Set to 1 if less than 1

        // Find the item and update its quantity
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            cart[itemIndex].qty = newQty; // Update quantity
        }

        // Update local storage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Event delegation to handle changes in quantity inputs
    $('#cart-items').on('input', '.qty-input', function() {
        const productId = $(this).data('id');
        let newQty = parseInt($(this).val()) || 1; // Default to 1 if invalid input
        updateCartQuantity(productId, newQty); // Update local storage immediately
    });

    // Update quantity when input loses focus (click outside)
    $('#cart-items').on('blur', '.qty-input', function() {
        const productId = $(this).data('id');
        let newQty = parseInt($(this).val()) || 1; // Default to 1 if invalid input
        updateCartQuantity(productId, newQty); // Update local storage
        populateCart();
    });

    // Update quantity when Enter key is pressed
    $('#cart-items').on('keypress', '.qty-input', function(event) {
        if (event.which === 13) { // Enter key
            const productId = $(this).data('id');
            let newQty = parseInt($(this).val()) || 1; // Default to 1 if invalid input
            updateCartQuantity(productId, newQty); // Update local storage
            $(this).blur(); // Trigger blur to close the input field
            populateCart();
        }
    });
});
