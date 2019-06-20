$(document).ready(function () {
    var error = $("#Fail").attr('value');
    if(error == "Fail"){
        alert("Login fail!");
    }
    if(error == "Block"){
        alert("This account has been blocked!");
    }

    $("#lbForgot").click(function(e){
        $("#frmEmail").css({
            "display": "block"
        });
        $("#frmLogin").css({
            "display": "none"
        });
        $("#email").focus();
    });

    $("#btnBack").click(function(e){
        $("#frmEmail").css({
            "display": "none"
        });
        $("#frmLogin").css({
            "display": "block"
        });
        $("#email").val("");
        $("#UserName").focus();
    });

    $("#btnSend").click(function(e){
        var email = $("#email").val();
        if(!ValidateEmail(email)){
            alert("This is not an email!");
            $("#email").focus();
        }
        else{
            $.post('/forgot', {email: email}, function(data){
                if(data == "Wrong Email"){
                    alert("This email has not been used!");
                }
                if(data == "Success"){
                    alert("You can check this email and got new password for your account");
                    $("#frmEmail").css({
                        "display": "none"
                    });
                    $("#frmLogin").css({
                        "display": "block"
                    });
                    $("#email").val("");
                    $("#UserName").focus();
                }
            })
        }
    });

    function ValidateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email));
    }
});

function Validation(){
    var username = document.getElementById("UserName").value;
    var password = document.getElementById("password").value;
    if(username == ""){
        alert("Username must be filled!");
        return false;
    }
    if(password == ""){
        alert("Password must be filled!");
        return false;
    }
    return true;
}