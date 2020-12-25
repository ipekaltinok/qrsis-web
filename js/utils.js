
const rest_host = "https://qrsis-rest.herokuapp.com/";
// const rest_host = "http://localhost:8080/";

function updatableTable(cell, type, field, id) {

    let text = null;

    if (!cell.innerHTML.includes("input")) {

        text = cell.innerHTML;

        const input = document.createElement("input");
        input.type = "text";
        input.value = text;

        cell.textContent = "";
        cell.appendChild(input);

        cell.firstChild.focus();

        input.onkeyup = function (event) {
            if (event.key === "Enter") {

                const value = cell.firstChild.value;

                cell.innerHTML = loading();

                if (type === "student")
                    updateStudent(id, field, value);
                else if (type === "teacher")
                    updateTeacher(id, field, value);
                else if (type === "lesson")
                    updateLesson(id, field, value);
            }
        }
    }
}

function checkTable(table) {
    table.hidden = !table.children[1].hasChildNodes();
}

function checkUser(location) {

    const userName = document.getElementById("user-name");

    if (location !== "login") {
        const req = request("me", "GET", null, null, null);
        req.onload = function () {

            if (this.status !== 200) {
                window.location = "login.html";
            } else {
                const user = JSON.parse(this.responseText);

                localStorage.setItem("userName", user["name"]);
                localStorage.setItem("userId", user["id"]);
                localStorage.setItem("userRoles", user["roles"]);
                localStorage.setItem("userType", user["userType"]);

                userName.innerHTML = "Hoşgeldin " + user["name"];

                if (location === "index")
                    menu();
            }
        }
    }
}

function logout() {

    const req = request("auth/logout", "GET", null, null, null);
    req.onload = function () {
        if (req.status === 204) {
            localStorage.clear();
            window.location = "login.html";
        }
    }
}

function request(url, method, headers, body, pathVariables) {

    const target = new URL(rest_host + url);
    const params = new URLSearchParams();

    if (pathVariables !== null)
        for (let variable in pathVariables)
            if (pathVariables.hasOwnProperty(variable))
                params.set(variable, pathVariables[variable]);

    target.search = params.toString();

    url = target;

    const req = new XMLHttpRequest();

    req.open(method, url);

    req.setRequestHeader('Access-Control-Allow-Headers', '*');
    req.setRequestHeader('Access-Control-Allow-Origin', '*');
    req.setRequestHeader('Access-Control-Allow-Credentials', 'true');
    req.withCredentials = true;

    if (headers !== null)
        for (let key in headers)
            if (headers.hasOwnProperty(key))
                req.setRequestHeader(key, headers[key]);

    if (body != null)
        req.send(body)
    else
        req.send();

    return req;
}

function loading() {
    return "<div class=\"loader\"></div>";
}

function check() {
    return "<span class='check'>&#10003;</span>";
}

function cancel() {
    return "<span class='cancel'>&#10005;</span>";
}

function error(message) {
    document.getElementById("error-message").innerHTML = message;

    $('#error-modal').modal("show");

    setTimeout(closeError, 3000);
}

function closeError() {
    $('#error-modal').modal("hide");
}