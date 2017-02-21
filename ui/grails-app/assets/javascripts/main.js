if (typeof jQuery !== 'undefined') {
    (function($) {
        refreshUi();
    })(jQuery);
}

var expirationDays = 1;

function fetchAnnouncements() {
    var accessToken = getCookie("accessToken");
    var authorization = 'Bearer ' + accessToken;
    $.ajax({
        url: 'http://localhost:8081/',
        type: 'get',
        headers: {
            "Accept": 'application/json',
            "Authorization": authorization
        },
        success: function (data) {
            console.info(data);
            populateAnnouncements(data);

        },
        error: function (data){
            console.info(data);
        }
    });
}

function populateAnnouncements(data) {
    var html = "";
    for ( var i = 0; i < data.length; i++) {
        var annoucement = data[i];
        html += "<li>" + annoucement.title + "</li>";
    }

    $("#announcements").html(html);
}

function refreshUi() {

    if (cookieExists("accessToken")) {
        $('#logoutForm').show();
        $('#loginForm').hide();

        var username = getCookie("username");
        $('#loggedAs').attr('value', username);
        fetchAnnouncements();

    } else {
        $('#logoutForm').hide();
        $('#loginForm').show();
    }



    $( "#submitLogin" ).click(function() {
        login();
    });

    $( "#logoutForm" ).click(function() {
        logout();
    });
}

function logout() {
    setCookie("accessToken", null, expirationDays);
    setCookie("expiresIn", null, expirationDays);
    setCookie("refreshToken", null, expirationDays);
    setCookie("roles", null, expirationDays);
    setCookie("username", null, expirationDays);

    $('#announcements').html('');

    refreshUi();
}

function login() {
    var username = $('#username').val();
    var password = $('#password').val();

    var jsonData = "{\"username\":\""+username+"\",\"password\":\""+password+"\"}"

    $.ajax({
        url: 'http://localhost:8081/api/login',
        type: 'post',
        data: jsonData,
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        success: function (data) {
            setCookie("accessToken", data.access_token, expirationDays);
            setCookie("expiresIn", data.expiresIn, expirationDays);
            setCookie("refreshToken", data.refresh_token, expirationDays);
            setCookie("roles", data.role, expirationDays);
            setCookie("username", data.username, expirationDays);

            refreshUi();
        },
        error: function (data){
            console.info(data);
        }
    });
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    var cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    console.log(cookie);
    document.cookie = cookie;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function cookieExists(name) {
    var user = getCookie(name);
    console.log("user: " + user);
    if (user != "" && user != null && user != 'null') {
        return true
    }
    return false
}