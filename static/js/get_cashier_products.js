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
                                    <div style="position: relative;">
                                        <div style="width: 100%; height: 200px;">
                                            <img style="object-fit: cover; width: 100%; height: 100%;" src="${item.product_image}" alt="Product Image">
                                            <button style="position: absolute; right: 10px; bottom: 10px;" class="btn border btn-dark rounded-5 add-to-cart" data-id="${item.id}" data-stock="${item.stock}" data-image="${item.product_image}" data-name="${item.name}" data-size="${item.size}" data-price="${item.price}" ${item.stock <= 0 ? 'disabled' : ''}>
                                                <i class="bi bi-cart-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="mb-0">${item.name}</p>
                                    <h6 class="fw-bolder mt-0">₱ ${item.price.toFixed(2)} PHP</h6>
                                    <p class="mb-0">${item.stock <= 0 ? 'No stock' : `In stock: ${item.stock}`}</p>
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
                    const productMax = $(this).data('stock');
                    const productPrice = parseFloat($(this).data('price'));
                    const productStock = parseInt($(this).closest('.p-3').find('p.mb-0').text().split(': ')[1]) || 0; // Get the stock value

                    // Check stock availability
                    if (productStock <= 0) {
                        alert('Sorry, this item is out of stock.');
                        return; // Exit if there's no stock
                    }

                    // Create the cart item object
                    const cartItem = {
                        id: productId,
                        product_image: productImage,
                        name: productName,
                        size: productSize,
                        stock: productMax,
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
                    populateCart();
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
                        <p class="p-0 mb-1">Stock: ${item.stock}</p>
                    </td>
                    <td>
                        <input class="form-control bg-muted form-control-sm qty-input" type="text" value="${item.qty}" data-stock="${item.stock}" data-id="${item.id}">
                    </td>
                    <td>
                        <button class="btn remove-item" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
            // Append the row to the tbody
            cartItemsContainer.append(row);
            calculateTotals()
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

    // Function to validate quantity
    function validateQuantity(inputElement, newQty) {
        const maxQty = $(inputElement).data('stock');
        return newQty <= maxQty;
    }

    // Event delegation to handle changes in quantity inputs
    $('#cart-items').on('input', '.qty-input', function() {
        const productId = $(this).data('id');
        let newQty = parseInt($(this).val()) || 1; // Default to 1 if invalid input
        
        if (validateQuantity(this, newQty)) {
            updateCartQuantity(productId, newQty); // Update local storage immediately
        } else {
            // Optionally, you can alert the user or reset the value
            $(this).val($(this).data('qty')); // Reset to the original quantity
            alert(`Quantity cannot exceed ${$(this).data('stock')}.`);
        }
    });

    // Update quantity when input loses focus (click outside)
    $('#cart-items').on('blur', '.qty-input', function() {
        const productId = $(this).data('id');
        let newQty = parseInt($(this).val()) || 1; // Default to 1 if invalid input
        
        if (validateQuantity(this, newQty)) {
            updateCartQuantity(productId, newQty); // Update local storage
        } else {
            $(this).val($(this).data('qty')); // Reset to the original quantity
            alert(`Quantity cannot exceed ${$(this).data('stock')}.`);
        }
        
        populateCart();
    });

    // Update quantity when Enter key is pressed
    $('#cart-items').on('keypress', '.qty-input', function(event) {
        if (event.which === 13) { // Enter key
            const productId = $(this).data('id');
            let newQty = parseInt($(this).val()) || 1; // Default to 1 if invalid input
            
            if (validateQuantity(this, newQty)) {
                updateCartQuantity(productId, newQty); // Update local storage
                $(this).blur(); // Trigger blur to close the input field
            } else {
                $(this).val($(this).data('qty')); // Reset to the original quantity
                alert(`Quantity cannot exceed ${$(this).data('stock')}.`);
            }
            
            populateCart();
        }
    });
});

// Function to format numbers as monetary values
function formatCurrency(value) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

// Function to calculate and populate totals
function calculateTotals() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;

    // Calculate subtotal based on cart items
    cart.forEach(item => {
        subtotal += item.price * item.qty; // Assuming price is in the correct format
    });

    // Calculate VAT (12% of subtotal)
    const vat = subtotal * 0.12;

    // Update the display with formatted values
    $('#subtotal').text(formatCurrency(subtotal));
    $('#vat').text(formatCurrency(vat));
    $('#total').text(formatCurrency(subtotal)); // Total is the same as subtotal in this case

    // Set the payment input value to the total amount
    $('#payment').val(subtotal.toFixed(2)); // Set payment input to the total

    // Update change based on payment input
    updateChange();
}

// Function to update the change displayed and enable/disable the payment button
function updateChange() {
    const paymentInput = parseFloat($('#payment').val()) || 0; // Get payment value or default to 0
    const total = parseFloat($('#total').text().replace(/[₱, ]/g, '')) || 0; // Parse total amount

    // If total is 0, clear the payment input and disable the button and input
    if (total === 0) {
        $('#payment').val(''); // Clear payment input
        $('#payment').prop('disabled', true); // Disable payment input
        $('#btn-payment').prop('disabled', true); // Disable payment button
        $('#change').text(formatCurrency(0)); // Optionally reset change display
        return; // Exit the function early
    } else {
        $('#payment').prop('disabled', false); // Enable payment input if total is not 0
    }

    const change = paymentInput - total; // Calculate change

    $('#change').text(formatCurrency(change)); // Update change display

    // Conditional coloring for change
    if (change < 0) {
        $('#change').css('color', 'red'); // Change text color to red if payment is less than total
    } else {
        $('#change').css('color', ''); // Reset to default color if payment is sufficient
    }

    // Enable or disable the payment button based on payment amount
    if (paymentInput >= total) {
        $('#btn-payment').prop('disabled', false); // Enable button
    } else {
        $('#btn-payment').prop('disabled', true); // Disable button
    }
}



// Call this function whenever cart is populated or updated
$(document).ready(function() {
    populateCart();
    calculateTotals(); // Initial calculation on page load

    // Event delegation for cart changes
    $('#cart-items').on('change input', '.qty-input', function() {
        const productId = $(this).data('id');
        const newQty = parseInt($(this).val()) || 1; // Default to 1 if invalid input
        updateCartQuantity(productId, newQty); // Update local storage
        calculateTotals(); // Recalculate totals after updating quantity
    });

    $('#cart-items').on('click', '.remove-item', function() {
        const productId = $(this).data('id');

        // Remove the item from the cart array
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        
        // Update local storage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Repopulate the cart and recalculate totals
        populateCart();
        calculateTotals();
    });

    // Event listener for payment input changes
    $('#payment').on('input blur', function() {
        updateChange(); // Update change display when input changes or loses focus
    });
});


// Reset button
// Function to remove all items from the cart and clear the session
function remove_cart() {
    // Clear the cart from local storage
    localStorage.removeItem('cart');

    // Clear the cart display on the webpage
    const cartItemsContainer = $('#cart-items');
    cartItemsContainer.empty(); // Remove all cart items from the display
    cartItemsContainer.append(
        `<tr>
            <td colspan="4" class=" text-center text-muted" style="font-size: 20px; padding-top: 10rem; padding-bottom: 10rem">
                <i class="bi bi-cart2 fs-3"></i> No items in the cart.
            </td>
        </tr>`
    );

    // Reset totals to zero
    $('#subtotal').text(formatCurrency(0));
    $('#vat').text(formatCurrency(0));
    $('#total').text(formatCurrency(0));
    $('#change').text(formatCurrency(0));
    
    // Clear the payment input
    $('#payment').val('');

    // Disable the payment button
    $('#btn-payment').prop('disabled', true);

    // Optional: You can also reset any other session-related data here
    // For example, if using sessionStorage or any session variables
    // sessionStorage.removeItem('sessionCartData'); // Example
}

// Call this function when you want to clear the cart, e.g., on a button click
$(document).ready(function() {
    // Example button for removing the cart
    $('#remove-cart-btn').on('click', function() {
        remove_cart(); // Call the remove_cart function
    });
});


// Function for payment
// Function to generate a 10-digit reference ID
function generateReferenceId() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// Function to log cart details and payment information
function logPaymentDetails() {
    // Get the cart from local storage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const reference_id = generateReferenceId(); // Generate the reference ID

    // Get the subtotal, VAT, total, payment, and change values as plain text
    const subtotal = $('#subtotal').text().replace('₱', '').trim();
    const vat = $('#vat').text().replace('₱', '').trim();
    const total = $('#total').text().replace('₱', '').trim();
    const payment = parseFloat($('#payment').val()) || 0; // Assuming #payment is an input element
    const change = $('#change').text().replace('₱', '').trim();

    // Prepare data to send
    const paymentData = {
        reference_id: reference_id, // Include the reference ID
        cart: cart,
        subtotal: subtotal,
        vat: vat,
        total: total,
        payment: payment.toFixed(2), // Keeping this as float and formatted
        change: change,
        type: selectedPaymentMethod
    };

    console.log(paymentData);
    // Send the details to the server via AJAX
    $.ajax({
        url: '/create_sale', // Replace with your server URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(paymentData),
        success: function(response) {
            console.log('Payment logged successfully:', response);
            // Optionally, handle the response (e.g., show a success message)
            localStorage.removeItem('cart'); // Uncomment if you want to clear the cart
            populateCart();
            $('#receipt').modal('show')

            $.ajax({
                url: '/get_receipt', // Replace with your server URL
                type: 'POST', // or 'GET' depending on your needs
                data: {
                    reference_id: reference_id // Assuming reference_id is a variable you have defined
                },
                success: function(response) {
                    console.log('Full Response:', response); // Log the full response
                    
                    // Check if response is an array
                    if (Array.isArray(response) && response.length > 0) {
                        var rows = '';
                        
                        // Populate the first item into a specific <p> tag
                        var firstItem = response[0];
                        $('#firstItemInfo').text(firstItem.item_name + ' - ₱' + parseFloat(firstItem.price).toLocaleString() + ' x ' + firstItem.qty);
            
                        // Parse subtotal and calculate VAT
                        var subtotal = parseFloat(firstItem.subtotal.replace(/,/g, '')) || 0; // Ensure it's a number
                        var vat = subtotal * 0.12; // 12% of subtotal
            
                        // Populate subtotal, total_amount, payment, change, vat, and sales_date with the "receipt_" prefix
                        $('#receipt_subtotal').text('₱' + subtotal.toLocaleString());
                        $('#receipt_totalAmount').text('₱' + parseFloat(firstItem.total_amount.replace(/,/g, '')).toLocaleString());
                        $('#receipt_payment').text('₱' + parseFloat(firstItem.payment).toLocaleString());
                        $('#receipt_change').text('₱' + parseFloat(firstItem.change).toLocaleString());
                        $('#receipt_sales_date, #receipt_sales_dates').text(firstItem.sale_date); // Adjust format as needed
                        $('#receipt_vat').text('₱' + vat.toLocaleString()); // Populate VAT
            
                        // Loop through the response to create table rows
                        response.forEach(function(item) {
                            rows += '<tr>' +
                                        '<td><p class="m-0">' + item.item_name + ' ₱ ' + parseFloat(item.price).toLocaleString() + ' x ' + item.qty + '</p></td>' +
                                        '<td><p class="m-0 text-end">₱ ' + (item.price * item.qty).toLocaleString() + '</p></td>' + // Correctly multiply and format
                                    '</tr>';
                        });
            
                        // Append the new rows to the table
                        $('#receiptTable tbody').append(rows); // Replace #receiptTable with your actual table ID
                    } else {
                        $('#receiptTable tbody').append('<tr><td colspan="2" class="text-center">No items found.</td></tr>');
                    }
                },
                error: function(xhr, status, error) {
                    // Handle error
                    console.error('Error:', error);
                }
            });
                        
            
            
            

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error logging payment:', textStatus, errorThrown);
            // Optionally, handle errors (e.g., show an error message)
        }
    });
}

// Call this function when the payment button is clicked
$(document).ready(function() {
    $('#btn-payment').on('click', function() {
        logPaymentDetails(); // Call the logPaymentDetails function
    });
});


function printReceipt() {
    // Print the receipt
    $('#close_receipt').click()
    remove_cart()
    // Hide POS page and show receipt page
    document.getElementById('pos_page').style.display = 'none';
    document.getElementById('receipt_page').style.display = 'block';
    setTimeout(() => {
        window.print();
    }, 3000);
}