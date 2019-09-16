$(function() {
    var top = $('#menu').offset().top - parseFloat($('#menu').css('marginTop').replace(/auto/, 0));
    var footTop = $('#footer').offset().top - parseFloat($('#footer').css('marginTop').replace(/auto/, 0));

    var maxY = footTop - $('#menu').outerHeight();

    $(window).scroll(function(evt) {
        var y = $(this).scrollTop();
        var x = $(this).scrollLeft();
        if (y > top) {
            if (y < maxY) {
                $('#menu').addClass('fixed').removeAttr('style');
            } else {
                $('#menu').removeClass('fixed').css({
                    position: 'absolute',
                    top: (maxY - top) + 'px'
                });
            }
        } else {
            $('#menu').removeClass('fixed');
        }

    });
});

$(function() {
    var top = $('.menu_background').offset().top - parseFloat($('.menu_background').css('marginTop').replace(/auto/, 0));
    var footTop = $('#footer').offset().top - parseFloat($('#footer').css('marginTop').replace(/auto/, 0));
    var maxY = footTop - $('.menu_background').outerHeight();
    $(window).scroll(function(evt) {
        var y = $(this).scrollTop();
        var x = $(this).scrollLeft();
        if (y > top) {
            if (y < maxY) {
                $('.menu_background').addClass('fixed').removeAttr('style');
                $('.a').css("color","white");
                var logo = document.getElementById("logo_im");
                logo.src="images/logo3.png"

            } else {
                $('.menu_background').removeClass('fixed').css({
                    position: 'absolute',
                    top: (maxY - top) + 'px'
                });
            }
        } else {
            $('.menu_background').removeClass('fixed').css({
                height:0
            });
            $('.a').css("color","white");
            var logo = document.getElementById("logo_im")
            logo.src="images/logo3.png"
        }

    });
});