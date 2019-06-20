$(document).ready(function () {
    var character_id = 1;
    var character_name = "Satoshi";
    var userid = $('#userid').attr('value');

    function myremoveClass() {
        var classList = $(".background-figure").attr('class').split(' ');
        if (classList.length == 2) {
            var className = classList[1];
            $(".background-figure").removeClass(className);
        }
        TweenMax.fromTo($(".selected-figure img"), 1, { opacity: 0 }, { opacity: 1 });
    }
    $("#Satoshi").click(function (e) {
        e.preventDefault();
        myremoveClass();
        $('#txtNickname').focus();
        $(".selected-figure img").attr("src", "/images/characters/Satoshi.png");
        character_id = 1;
        character_name = "Satoshi";
        TweenMax.fromTo($(".background-figure").addClass("background-Satoshi"), 1, { left: "100%" }, { left: 0 });
    });
    $("#Takeshi").click(function (e) {
        e.preventDefault();
        myremoveClass();
        $('#txtNickname').focus();
        $(".selected-figure img").attr("src", "/images/characters/Takeshi.png");
        character_id = 2;
        character_name = "Takeshi";
        TweenMax.fromTo($(".background-figure").addClass("background-Takeshi"), 1, { left: "100%" }, { left: 0 });

    });
    $("#James").click(function (e) {
        e.preventDefault();
        myremoveClass();
        $('#txtNickname').focus();
        $(".selected-figure img").attr("src", "/images/characters/James.png");
        character_id = 4;
        character_name = "James";
        TweenMax.fromTo($(".background-figure").addClass("background-James"), 1, { left: "100%" }, { left: 0 });
    });
    $("#Jessie").click(function (e) {
        e.preventDefault();
        myremoveClass();
        $('#txtNickname').focus();
        $(".selected-figure img").attr("src", "/images/characters/Jessie.png");
        character_id = 5;
        character_name = "Jessie";
        TweenMax.fromTo($(".background-figure").addClass("background-Jessie"), 1, { left: "100%" }, { left: 0 });
    });
    $("#May").click(function (e) {
        e.preventDefault();
        myremoveClass();
        $('#txtNickname').focus();
        $(".selected-figure img").attr("src", "/images/characters/May.png");
        character_id = 3;
        character_name = "May";
        TweenMax.fromTo($(".background-figure").addClass("background-May"), 1, { left: "100%" }, { left: 0 });
    });

    $('#btnCreate').click(function (e) {
        if ($('#txtNickname').val() == "") {
            alert("You have to choose nickname!");
        }
        else {
            var nickname = $('#txtNickname').val();
            var date = new Date();
            var changing_time = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
                + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                
                $.post('/saveAvatar', {characterid: character_id, 
                    charactername: character_name, time: changing_time, nickname: nickname
                },function (data){
                    if(data == "Used"){
                        alert("This nickname has been used!");
                        $("#txtNickname").focus();
                    }
                    if(data == "Success"){
                        window.location.href = "/choose";
                    }
                });
        }
    });

    $("#btnLogout").click(function(e){
        window.location.href = "/logout";
    });
});