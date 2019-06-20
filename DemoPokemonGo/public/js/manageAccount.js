$(document).ready(function () {
    $(".my-button").click(function (e) {
        e.preventDefault();
        // $(this).toggleClass("active-button");

        if($(this).hasClass("active-button")){
            var nickname= $(this).closest('.motNhanVat').find('.ten').attr('value');
            if(confirm("Do you want to unblock this account?")){
                $(this).toggleClass("active-button");
                $.post('/updateAccount', {nickname: nickname, status: 0}, function(data){
                    if(data == "Success"){
                        alert("Block this account successfully");
                        return;
                    }
                });
            }
        }
        else{
            var nickname= $(this).closest('.motNhanVat').find('.ten').attr('value');
            if(confirm("Do you want to block this account?")){
                $(this).toggleClass("active-button");
                $.post('/updateAccount', {nickname: nickname, status: 1}, function(data){
                    if(data == "Success"){
                        alert("Unblock this account successfully");
                        return;
                    }
                });
            }
        }
    });
});