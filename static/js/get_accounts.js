$(document).ready(function() {
    // Fetch the JSON data from the Flask endpoint
    $.ajax({
        url: '/get_accounts',
        method: 'GET',
        success: function(data) {
            // Clear the existing rows
            $('#data-table-accounts tbody').empty();

            // Loop through the data and append rows to the table
            data.forEach(function(item) {
                $('#data-table-accounts tbody').append(
                    `<tr data-id="${item.id}" style="cursor: pointer">
                        <td class="pt-3 pb-3 ps-4">${item.id}</td>
                        <td class="pt-3 pb-3">${item.date_created}</td>
                        <td class="pt-3 pb-3">${item.fname} ${item.lname}</td>
                        <td class="pt-3 pb-3">${item.username}</td>
                        <td class="pt-3 pb-3">${item.email}</td>
                        <td class="pt-3 pb-3">${item.contact}</td>
                        <td class="pt-3 pb-3 text-center">${item.role}</td>
                        <td class="pt-3 pb-3 text-center">
                            <button class="btn-delete-account" style="background-color: transparent; border: none;" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#deleteAccount">
                                <i class="bi bi-trash3 text-danger"></i>
                            </button>
                        </td>
                    </tr>`
                );
            });

            // Initialize DataTable with pagination (only initialize once)
            if (!$.fn.DataTable.isDataTable('#data-table-accounts')) {
                $('#data-table-accounts').DataTable({
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

            // Add click event listener to rows
            $('#data-table-accounts tbody').on('click', 'tr', function() {
                const accountId = $(this).data('id');
                console.log('Clicked account ID:', accountId);
                
                // Fetch the account details from the server
                $.ajax({
                    url: '/get_one_account',  // Change this to the correct endpoint for fetching one account
                    method: 'GET',
                    data: { id: accountId },  // Pass the account ID as data
                    dataType: 'json', // Expect a JSON response
                    success: function(account) {
                        console.log(account);  
                        // Populate the modal fields with the account data
                        $('.id').val(account.id); // Assuming 'fname' is the first name
                        $('.first_name').val(account.fname); // Assuming 'fname' is the first name
                        $('.last_name').val(account.lname); // Assuming 'lname' is the last name
                        $('.contact').val(account.contact);
                        $('.email').val(account.email);
                        $('.username').val(account.username);
                        $('.role').val(account.role); // Assuming 'role' matches the select option values
                        $('.address').val(account.address);
                        // Optionally, you can set a default password or leave it blank
                        $('.password').val(account.password); // Leave this blank for security
                        
                        // Show the modal
                        $('#updateAccount').modal('show');
                    },
                    error: function(xhr, status, error) {
                        alert('Error fetching account data: ' + error);
                    }
                });
                
            });
            

            // Add click event listener to delete buttons (using delegation for dynamic content)
            $('#data-table-accounts tbody').on('click', '.btn-delete-account', function(event) {
                event.stopPropagation(); // Prevent triggering row click
                const accountId = $(this).data('id');
                $('#account_id').val(accountId);
            });
        },
        error: function(xhr, status, error) {
            alert('Error fetching data: ' + error);
        }
    });
});


function deleteAccount() {
    const product_id = $('#account_id').val();
    $.ajax({
        type: "POST",
        url: "/delete_account",
        data: JSON.stringify({ 'product_id': product_id }),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            // Optionally, close the modal and show success alert
            $('#cancel_account').click(); // Close modal
            $('#account_delete_alert').show(); // Show alert

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

function addAccounts() {
    let isValid = true;

    const firstName = document.getElementById("first_name");
    const lastName = document.getElementById("last_name");
    const contact = document.getElementById("contact");
    const email = document.getElementById("email");
    const username = document.getElementById("username");
    const role = document.getElementById("role");
    const address = document.getElementById("address");
    const password = document.getElementById("password");
    const cpassword = document.getElementById("cpassword");

    function validateField(field, errorMessage) {
        if (!field.value.trim()) {
            field.classList.add("is-invalid");
            field.nextElementSibling.innerHTML = errorMessage;
            isValid = false;
        } else {
            field.classList.remove("is-invalid");
        }
    }

    validateField(firstName, "First name is required.");
    validateField(lastName, "Last name is required.");
    validateField(contact, "Contact is required.");
    validateField(username, "Username is required.");
    validateField(role, "Role is required.");
    validateField(address, "Address is required.");
    validateField(password, "Password is required.");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.match(emailPattern)) {
        email.classList.add("is-invalid");
        email.nextElementSibling.innerHTML = "Please enter a valid email address.";
        isValid = false;
    } else {
        email.classList.remove("is-invalid");
    }

    if (password.value !== cpassword.value) {
        cpassword.classList.add("is-invalid");
        cpassword.nextElementSibling.innerHTML = "Passwords do not match.";
        isValid = false;
    } else {
        cpassword.classList.remove("is-invalid");
    }

    if (isValid) {
        const data = {
            first_name: firstName.value,
            last_name: lastName.value,
            contact: contact.value,
            email: email.value,
            username: username.value,
            role: role.value,
            address: address.value,
            password: password.value,
        };

        fetch('/add_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error: " + data.error);
            } else {
                $('#cancel_account_add').click(); // Close modal
                $('#stock_add_alert').show(); // Show alert
                setTimeout(function() {
                    location.reload();
                }, 3000);

            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
    }
}