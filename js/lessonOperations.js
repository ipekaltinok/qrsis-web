window.onload = function () {
    checkUser();

    const search = document.getElementById("search");
    search.onkeyup = function (event) {
        if (event.key === "Enter")
            findLesson();
    }
}

function createLesson() {

    const name = document.getElementById("name").value;

    if (name === "") {
        error("İsim alanı zorunlu");
        return;
    }

    const body = JSON.stringify({
        "name": name,
    });

    const headers = {};
    headers["Content-Type"] = "application/json";

    document.getElementById("modal-button").innerHTML = loading();

    const req = request("lesson", "POST", headers, body, null);
    req.onload = function () {
        if (req.status === 201) {
            document.getElementById("search").value = name;
            findLesson();
        } else {
            const response = JSON.parse(this.responseText);
            error(response["message"]);
        }

        document.getElementById("modal-button").innerHTML = "Yeni Ders";
    }
}

function findLesson() {

    const table = document.getElementById("lesson-table");

    const pathVariables = {};
    pathVariables["query"] = document.getElementById("search").value;

    const req = request("lesson", "GET", null, null, pathVariables);
    req.onload = function () {
        if (req.status === 200) {

            const lessons = JSON.parse(req.responseText);

            const tableBody = document.createElement("tbody");

            for (let i in lessons)
                if (lessons.hasOwnProperty(i)) {

                    const row = document.createElement("tr");

                    const nameCell = document.createElement("td");
                    nameCell.textContent = lessons[i]["name"];
                    nameCell.onclick = function () {
                        updatableTable(nameCell, "lesson", "name", lessons[i]["id"]);
                    }
                    row.appendChild(nameCell);

                    const teacherButton = document.createElement("button");
                    teacherButton.textContent = "Öğretmen"
                    teacherButton.type = "button";
                    teacherButton.classList.add("btn");
                    teacherButton.classList.add("btn-primary");
                    teacherButton.setAttribute("data-toggle", "modal");
                    teacherButton.setAttribute("data-target", "#teacher-modal");
                    teacherButton.onclick = function () {
                        teacherModal(lessons[i]['id'], lessons[i]['name']);
                    }

                    const studentButton = document.createElement("button");
                    studentButton.textContent = "Öğrenci"
                    studentButton.type = "button";
                    studentButton.classList.add("btn");
                    studentButton.classList.add("btn-warning");
                    studentButton.setAttribute("data-toggle", "modal");
                    studentButton.setAttribute("data-target", "#student-modal");
                    studentButton.onclick = function () {
                        studentModal(lessons[i]['id'], lessons[i]['name']);
                    }

                    const lessonCalendarButton = document.createElement("button");
                    lessonCalendarButton.textContent = "Ders Takvimi"
                    lessonCalendarButton.type = "button";
                    lessonCalendarButton.classList.add("btn");
                    lessonCalendarButton.classList.add("btn-success");
                    lessonCalendarButton.setAttribute("data-toggle", "modal");
                    lessonCalendarButton.setAttribute("data-target", "#lesson-calendar-modal");
                    lessonCalendarButton.onclick = function () {
                        lessonCalendarModal(lessons[i]['id'], lessons[i]['name']);
                    }

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Sil"
                    deleteButton.type = "button";
                    deleteButton.classList.add("btn");
                    deleteButton.classList.add("btn-danger");
                    deleteButton.onclick = function () {
                        deleteButton.innerHTML = loading();
                        deleteLesson(lessons[i]["id"], row);
                    }

                    const processCell = document.createElement("td");
                    processCell.appendChild(teacherButton);
                    processCell.appendChild(studentButton);
                    processCell.appendChild(lessonCalendarButton);
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

function deleteLesson(id, row) {

    const data = new FormData();
    data.append("id", id);

    const req = request("lesson", "DELETE", null, data, null);
    req.onload = function () {
        if (req.status === 204) {
            const table = row.parentNode.parentNode;
            row.remove();
            checkTable(table);
        }
    }
}

function updateLesson(id, field, value) {

    const data = new FormData();
    data.append("id", id);
    data.append(field, value);

    const req = request("lesson", "PUT", null, data, null);
    req.onload = function () {
        if (req.status === 204) {
            const response = JSON.parse(this.responseText);
            error(response["message"]);
        }

        findLesson();
    }
}