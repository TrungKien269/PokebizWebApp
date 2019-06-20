$(document).ready(function () {
    var tgtrai = document.getElementById('phantramtrai');
    var tgphai = document.getElementById('phantramphai');
    var tgDau = 0;
    var tgCuoi = 100;

    var id = setInterval(frame, 15);

    function frame() {
        if (tgDau == tgCuoi) {
            clearInterval(id);
            TweenMax.fromTo($('.background-playgame'), 1, { left: "0" }, { left: "-100%" });
        } else {
            tgDau += 2;
            tgtrai.innerHTML = tgDau + '%';
            tgphai.innerHTML = tgDau + '%';
        }
    }

    $('#btnPlay').click(function () {
        var nickname = $('#nickname').attr('value');
        var character = $('#character').attr('value');
        var user_id = $(location).attr("href");
        user_id = user_id.slice(29);
        window.location = "/play/" + character;
    });

    $(window).bind("pageshow", function (event) {
        if (event.originalEvent.persisted) {
            window.location.reload();
        }
    });

    var socket = io.connect('http://localhost:3000');

    var username = $("#nickname").attr('value');
    socket.emit('new_user', username);

    socket.on('message', function (data) {
        insertMessage(data.username, data.message);
        $.post('/chat', { username: data.username, message: data.message }, 
        function (data) {
            $('#txtChat').val('').focus();
            return false;
        })
    })

    $("#btnSend").click(function (e) {
        $('#chat_form').submit();
    });

    $('#chat_form').on("submit", function () {
        var message = $('#txtChat').val();
        socket.emit('message', message);
        insertMessage(username, message);
        $.post('/chat', { username: username, message: message }, function (data) {
            $('#txtChat').val('').focus();
            return false;
        })
    });

    function insertMessage(username, message) {
        $('#all_chats').append('<p><strong>' + username + ":" + '</strong> ' + message + '</p>');
    }
});