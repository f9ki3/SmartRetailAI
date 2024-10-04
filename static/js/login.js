function login(){
    const uname = $('#uname').val()
    const passw = $('#passw').val()
    data = {
        'uname': uname,
        'passw': passw
    }
    setTimeout(() => {
        $.ajax({
            type: "POST",
            url: "/post_login",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (response) {
                data = response
                if (data == "1"){
                    window.location.href = '/admin-dashboard'
                }else{
                    location.reload()
                }
            }
        });
    }, 3000);
}