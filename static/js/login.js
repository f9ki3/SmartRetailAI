$(document).ready(function() {
    // Event listener for Enter key
    $('#uname, #passw').keydown(function(event) {
        if (event.key === 'Enter') {  // Check if the pressed key is Enter
            event.preventDefault(); // Prevent the default action (form submission)
            login();  // Call the login function
        }
    });
});

function login(){
    const uname = $('#uname').val()
    const passw = $('#passw').val()
    data = {
        'uname': uname,
        'passw': passw
    }
    $('#login_text').hide()
    $('#login_loading').show()
    setTimeout(() => {
        $.ajax({
            type: "POST",
            url: "/post_login",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (response) {
                data = response.role
                console.log(data)
                if (data == "admin") {
                    window.location.href = '/admin-dashboard';
                } else if (data == "cashier") {
                    window.location.href = '/cashier-pos';
                } else {
                    $('#login_text, #loginValid').show();
                    $('#login_loading').hide();
                }
            },
            error: function () {
                // Handle any errors during the request
                $('#login_text, #loginValid').show();
                $('#login_loading').hide();
                console.error("Error with login request.");
            }
        });
    }, 3000);
    
}