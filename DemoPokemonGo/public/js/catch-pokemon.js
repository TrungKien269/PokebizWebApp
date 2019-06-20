$(document).ready(function () {
    var showBall = false;
    var showBerry = false;
    var batthanhcong = false;
    var kien = 1;
    var phamtramcongthem = 0; //phầm trăm cộng thêm từ việc cho pokemon ăn

    //nút chạy không bắt pokemon mà reset css của các thẻ về như cữ
    $(".myRun").click(function (e) {
        e.preventDefault();
        $(".main-catch-pokemon").removeClass("show-catch-pokemon");
        $(".background-catch-pokemon").removeClass("show-background");
    });

    //mở list chọn ball
    $(".item-pokeball").click(function (e) {
        e.preventDefault();
        cd = new TimelineMax();
        cd.fromTo($(".item-pokeball,.item-berry"), 0, { opacity: 1 }, { opacity: 0, visibility: "hidden" })
            .fromTo($(".list-pokeball"), 0.5, { left: "100%", opacity: 0 }, { left: "0%", opacity: 1 })
            .call(function () { showBall = true; });
    });

    //mở list chọn berry
    $(".item-berry").click(function (e) {
        e.preventDefault();
        cd = new TimelineMax();
        cd.fromTo($(".item-pokeball,.item-berry"), 0, { opacity: 1 }, { opacity: 0, visibility: "hidden" })
            .fromTo($(".list-berry"), 0.5, { left: "-100%", opacity: 0 }, { left: "0%", opacity: 1 })
            .call(function () { showBerry = true; });
    });


    //chọn loại ball trên img
    $(".list-pokeball li img").click(function (e) {
        e.preventDefault();

        var tenItem = $(this).data('id');
        $(".pokeball").data('id', tenItem);

        //thay doi so luong khi chon item khac
        var soluongBerry = $(".number" + tenItem).text();
        $(".number").text(soluongBerry);

        cd = new TimelineMax();
        cd.call(function () { showBall = false; })
            .fromTo($(".list-pokeball"), 0.5, { left: "0%" }, { left: "100%", opacity: 0 })
            .fromTo($(".item-pokeball,.item-berry"), 0.5, { opacity: 0 }, { opacity: 1, visibility: "visible" })
            .fromTo($(".pokeball img").attr('src', $(this).attr('src')), 0, { opacity: 0 }, { opacity: 1 });
    });

    //chọn loại berry trên img
    $(".list-berry li img").click(function (e) {
        e.preventDefault();

        var tenItem = $(this).data('id');
        $(".pokeball").data('id', tenItem);

        //thay doi so luong khi chon item khac
        var soluongBerry = $(".number" + tenItem).text();
        $(".number").text(soluongBerry);

        cd = new TimelineMax();
        cd.call(function () { showBerry = false; })
            .fromTo($(".list-berry"), 0.5, { left: "0%" }, { left: "-100%", opacity: 0 })
            .fromTo($(".item-pokeball,.item-berry"), 0.5, { opacity: 0 }, { opacity: 1, visibility: "visible" })
            .fromTo($(".pokeball img").attr('src', $(this).attr('src')), 0, { opacity: 0 }, { opacity: 1 });
    });

    // click vào màn hình tắt list ball hoặc berry
    $(".click-event").click(function (e) {
        e.preventDefault();
        if (showBall == true) {
            cd = new TimelineMax();
            cd.call(function () { showBall = false; })
                .fromTo($(".list-pokeball"), 0.5, { left: "0%" }, { left: "100%", opacity: 0 })
                .fromTo($(".item-pokeball,.item-berry"), 0.5, { opacity: 0 }, { opacity: 1, visibility: "visible" })
                .fromTo($(".pokeball img").attr('src', $(this).attr('src')), 0, { opacity: 0 }, { opacity: 1 });
        }
        if (showBerry == true) {
            cd = new TimelineMax();
            cd.call(function () { showBerry = false; })
                .fromTo($(".list-berry"), 0.5, { left: "0%" }, { left: "-100%", opacity: 0 })
                .fromTo($(".item-pokeball,.item-berry"), 0.5, { opacity: 0 }, { opacity: 1, visibility: "visible" })
                .fromTo($(".pokeball img").attr('src', $(this).attr('src')), 0, { opacity: 0 }, { opacity: 1 });
        }
    });

    // nhấn ném ball or berry
    $(".pokeball").click(function (e) {
        e.preventDefault();
        //số lượng vật phẩm 
        var soLuong = $(".number").text();
        soLuong = Number(soLuong.slice(1));
        if (soLuong != 0) {
            //tat item
            TweenMax.to($(".item-pokeball"), 0, { visibility: "hidden" });
            TweenMax.to($(".item-berry"), 0, { visibility: "hidden" });
            //xử lí số lượng khi ném
            TweenMax.to($(".number"), 0, { opacity: 0 });
            soLuong -= 1;
            $(".number").text("x" + soLuong);
            $(".number" + $(".pokeball").data("id")).text("x" + soLuong);
            $(".number" + $(".pokeball").data("id")).val(soLuong);
            var a = 1;

            //xử lí giao diện ném banh
            cd = new TimelineMax();
            cd.stop();
            cd.to($(".pokeball"), 0.5, { bottom: "80%" })
                .to($(".pokemon-catch"), 0.5, { bottom: "90%", left: "50%", opacity: 0, width: 0 })
                .to($(".pokeball"), 0.5, { transform: 'scale(0.7)' })
                .to($(".pokeball"), 1, { bottom: "-50%", ease: Bounce.easeOut, y: -500 })
                .call(batPokemon, [cd]);

            // xử lí giao diện ném barry
            cdBerry = new TimelineMax();
            cdBerry.stop();
            cdBerry.to($(".pokeball"), 0, { opacity: 0 })
                .to($(".like"), 1, { opacity: 1, ease: Elastic.easeOut.config(1, 0.3), y: -10 })
                .to($(".like"), 1, { opacity: 0, y: 10 })
                .call(ketThucNemBanh);
            thoigian = setInterval(function () {
                var b = -((-1 / 100) * a * a + 6 * a);
                var x = -a / 30;
                var y = b;
                var z = -a * 2;
                TweenMax.to($(".pokeball"), 0, { transform: "translate3d(" + x + "px," + y + "px," + z + "px)" })
                a += 2;
                if (z <= -1000) {
                    clearInterval(thoigian);
                    var tenItem = $('.pokeball').data('id');
                    if (tenItem == "ball1" || tenItem == "ball2" || tenItem == "ball3" || tenItem == "ball4") {
                        //nếu là ball
                        cd.play();
                    } else {
                        //nếu là berry
                        cdBerry.play();
                        if (tenItem == "berry1") {
                            phamtramcongthem = 2;
                        }
                        if (tenItem == "berry2") {
                            phamtramcongthem = 4;
                        }
                        if (tenItem == "berry3") {
                            phamtramcongthem = 6;
                        }
                        if (tenItem == "berry4") {
                            phamtramcongthem = 10;
                        }
                    }
                }
            }, 1);
        }
    });

    //ramdom bat pokemon
    function batPokemon(cd) {
        //phần trăm thành công
        var r = Math.floor((Math.random() * 100) + 1);
        console.log(r);
        r += phamtramcongthem;
        console.log(r);
        //reset phan tram cong them
        phamtramcongthem = 0;
        var tenItem = $('.pokeball').data('id');
        if (tenItem == "ball1") {
            r += 2;
        }
        if (tenItem == "ball2") {
            r += 4;
        }
        if (tenItem == "ball3") {
            r += 6;
        }
        if (tenItem == "ball4") {
            r += 10;
        }
        console.log(r);
        if (r > 70) {
            cd.to($(".gotcha"), 0.5, { transform: 'scale(1)', ease: Power2.easeOut, y: -500 })
                .to($(".gotcha"), 1, { opacity: 0 })
                .call(function () { batthanhcong = true; })
                .call(ketThucNemBanh);
        } else {
            cd.to($(".escape"), 0.5, { transform: 'scale(1)', ease: Power2.easeOut, y: -500 })
                .to($(".escape"), 1, { opacity: 0 })
                .call(function () { batthanhcong = false; })
                .call(ketThucNemBanh);
        }
    }

    //kết thúc ném banh thành công hoặc thất bại and reset css
    function ketThucNemBanh() {
        if (batthanhcong == true) {
            $(".main-catch-pokemon").removeClass("show-catch-pokemon");
            $(".background-catch-pokemon").removeClass("show-background");
            $(".list-pokeball").removeAttr('style');
            $(".list-berry").removeAttr('style');
            $(".item-pokeball").removeAttr('style');
            $(".item-berry").removeAttr('style');
            $(".pokeball").removeAttr('style');
            $(".gotcha").removeAttr('style');
            $(".pokemon-catch").removeAttr('style');
            $(".pokeball img").attr("src", "/images/balls/1.png");
            $(".pokeball").data('id', "ball1");
            var Ball1 = Number($(".numberball1").text().slice(1));
            var Ball2 = Number($(".numberball2").text().slice(1));
            var Ball3 = Number($(".numberball3").text().slice(1));
            var Ball4 = Number($(".numberball4").text().slice(1));
            var Berry10 = Number($(".numberberry1").text().slice(1));
            var Berry11 = Number($(".numberberry2").text().slice(1));
            var Berry12 = Number($(".numberberry3").text().slice(1));
            var Berry13 = Number($(".numberberry4").text().slice(1));
            console.log("Ball1: " + Ball1 + '\n' +
                "Ball2: " + Ball2 + '\n' +
                "Ball3: " + Ball3 + '\n' +
                "Ball4: " + Ball4 + '\n' +
                "Berry10:" + Berry10 + '\n' +
                "Berry11: " + Berry11 + '\n' +
                "Berry12: " + Berry12 + '\n' +
                "Berry13: " + Berry13);
            var PokeID = $("#catchPokeID").attr('value');

            $.post('/updateAssets', {
                PokeID: PokeID, Ball1: Ball1,
                Ball2: Ball2, Ball3: Ball3, Ball4: Ball4,
                Berry10: Berry10, Berry11: Berry11,
                Berry12: Berry12, Berry13: Berry13
            }, function (data) {
                alert(data);
            })
            batthanhcong = false;
        }
        else {
            $(".item-pokeball").removeAttr('style');
            $(".item-berry").removeAttr('style');
            $(".pokemon-catch").removeAttr('style');
            $(".pokeball").removeAttr('style');
            $(".escape").removeAttr('style');
            $(".number").removeAttr('style');
        }
    }
});