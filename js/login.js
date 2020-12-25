window.onload = function () {
    checkUser("login");

    const modal = document.getElementById("modal");
}

function login() {

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const base64 = window.btoa(unescape(encodeURIComponent(username + ":" + password)));

    const headers = {};
    headers["Authorization"] = "Basic " + base64;

    const req = request("auth/login", "GET", headers, null, null);
    req.onload = function () {
        if (req.status !== 200)
            error("Kullanıcı adi yada Şifre hatalı!");
         else
            window.location = "index.html";
    }
}