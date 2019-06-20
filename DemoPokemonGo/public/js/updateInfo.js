$(document).ready(function(){
    $("#btnSave").click(function(e){
        var name = $("#txtName").val();
        var age = $("#txtAge").val();
        var nickname = $("#txtNickName").val();
        var email = $("#txtEmail").val();
        if(name == ""){
            alert("Name must be filled!");
            return;
        }
        if(age == ""){
            alert("Age must be filled!");
            return;
        }
        if(nickname == ""){
            alert("Nick Name must be filled!");
            return;
        }
        if(!ValidateEmail(email)){
            alert("Email is not valid!");
            return;
        }

        $.post('/updateInfo', {fullname: name, age: age, email: email, 
            nickname: nickname}, function(data){
                if(data == "Nickname"){
                    alert("Nickname has been used!");
                }
                if(data == "Email"){
                    alert("Email has been used!");
                }
                if(data == "Success"){
                    alert("Success");
                }
            });
    });

    $("#btnBack").click(function(e){
        window.location.href = "/choose";
    });

    function ValidateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email));
    }
});