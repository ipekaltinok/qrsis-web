function studentModal(lessonId, lessonName) {

    if (lessonName === null)
        lessonName = localStorage.getItem("lessonName");
    else
        localStorage.setItem("lessonName", lessonName);

    if (lessonId === null)
        lessonId = localStorage.getItem("lessonId");
    else
        localStorage.setItem("lessonId", lessonId);

    const modal = document.getElementById("student-modal-body");
    modal.innerHTML = "";

    const table = document.createElement("table");
    table.classList.add("table");
    table.classList.add("table-hover");

    const tableBody = document.createElement("tbody");

    document.getElementById("student-modal-title").innerHTML = lessonName;

    const studentList = []

    const pathVariables = {};
    pathVariables["lessonId"] = lessonId;

    const req = request("lesson/student", "GET", null, null, pathVariables);
    req.onload = function () {
        if (req.status === 200) {

            const students = JSON.parse(req.responseText);
            for (let i in students)
                if (students.hasOwnProperty(i)) {

                    studentList.push(students[i]["id"])

                    const row = document.createElement("tr");

                    const studentNumberCell = document.createElement("td");
                    studentNumberCell.textContent = students[i]["studentNumber"];
                    row.appendChild(studentNumberCell);

                    const nameCell = document.createElement("td");
                    nameCell.textContent = students[i]["name"];
                    row.appendChild(nameCell);

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Sil";
                    deleteButton.type = "button";
                    deleteButton.classList.add("btn");
                    deleteButton.classList.add("btn-danger");
                    deleteButton.onclick = function () {
                        removeStudentFromLesson(lessonId, students[i]["id"]);
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

            const req = request("student", "GET", null, null, pathVariables);
            req.onload = function () {

                if (req.status === 200) {
                    const students = JSON.parse(this.responseText);

                    for (let i in students)
                        if (students.hasOwnProperty(i)) {

                            if (studentList.indexOf(students[i]["id"]) !== -1)
                                continue;

                            const row = document.createElement("tr");

                            const studentNumberCell = document.createElement("td");
                            studentNumberCell.textContent = students[i]["studentNumber"];
                            row.appendChild(studentNumberCell);

                            const nameCell = document.createElement("td");
                            nameCell.textContent = students[i]["name"];
                            row.appendChild(nameCell);

                            const deleteButton = document.createElement("button");
                            deleteButton.textContent = "Ekle";
                            deleteButton.type = "button";
                            deleteButton.classList.add("btn");
                            deleteButton.classList.add("btn-success");
                            deleteButton.onclick = function () {
                                deleteButton.innerHTML = loading();
                                addStudentToLesson(lessonId, students[i]["id"]);
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

function addStudentToLesson(lessonId, studentId) {

    const data = new FormData();
    data.append("lessonId", lessonId);
    data.append("studentId", studentId);

    const req = request("lesson/student", "PUT", null, data, null);
    req.onload = function () {
        if (req.status === 204)
            studentModal(lessonId, null);
    }
}

function removeStudentFromLesson(lessonId, studentId) {

    const data = new FormData();
    data.append("lessonId", lessonId);
    data.append("studentId", studentId);

    const req = request("lesson/student", "DELETE", null, data, null);
    req.onload = function () {
        if (req.status === 204)
            studentModal(lessonId, null);
    }
}