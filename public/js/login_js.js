

var wait = 60;

function time(o) {

    if (wait == 0) {
        o.value = "发送验证码";
        o.removeAttribute("disabled");
        wait = 60;
    }

    else {
        o.setAttribute("disabled", true);

        o.value = wait + "s";
        wait--;
        setTimeout(function () {
            time(o)
        },
            1000)
    }
}

$(function () {
    $('#login_but').click(function () {
        // alert("hhh");
        let identity = $('#identity').val();
        let user = $('#user').val();
        let psd = $('#psd').val();
        // let Name = $('#name').val();

        $.post('/signin', {
            identity: identity,
            user: user,
            psd: psd
        },
            function (req, res) {
                if (req) {

                    alert(req)
                }
                else {

                    // console.log('127.0.0.1:3000/books');
                    // window.location.replace("https://www.runoob.com");
                    // window.location.href='http://127.0.0.1:3000/books';
                    // alert("???");
                    // location('127.0.0.1:3000/books')
                }
            })
    })


    $('#continue1').click(function () {
        let email = $('#email').val();
        let Password = $('#password').val();
        let vcode = $('#vcode').val();
        let Name = $('#name').val();

        $.post('/signup', {
            EmailNumber: email,
            Name: Name,
            Password: Password,
            vcode: vcode,
        },
            function (req, res) {
                if (req) {
                    alert(req)
                }
                else {
                    window.location.replace("/login");
                }
            })
    })

    $('#LoginAgain').click(function () {
        window.location.replace("/login");
    })
    $('#send_v').click(function () {

        const E_mail = $('#email').val();
        const name = $('#name').val();

        console.log(E_mail)
        const regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        // 判断名称 和邮箱 的格式
        if (name == "") {
            alert("名称不能为空");
            return false;
        }
        if (!(regEmail.test(E_mail))) {
            alert("邮箱输入有误！");
            $('#email').val('');
            $('#email').focus();
            return false;
        }
        time(this);

        const email = E_mail;
        $.get('/email', {
            email: email,
            name: name,
        },
            function (req, res) {
                if (req == "false") {
                    // alert("账号已存在，请找回密码或重新注册");
                    document.getElementById("wrong").style.display = "";
                    document.getElementById("LoginAgain").style.display = "";
                    document.getElementById("send_v").setAttribute("disabled", true);
                    return false;
                } else {
                    req.flash('success_message', '邮件已发送')
                }
            })
    })
})

