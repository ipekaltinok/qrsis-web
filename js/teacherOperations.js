window.onload = function () {
    checkUser();

    const search = document.getElementById("search");
    search.onkeyup = function (event) {
        if (event.key === "Enter")
                findTeacher();
    }
}


function createTeacher() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (name === "" || email === "" || password === "") {
        error("İsim, E-posta ve Şifre alanları zorunlu!");
    }

    const body = JSON.stringify({
        "name": name,
        "password": password,
        "email": email
    });

    const headers = {};
    headers["Content-Type"] = "application/json";

    document.getElementById("modal-button").innerHTML = loading();

    const req = request("teacher", "POST", headers, body, null);
    req.onload = function () {
        if (req.status === 201) {
            document.getElementById("search").value = name;
            findTeacher();
        } else {
            const response = JSON.parse(this.responseText);
            error(response["message"]);
        }

        document.getElementById("modal-button").innerHTML = "Yeni Öğretmen";
    }
}

function findTeacher() {

    const table = document.getElementById("teacher-table");

    const pathVariables = {};
    pathVariables["query"] = document.getElementById("search").value;

    const req = request("teacher", "GET", null, null, pathVariables);
    req.onload = function () {
        if (this.status === 200) {

            const teachers = JSON.parse(this.responseText);

            const tableBody = document.createElement("tbody");

            for (let i in teachers)
                if (teachers.hasOwnProperty(i)) {

                    if (teachers[i]["id"] == localStorage.getItem("userId"))
                        continue;

                    const row = document.createElement("tr");

                    const nameCell = document.createElement("td");
                    nameCell.textContent = teachers[i]["name"];
                    nameCell.onclick = function () {
                        updatableTable(nameCell, "teacher", "name", teachers[i]["id"]);
                    }
                    row.appendChild(nameCell);

                    const emailCell = document.createElement("td");
                    emailCell.textContent = teachers[i]["email"];
                    emailCell.onclick = function () {
                        updatableTable(emailCell, "teacher", "email", teachers[i]["id"]);
                    }
                    row.appendChild(emailCell);

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Sil"
                    deleteButton.type = "button";
                    deleteButton.classList.add("btn");
                    deleteButton.classList.add("btn-danger");
                    deleteButton.onclick = function () {
                        deleteButton.innerHTML = loading();
                        deleteTeacher(teachers[i]["id"], row);
                    }

                    const processCell = document.createElement("td");
                    processCell.appendChild(deleteButton);
                    row.appendChild(processCell);

                    tableBody.appendChild(row);
                }

            table.children[1].remove();
            table.appendChild(tableBody);
            checkTable(table);
        }
    }
}

function deleteTeacher(id, row) {

    const data = new FormData();
    data.append("id", id);

    const req = request("teacher", "DELETE", null, data, null);
    req.onload = function () {
        if (req.status === 204) {
            const table = row.parentNode.parentNode;
            row.remove();
            checkTable(table);
        }
    }
}

function updateTeacher(id, field, value) {

    const data = new FormData();
    data.append("id", id);
    data.append(field, value);

    const req = request("teacher", "PUT", null, data, null);
    req.onload = function () {
        if (req.status !== 204) {
            const response = JSON.parse(this.responseText);
            error(response["message"]);
        }

        findTeacher();
    }
}