$(document).ready(function(){

    $("#txtOldPass").focus();

    $("#btnSave").click(function(e){
        var oldpass = $("#txtOldPass").val();
        var newpass = $("#txtNewPass").val();
        var validatepass = $("#txtValidatePass").val();
        if(newpass != validatepass){
            alert("You have to confirm with right password!");
            return;
        }

        $.post('/changePassword', {oldpass: oldpass, newpass: newpass}, function(data) {
                if(data == "Wrong password"){
                    alert("This password has not used before!");
                }
                if(data == "Success"){
                    alert("Change password successfully");
                    $("#txtOldPass").val("");
                    $("#txtNewPass").val("");
                    $("#txtValidatePass").val("");
                    $("#txtOldPass").focus();
                }
            });
    })

    $("#btnBack").click(function(e){
        window.location.href = "/choose";
    });
});