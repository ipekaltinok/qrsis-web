
function startAttendance(lessonId, lessonName) {

    document.getElementById("attendance-modal-title").textContent = lessonName;

    const attendingStudentsDiv = document.getElementById("attendingStudents");
    const nonAttendingStudentsDiv = document.getElementById("nonAttendingStudents");

    const pathVariables = {};
    pathVariables["lessonId"] = lessonId;

    const req = request("attendance/status", "GET", null, null, pathVariables);
    req.onload = function () {
        if (req.status === 200) {

            const students = JSON.parse(this.responseText);

            const attendingStudents = students["attendingStudents"];
            const nonAttendingStudents = students["nonAttendingStudents"];

            const attendingStudentsTable = document.createElement("table")
            const attendingStudentsTableBody = document.createElement("tbody")
            attendingStudentsTable.appendChild(attendingStudentsTableBody)

            const nonAttendingStudentsTable = document.createElement("table")
            const nonAttendingStudentsTableBody = document.createElement("tbody")
            nonAttendingStudentsTable.appendChild(nonAttendingStudentsTableBody)

            for (let i in attendingStudents)
                if (attendingStudents.hasOwnProperty(i)) {

                    const row = document.createElement("tr");

                    const studentIdCell = document.createElement("td");
                    studentIdCell.textContent = attendingStudents[i]["studentNumber"];
                    row.appendChild(studentIdCell);

                    const nameCell = document.createElement("td");
                    nameCell.textContent = attendingStudents[i]["name"];
                    row.appendChild(nameCell);

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Sil";
                    deleteButton.type = "button";
                    deleteButton.classList.add("btn");
                    deleteButton.classList.add("btn-danger");
                    deleteButton.onclick = function () {

                        deleteButton.innerHTML = loading();

                        deleteStudentAttendance(lessonId, attendingStudents[i]["id"]);
                    }

                    const processCell = document.createElement("td");
                    processCell.appendChild(deleteButton);
                    row.appendChild(processCell);

                    attendingStudentsTableBody.appendChild(row);
                }

            for (let i in nonAttendingStudents)
                if (nonAttendingStudents.hasOwnProperty(i)) {

                    const row = document.createElement("tr");

                    const studentIdCell = document.createElement("td");
                    studentIdCell.textContent = nonAttendingStudents[i]["studentNumber"]
                    row.appendChild(studentIdCell);

                    const nameCell = document.createElement("td");
                    nameCell.textContent = nonAttendingStudents[i]["name"]
                    row.appendChild(nameCell);

                    const addButton = document.createElement("button");
                    addButton.textContent = "Ekle";
                    addButton.type = "button";
                    addButton.classList.add("btn");
                    addButton.classList.add("btn-success");
                    addButton.onclick = function () {

                        addButton.innerHTML = loading();

                        addStudentAttendance(lessonId, nonAttendingStudents[i]["id"]);
                    }

                    const processCell = document.createElement("td");
                    processCell.appendChild(addButton);
                    row.appendChild(processCell);

                    nonAttendingStudentsTableBody.appendChild(row);
                }

            attendingStudentsTable.appendChild(attendingStudentsTableBody);
            nonAttendingStudentsTable.appendChild(nonAttendingStudentsTableBody);

            const attendingStudentsTitle = document.createElement("h4");
            attendingStudentsTitle.textContent = "Katılan Öğrenci Sayısı: " + attendingStudents.length;
            attendingStudentsTitle.classList.add("card-title");

            const nonAttendingStudentsTitle = document.createElement("h4");
            nonAttendingStudentsTitle.textContent = "Katılmayan Öğrenci Sayısı: " + nonAttendingStudents.length;
            nonAttendingStudentsTitle.classList.add("card-title");

            attendingStudentsDiv.innerHTML = "";
            attendingStudentsDiv.appendChild(attendingStudentsTitle);
            attendingStudentsDiv.appendChild(attendingStudentsTable);

            nonAttendingStudentsDiv.innerHTML = "";
            nonAttendingStudentsDiv.appendChild(nonAttendingStudentsTitle);
            nonAttendingStudentsDiv.appendChild(nonAttendingStudentsTable);

            const imageDiv = document.getElementById("image");
            if (imageDiv.children.length === 0) {

                const img = document.createElement("img");
                img.src = rest_host + "attendance?lessonId=" + lessonId;
                img.classList.add("img-fluid");

                imageDiv.innerHTML = "";
                imageDiv.appendChild(img);
            }

            setTimeout(startAttendance, 1000, lessonId, lessonName);
        } else {

            const modal = document.getElementById("attendance-modal");
            modal.classList.remove("show");
            document.getElementsByClassName("modal-backdrop")[0].remove();

            const response = JSON.parse(this.responseText);
            error(response["message"]);
        }
    }
}

function deleteStudentAttendance(lessonId, studentId) {

    const data = new FormData();
    data.append("lessonId", lessonId);
    data.append("studentId", studentId);

    request("student/attendance", "DELETE", null, data, null);
}

function addStudentAttendance(lessonId, studentId) {

    const headers = {};
    headers["Content-Type"] = "application/json";

    const body = JSON.stringify({
        "lessonId": lessonId,
        "studentId": studentId
    });

    request("student/attendance", "POST", headers, body, null);
}