function teacherModal(lessonId, lessonName) {

    if (lessonName !== null)
        localStorage.setItem("lessonName", lessonName);
    else
        lessonName = localStorage.getItem("lessonName");

    const modal = document.getElementById("teacher-modal-body");
    modal.innerHTML = "";

    const table = document.createElement("table");
    table.classList.add("table");
    table.classList.add("table-hover");

    const tableBody = document.createElement("tbody");

    document.getElementById("teacher-modal-title").innerHTML = lessonName;

    const teacherList = []

    const pathVariables = {};
    pathVariables["lessonId"] = lessonId;

    const req = request("lesson/teacher", "GET", null, null, pathVariables);
    req.onload = function () {
        if (req.status === 200) {

            const teachers = JSON.parse(req.responseText);
            for (let i in teachers)
                if (teachers.hasOwnProperty(i)) {

                    teacherList.push(teachers[i]["id"])

                    const row = document.createElement("tr");

                    const nameCell = document.createElement("td");
                    nameCell.textContent = teachers[i]["name"];
                    row.appendChild(nameCell);

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Sil";
                    deleteButton.type = "button";
                    deleteButton.classList.add("btn");
                    deleteButton.classList.add("btn-danger");
                    deleteButton.onclick = function () {
                        removeTeacherFromLesson(lessonId, teachers[i]["id"]);
                    }

                    const processCell = document.createElement("td");
                    processCell.appendChild(deleteButton);
                    row.appendChild(processCell);

                    tableBody.appendChild(row);
                }

            if (table.hasChildNodes())
                table.firstChild.remove();

            table.appendChild(tableBody);

            modal.appendChild(table);
        }
    }

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.classList.add("input");
    searchInput.classList.add("search");
    searchInput.placeholder = "Öğretmen Arama (İsim, E-Posta)";
    modal.appendChild(searchInput);
    searchInput.onkeyup = function (event) {

        if (event.key === "Enter") {

            const pathVariables = {};
            pathVariables["query"] = searchInput.value;

            const req = request("teacher", "GET", null, null, pathVariables);
            req.onload = function () {

                if (req.status === 200) {
                    const teachers = JSON.parse(this.responseText);

                    for (let i in teachers)
                        if (teachers.hasOwnProperty(i)) {

                            if (teacherList.indexOf(teachers[i]["id"]) !== -1)
                                continue;

                            const row = document.createElement("tr");

                            const nameCell = document.createElement("td");
                            nameCell.textContent = teachers[i]["name"];
                            row.appendChild(nameCell);

                            const deleteButton = document.createElement("button");
                            deleteButton.textContent = "Ekle";
                            deleteButton.type = "button";
                            deleteButton.classList.add("btn");
                            deleteButton.classList.add("btn-success");
                            deleteButton.onclick = function () {
                                deleteButton.innerHTML = loading();
                                addTeacherToLesson(lessonId, teachers[i]["id"]);
                            }

                            const processCell = document.createElement("td");
                            processCell.appendChild(deleteButton);
                            row.appendChild(processCell);

                            tableBody.appendChild(row);
                        }

                    if (table.hasChildNodes())
                        table.firstChild.remove();

                    table.appendChild(tableBody);
                }
            }
        }
    }
}

function addTeacherToLesson(lessonId, teacherId) {

    const data = new FormData();
    data.append("lessonId", lessonId);
    data.append("teacherId", teacherId);

    const req = request("lesson/teacher", "PUT", null, data, null);
    req.onload = function () {
        if (req.status === 204)
            teacherModal(lessonId, null);
    }
}

function removeTeacherFromLesson(lessonId, teacherId) {

    const data = new FormData();
    data.append("lessonId", lessonId);
    data.append("teacherId", teacherId);

    const req = request("lesson/teacher", "DELETE", null, data, null);
    req.onload = function () {
        if (req.status === 204)
            teacherModal(lessonId, null);
    }
}