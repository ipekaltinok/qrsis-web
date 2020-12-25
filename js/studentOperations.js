window.onload = function () {
    checkUser("student-operations");

    const search = document.getElementById("search");
    search.onkeyup = function (event) {
        if (event.key === "Enter")
            findStudent();
    }
}

function findStudent() {

    const table = document.getElementById("student-table");

    const pathVariables = {};
    pathVariables["query"] = document.getElementById("search").value;

    const req = request("student", "GET", null, null, pathVariables);
    req.onload = function () {
        if (this.status === 200) {

            const students = JSON.parse(this.responseText);

            const tableBody = document.createElement("tbody");

            for (let i in students)
                if (students.hasOwnProperty(i)) {

                    const row = document.createElement("tr");

                    const studentNumberCell = document.createElement("td");
                    studentNumberCell.textContent = students[i]["studentNumber"];
                    row.appendChild(studentNumberCell);

                    const nameCell = document.createElement("td");
                    nameCell.textContent = students[i]["name"];
                    nameCell.onclick = function () {
                        updatableTable(nameCell, "student", "name", students[i]["id"]);
                    }
                    row.appendChild(nameCell);

                    const emailCell = document.createElement("td");
                    emailCell.textContent = students[i]["email"];
                    emailCell.onclick = function () {
                        updatableTable(emailCell, "student", "email", students[i]["id"]);
                    }
                    row.appendChild(emailCell);

                    const processCell = document.createElement("td");

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Sil";
                    deleteButton.type = "button";
                    deleteButton.classList.add("btn");
                    deleteButton.classList.add("btn-danger");
                    deleteButton.onclick = function () {
                        deleteButton.innerHTML = loading();
                        deleteStudent(students[i]["id"], row);
                    }
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

function createStudent() {

    const studentNumber = document.getElementById("student-number").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (studentNumber === "" || name === "" || email === "" || password === "") {
        error("Öğrenci Numarası, İsim, E-Posta ve Şifre alanları zorunlu");
        return;
    }

    const body = JSON.stringify({
        "name": name,
        "studentNumber": studentNumber,
        "password": password,
        "email": email
    });

    const headers = {};
    headers["Content-Type"] = "application/json";

    document.getElementById("modal-button").innerHTML = loading();

    const req = request("student", "POST", headers, body, null);
    req.onload = function () {
        if (req.status === 201) {

            document.getElementById("search").value = studentNumber;
            findStudent();

        } else {
            const response = JSON.parse(this.responseText);
            error(response["message"]);
        }

        document.getElementById("modal-button").innerHTML = "Yeni Öğrenci";
    }
}

function deleteStudent(id, row) {

    const data = new FormData();
    data.append("id", id);

    const req = request("student", "DELETE", null, data, null);
    req.onload = function () {
        if (req.status === 204) {
            const table = row.parentNode.parentNode;
            row.remove();
            checkTable(table);
        }
    }
}

function updateStudent(id, field, value) {

    const data = new FormData();
    data.append("id", id);
    data.append(field, value);

    const req = request("student", "PUT", null, data, null);
    req.onload = function () {
        if (req.status !== 204) {
            const response = JSON.parse(this.responseText);
            error(response["message"]);
        }

        findStudent();
    }
}