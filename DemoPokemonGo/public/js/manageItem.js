$(document).ready(function () {
    TweenMax.staggerFrom($(".card.item"), .4, { top: 100, opacity: 0 }, 0.1)

    $(".editball").click(function (e) {
        ResetParameter();
        var name = $(this).attr('value');
        var type = name.substring(0, 4);
        var id = name.substring(4);
        $.post('/getItem', { type: type, id: id }, function (data) {
            SetBallValue(data[0].name, data[0].InfoBall[0].price, data[0].description, type, id);
            $("#BallID").val(data[0]._id);
        });
    });

    $("#btnSaveBall").click(function (e) {
        $('#frmEditBall').submit();
    });

    $('#frmEditBall').on("submit", function (e){
        var formData = new FormData();

        formData.append("name", $("#txtBallName").val());
        formData.append("id", $("#BallID").val());
        formData.append("type", "ball");
        formData.append("price", $("#txtBallPrice").val());
        formData.append("description", $("#txtBallDescription").val());

        var imageItem = $("#myball").get(0).files[0];
        var idImage = $("#BallID").val();
        if(imageItem != undefined){
            var newfile = new File([imageItem], idImage + "." + imageItem.name.split('.').pop()
        , {type: 'image/png'});
            formData.append("files", newfile);
        }

        $.ajax({
            method: 'POST',
            url: '/editBall',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success:function (data) {
                if(data == "success"){
                    alert("Update successfully");
                    window.location.href = '/manageItems';
                }
                else{
                    alert(data);
                    window.location.href = '/manageItems';
                }
            }   
        });
    });

    $(".edittool").click(function (e) {
        ResetParameter();
        var name = $(this).attr('value');
        var type = name.substring(0, 4);
        var id = name.substring(4);
        $.post('/getItem', { type: type, id: id }, function (data) {
            SetToolValue(data[0].name, data[0].InfoTool[0].price, data[0].description, type, id);
                $("#ToolID").val(data[0]._id);
        });
    });

    $("#btnSaveTool").click(function (e) {
        $('#frmEditTool').submit();
    });

    $('#frmEditTool').on("submit", function (e){
        var formData = new FormData();

        formData.append("name", $("#txtToolName").val());
        formData.append("id", $("#ToolID").val());
        formData.append("type", "tool");
        formData.append("price", $("#txtToolPrice").val());
        formData.append("description", $("#txtToolDescription").val());

        var imageItem = $("#mytool").get(0).files[0];
        var idImage = $("#ToolID").val();
        if(imageItem != undefined){
            var newfile = new File([imageItem], idImage + "." + imageItem.name.split('.').pop()
        , {type: 'image/png'});
            formData.append("files", newfile);
        }

        $.ajax({
            method: 'POST',
            url: '/editTool',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success:function (data) {
                if(data == "success"){
                    window.location.href = '/manageItems';
                    alert("Update successfully");
                }
                else{
                    alert(data);
                    window.location.href = '/manageItems';
                }
            }   
        });
    });

    $(".editball").click(function (e) {
        $("#contentBall").css({
            "display": "block"
        })
        ResetParameter();
    });

    $("#lbBallRemove").click(function (e) {
        $("#contentBall").css({
            "display": "none"
        });
        ResetParameter();
    });

    $(".edittool").click(function (e) {
        $("#contentTool").css({
            "display": "block"
        })
        ResetParameter();
    });

    $("#lbToolRemove").click(function (e) {
        $("#contentTool").css({
            "display": "none"
        });
        ResetParameter();
    });

    $("#myball").change(function(e){
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            var imageItem = this.files[0];
            var newfile = new File([imageItem], $("#ItemID").val(), {type: 'image/png'});
            this.files[0] = newfile;
            reader.onload = function (e) {
                $('#imgBall').attr('src', e.target.result);
            };
            reader.readAsDataURL(newfile);
        }
    })

    $("#mytool").change(function(e){
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            var imageItem = this.files[0];
            var newfile = new File([imageItem], $("#ItemID").val(), {type: 'image/png'});
            this.files[0] = newfile;
            reader.onload = function (e) {
                $('#imgTool').attr('src', e.target.result);
            };
            reader.readAsDataURL(newfile);
        }
    })

    function SetBallValue(name, price, description, type, id) {
        $("#txtBallName").val(name);
        $("#txtBallPrice").val(price);
        $("#txtBallDescription").val(description);
        $("#imgBall").attr('src', "/images/balls/" + id + ".png");
    }

    function SetToolValue(name, price, description, type, id) {
        $("#txtToolName").val(name);
        $("#txtToolPrice").val(price);
        $("#txtToolDescription").val(description);
        $("#imgTool").attr('src', "/images/toolboxes/" + id + ".png");
    }

    function ResetParameter(){
        $("#txtBallName").val("");
        $("#txtBallPrice").val("");
        $("#txtBallDescription").val("");
        $("#txtToolName").val("");
        $("#txtToolPrice").val("");
        $("#txtToolDescription").val("");
        $("#BallID").val("");
        $("#ToolID").val("");
    }
});