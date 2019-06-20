$(document).ready(function () {
    $(".nap-pokecoin").click(function (e) {
        e.preventDefault();
        $(".background-che").addClass("hienra");
        var viTriNapPokecoin = $(".nap-pokecoin").offset().top + $(".nap-pokecoin").height();
        console.log(viTriNapPokecoin);
        $(".napcard").css("top", viTriNapPokecoin);
        $(".napcard").addClass("hienra hieuUngNapCard");
    });

    $('#txtCode').bind("cut copy paste", function (e) {
        e.preventDefault();
        // $('#txtCode').bind("contextmenu", function(e) {
        //     e.preventDefault();
        // });
    });

    $(".dong").click(function (e) {
        e.preventDefault();
        $("#txtCode").val("");
        $(".background-che").removeClass("hienra");
        $(".napcard").removeClass("hieuUngNapCard hienra");
    });

    $(".xacnhan").click(function (e) {
        e.preventDefault();

        var cashcard = $("#CashCard").val();
        var currentcash = $("#Pokecoins").text();
        var code = $("#txtCode").val();
        var userid = $("#UserID").text();

        cashcard = cashcard.substring(0, cashcard.length - 2);
        currentcash = parseInt(currentcash) + parseInt(cashcard);
        $("#Pokecoins")[0].childNodes[2].data = currentcash;
        // alert(currentcash)
        // console.log($("#Pokecoins")[0].childNodes[2].data)

        $.post("/buycode", {
            code: code, cash: cashcard, userid: userid,
            currentcash: currentcash
        }, function (data) {
            if (data == "done") {
                alert("Nạp thành công");
            }
            else {
                alert("Nạp không thành công!");
            }
        });

        $("#txtCode").val("");
        $("#CashCard").val("");
        $(".background-che").removeClass("hienra");
        $(".napcard").removeClass("hieuUngNapCard hienra");
    });

    $(".btn-pokecoin").click(function (e) {
        e.preventDefault();
        var tl = new TimelineMax();
        tl.to($(".btn-cart"), 0.4, { css: { scale: 2.5 } })
            .to($(".btn-cart"), 0, { css: { scale: 1 } });
    });

    GetTotal("item-cart");

    $(".item-cart .form-control").on('keyup change', function (e) {
        if (e.target.value == '') {
            e.target.value = 1
        }
        GetTotal("item-cart");
    });

    $(".fa-trash").click(function (e) {
        console.log($(this).attr('id'));
        var userid = $("#UserID").text();
        var div_id = $(this).attr('id').substring(7);
        var div_title = $(this).attr('id').slice(0, 7);
        // console.log(div_title);
        if (div_title == "deltool") {
            $("#itemtool" + div_id).remove();
            GetTotal("item-cart");
            $.post("/removeitem", { id: parseInt($(this).attr('id').slice(7)), type: "tool", userid: userid }, function (data) {
                if (data == "done") {
                    // alert("Done");
                }
            });
        }
        if (div_title == "delball") {
            $("#itemball" + div_id).remove();
            GetTotal("item-cart");
            $.post("/removeitem", { id: parseInt($(this).attr('id').slice(7)), type: "ball", userid: userid }, function (data) {
                if (data == "done") {
                    // alert("Done");
                }
            });
        }
        GetTotal("item-cart");
    });

    $(".btn-pokecoin").click(function (e) {
        var userid = $("#UserID").text();
        var id = $(this).attr('id');
        var subid = id.substring(0, 4);
        id = id.substring(4);
        // console.log($("#stylecart .align-items-center").length);
        // console.log($("#stylecart .align-items-center:eq(0) .form-control").val());

        if (subid == 'ball') {
            $.post("/getitem", { id: parseInt(id), type: subid, userid: userid }, function (data) {
                if (data != null) {
                    // console.log(data[0]);

                    //Add item to cart
                    $("#stylecart").append(
                        '<div class="row item-cart d-flex align-items-center" id="itemball' + data[0]._id + '">' +
                        '<div class="col-3"><img src="/images/balls/' + data[0]._id + '.png" class="img-fluid" alt=""></div>' +
                        '<div class="col-3">' + data[0].name + '</div>' +
                        '<div class="col-3"><input class="form-control" type="number" min="1" value="1" id="example-number-input"></div>' +
                        '<div class="col-2"><div class="donGia"><img src="/images/pokeCoin.png" class="img-fluid" alt="">' + data[0].InfoBall[0].price + '</div></div>' +
                        '<div class="col-1"><i class="fas fa-trash delete" id="delball' + id + '"></i></div>'
                        + '</div>'
                    );

                    // console.log($("#delball" + id));

                    //Remove item to cart
                    $(".fa-trash").click(function (e) {
                        console.log($(this).attr('id'));
                        var userid = $("#UserID").text();
                        var div_id = $(this).attr('id').substring(7);
                        var div_title = $(this).attr('id').slice(0, 7);
                        // console.log(div_title);
                        // console.log($(this).attr('id').slice(7));
                        // alert($(this).attr('id').slice(7));
                        if (div_title == "delball") {
                            $("#itemball" + div_id).remove();
                            GetTotal("item-cart");
                            $.post("/removeitem", { id: parseInt($(this).attr('id').slice(7)), type: "ball", userid: userid }, function (data) {
                                if (data == "done") {
                                    // alert("Done");
                                }
                            });
                        }
                    });
                    GetTotal("item-cart");

                    $(".item-cart .form-control").change(function (e) {
                        GetTotal("item-cart");
                    });
                }
            });
        }
        else {
            $.post("/getitem", { id: parseInt(id), type: subid, userid: userid }, function (data) {
                if (data != null) {
                    // console.log(data[0]);

                    //Add item to cart
                    $("#stylecart").append(
                        '<div class="row item-cart d-flex align-items-center" id="itemtool' + data[0]._id + '">' +
                        '<div class="col-3"><img src="/images/toolboxes/' + data[0]._id + '.png" class="img-fluid" alt=""></div>' +
                        '<div class="col-3">' + data[0].name + '</div>' +
                        '<div class="col-3"><input class="form-control" type="number" min="1" value="1" id="example-number-input"></div>' +
                        '<div class="col-2"><div class="donGia"><img src="/images/pokeCoin.png" class="img-fluid" alt="">' + data[0].InfoTool[0].price + '</div></div>' +
                        '<div class="col-1"><i class="fas fa-trash delete" id="deltool' + id + '"></i></div>'
                        + '</div>'
                    );
                    // console.log($("#deltool" + id));

                    //Remove item to cart
                    $(".fa-trash").click(function (e) {
                        console.log($(this).attr('id'));
                        var userid = $("#UserID").text();
                        var div_id = $(this).attr('id').substring(7);
                        var div_title = $(this).attr('id').slice(0, 7);
                        // console.log(div_title);
                        if (div_title == "deltool") {
                            $("#itemtool" + div_id).remove();
                            GetTotal("item-cart");
                            $.post("/removeitem", { id: parseInt($(this).attr('id').slice(7)), type: "tool", userid: userid }, function (data) {
                                if (data == "done") {
                                    // alert("Done");
                                }
                            });
                        }
                    });

                    GetTotal("item-cart");

                    $(".item-cart .form-control").change(function (e) {
                        GetTotal("item-cart");
                    });
                }
            });
        }
    });

    $(".btn-danger").click(function (e) {
        var text = $(this).text();
        text = text.substring(0, text.length - 3)
        var currentcash = $("#Pokecoins").text();

        $.post("/code", { price: text, cash: currentcash }, function (data) {
            if (data != null) {
                $("#txtCode").val(data._id);
                $("#CashCard").val(data.cash);
            }
        });
    });

    $(".btn-cart").click(function (e) {
        e.preventDefault();
        $(".background-che").addClass("hienra");
        var viTriNapbtnCart_y = $(".btn-cart").offset().top + $(".btn-cart").height();
        var viTriNapbtnCart_x = $(".btn-cart").offset().left;
        console.log(viTriNapbtnCart_x);

        $(".my-cart").css("top", viTriNapbtnCart_y);
        $(".my-cart").css("left", viTriNapbtnCart_x);
        $(".my-cart").addClass("hienra hieuUngCart");
    });

    $(".btn-quayve").click(function (e) {
        e.preventDefault();
        $(".background-che").removeClass("hienra");
        $(".my-cart").removeClass("hieuUngNapCard hienra");
    });

    $(".fa-trash").click(function (e) {
        console.log($(this));
    });

    $(".btn-mua").click(function (e) {
        var total = parseInt($(".tongGia")[0].childNodes[3].data);
        var pokecoins = parseInt($("#Pokecoins")[0].childNodes[2].data);
        var remain = pokecoins - total;

        if (total == 0) {
            alert("Nothing to do transaction!");
        }
        if (total > pokecoins) {
            alert("Not enough Pokecoins for transaction!");
        }
        if (total <= pokecoins) {
            if (confirm("Do you really want to buy all?")) {
                $.post("/begintransaction", function (data) {
                    var trans_id = data;
                    for (var i = 0; i < $(".item-cart").length; i++) {
                        var item_name = $(".item-cart:eq(" + i + ")").attr('id').substring(4);
                        var item_type = item_name.substring(0, 4);
                        var item_id = item_name.slice(4);
                        var quantity = $(".item-cart:eq(" + i + ") .form-control").val();

                        $.post("/buyitem", {
                            id: item_id, type: item_type,
                            trans_id: trans_id, quantity: quantity,
                            price: parseInt($(".item-cart" + ":eq(" + i + ") .donGia").text()),
                            name: $.trim($(".item-cart:eq(" + i + ") .col-3:eq(1)").text())
                        }, function (data) {
                            if (data != 'success') {
                                alert(data);
                            }
                        });
                    }
                    $.post("/updatePokecoins", { remain: remain }, function (data) {
                        if (data != "success") {
                            alert(data);
                        }
                    })
                    alert("Successfully");
                    $("#Pokecoins")[0].childNodes[2].data = remain;
                    $(".tongGia")[0].childNodes[3].data = 0;
                    $(".item-cart").remove();
                    $(".background-che").removeClass("hienra");
                    $(".my-cart").removeClass("hieuUngNapCard hienra");
                });
            }
        }
    });

    function GetTotal(div) {
        var sum = 0;
        for (var i = 0; i < $("." + div).length; i++) {
            // console.log($("." + div + ":eq("+ i +") .donGia").text());
            sum += parseInt($("." + div + ":eq(" + i + ") .donGia").text()) *
                parseInt($("." + div + ":eq(" + i + ") .form-control").val())
        }
        $(".tongGia")[0].childNodes[3].data = sum;
        // console.log($(".tongGia")[0].childNodes[3]);
        // console.log($(".tongGia").find('img').attr('src'))
    }

    $(".search_icon").click(function () {
        // alert($(".search_input").val())
        var name = $(".search_input").val();
        name = CapitalizeWords(name);
        $.post("/search", { name: name }, function (data) {
            console.log(data);
            // console.log(data.Tool.length);
            var ball_length = data.Ball.length;
            var tool_length = data.Tool.length

            $(".card-deck .card").remove();
            var row = parseInt(tool_length / 3) + parseInt(tool_length % 3);
            console.log(row);
            if (ball_length == 0 && tool_length == 0) {
                return;
            }

            if (tool_length > 0) {
                for (var i = 0; i < row - 1; i++) {
                    for (var j = 0; j < (i + 1) * 3; j++) {
                        $("#ShowTool .card-deck:eq(" + i + ")").append(
                            '<div class="card col-sm-4">' +
                            '<img class="card-img-top" src="/images/toolboxes/' + data.Tool[j]._id + '.png" alt="">' +
                            '<p class="card-text">' + data.Tool[j].Toolboxes[0].name + '</p>' +
                            '<div class="btn-pokecoin" id="tool' + data.Tool[j]._id + '">' +
                            '<img src="/images/pokeCoin.png" class="img-fluid" alt="">' +
                            data.Tool[j].price +
                            '</div></div>'
                        );
                    }
                }
                for (var j = (row - 1) * 3; j < tool_length; j++) {
                    $("#ShowTool .card-deck:eq(" + row + ")").append(
                        '<div class="card col-sm-4">' +
                        '<img class="card-img-top" src="/images/toolboxes/' + data.Tool[j]._id + '.png" alt="">' +
                        '<p class="card-text">' + data.Tool[j].Toolboxes[0].name + '</p>' +
                        '<div class="btn-pokecoin" id="tool' + data.Tool[j]._id + '">' +
                        '<img src="/images/pokeCoin.png" class="img-fluid" alt="">' +
                        data.Tool[j].price +
                        '</div></div>'
                    );
                }
            }

            if (ball_length > 0 && ball_length < 4) {
                for (var i = 0; i < 3; i++) {
                    $("#ShowBall .card-deck:eq(0)").append(
                        '<div class="card col-sm-4">' +
                        '<img class="card-img-top" src="/images/balls/' + data.Ball[i]._id + '.png" alt="">' +
                        '<p class="card-text">' + data.Ball[i].Pokeballs[0].name + '</p>' +
                        '<div class="btn-pokecoin" id="ball' + data.Ball[i]._id + '">' +
                        '<img src="/images/pokeCoin.png" class="img-fluid" alt="">' +
                        data.Ball[i].price +
                        '</div></div>'
                    );
                }
            }
            else if (ball_length == 4) {
                for (var i = 0; i < 3; i++) {
                    $("#ShowBall .card-deck:eq(0)").append(
                        '<div class="card col-sm-4">' +
                        '<img class="card-img-top" src="/images/balls/' + data.Ball[i]._id + '.png" alt="">' +
                        '<p class="card-text">' + data.Ball[i].Pokeballs[0].name + '</p>' +
                        '<div class="btn-pokecoin" id="ball' + data.Ball[i]._id + '">' +
                        '<img src="/images/pokeCoin.png" class="img-fluid" alt="">' +
                        data.Ball[i].price +
                        '</div></div>'
                    );
                }
                $("#ShowBall .card-deck:eq(1)").append(
                    '<div class="card col-sm-4">' +
                    '<img class="card-img-top" src="/images/balls/' + data.Ball[3]._id + '.png" alt="">' +
                    '<p class="card-text">' + data.Ball[3].Pokeballs[0].name + '</p>' +
                    '<div class="btn-pokecoin" id="ball' + data.Ball[3]._id + '">' +
                    '<img src="/images/pokeCoin.png" class="img-fluid" alt="">' +
                    data.Ball[3].price +
                    '</div></div>'
                );
            }


            $(".btn-pokecoin").click(AddToCart);
        })
    });

    function AddToCart() {
        var userid = $("#UserID").text();
        var id = $(this).attr('id');
        var subid = id.substring(0, 4);
        id = id.substring(4);
        // console.log($("#stylecart .align-items-center").length);
        // console.log($("#stylecart .align-items-center:eq(0) .form-control").val());

        if (subid == 'ball') {
            $.post("/getitem", { id: parseInt(id), type: subid, userid: userid }, function (data) {
                if (data != null) {
                    // console.log(data[0]);

                    //Add item to cart
                    $("#stylecart").append(
                        '<div class="row item-cart d-flex align-items-center" id="itemball' + data[0]._id + '">' +
                        '<div class="col-3"><img src="/images/balls/' + data[0]._id + '.png" class="img-fluid" alt=""></div>' +
                        '<div class="col-3">' + data[0].name + '</div>' +
                        '<div class="col-3"><input class="form-control" type="number" min="1" value="1" id="example-number-input"></div>' +
                        '<div class="col-2"><div class="donGia"><img src="/images/pokeCoin.png" class="img-fluid" alt="">' + data[0].InfoBall[0].price + '</div></div>' +
                        '<div class="col-1"><i class="fas fa-trash delete" id="delball' + id + '"></i></div>'
                        + '</div>'
                    );

                    // console.log($("#delball" + id));

                    //Remove item to cart
                    $(".fa-trash").click(function (e) {
                        console.log($(this).attr('id'));
                        var userid = $("#UserID").text();
                        var div_id = $(this).attr('id').substring(7);
                        var div_title = $(this).attr('id').slice(0, 7);
                        // console.log(div_title);
                        // console.log($(this).attr('id').slice(7));
                        // alert($(this).attr('id').slice(7));
                        if (div_title == "delball") {
                            $("#itemball" + div_id).remove();
                            GetTotal("item-cart");
                            $.post("/removeitem", { id: parseInt($(this).attr('id').slice(7)), type: "ball", userid: userid }, function (data) {
                                if (data == "done") {
                                    // alert("Done");
                                }
                            });
                        }
                    });
                    GetTotal("item-cart");

                    $(".item-cart .form-control").change(function (e) {
                        GetTotal("item-cart");
                    });
                }
            });
        }
        else {
            $.post("/getitem", { id: parseInt(id), type: subid, userid: userid }, function (data) {
                if (data != null) {
                    // console.log(data[0]);

                    //Add item to cart
                    $("#stylecart").append(
                        '<div class="row item-cart d-flex align-items-center" id="itemtool' + data[0]._id + '">' +
                        '<div class="col-3"><img src="/images/toolboxes/' + data[0]._id + '.png" class="img-fluid" alt=""></div>' +
                        '<div class="col-3">' + data[0].name + '</div>' +
                        '<div class="col-3"><input class="form-control" type="number" min="1" value="1" id="example-number-input"></div>' +
                        '<div class="col-2"><div class="donGia"><img src="/images/pokeCoin.png" class="img-fluid" alt="">' + data[0].InfoTool[0].price + '</div></div>' +
                        '<div class="col-1"><i class="fas fa-trash delete" id="deltool' + id + '"></i></div>'
                        + '</div>'
                    );
                    // console.log($("#deltool" + id));

                    //Remove item to cart
                    $(".fa-trash").click(function (e) {
                        console.log($(this).attr('id'));
                        var userid = $("#UserID").text();
                        var div_id = $(this).attr('id').substring(7);
                        var div_title = $(this).attr('id').slice(0, 7);
                        // console.log(div_title);
                        if (div_title == "deltool") {
                            $("#itemtool" + div_id).remove();
                            GetTotal("item-cart");
                            $.post("/removeitem", { id: parseInt($(this).attr('id').slice(7)), type: "tool", userid: userid }, function (data) {
                                if (data == "done") {
                                    // alert("Done");
                                }
                            });
                        }
                    });

                    GetTotal("item-cart");

                    $(".item-cart .form-control").change(function (e) {
                        GetTotal("item-cart");
                    });
                }
            });
        }
    }

    function CapitalizeWords(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

});