window.onload = function () {
    checkUser("my-lessons-student");

    findMyLessons();
}

function findMyLessons() {

    const table = document.getElementById("lesson-table");

    let pathVariables = {};
    pathVariables["studentId"] = localStorage.getItem("userId");

    const req = request("student/lesson", "GET", null, null, pathVariables);
    req.onload = function () {
        if (req.status === 200) {

            const lessons = JSON.parse(this.responseText);

            const tableBody = document.createElement("tbody");

            for (let i in lessons)
                if (lessons.hasOwnProperty(i)) {

                    const row = document.createElement("tr");

                    const nameCell = document.createElement("td");
                    nameCell.textContent = lessons[i]["name"];
                    row.appendChild(nameCell);

                    const processCell = document.createElement("td");

                    const attendanceButton = document.createElement("button");
                    attendanceButton.textContent = "Devam Durumu";
                    attendanceButton.type = "button";
                    attendanceButton.classList.add("btn");
                    attendanceButton.classList.add("btn-success");
                    attendanceButton.setAttribute("data-toggle", "modal");
                    attendanceButton.setAttribute("data-target", "#student-attendance-modal");
                    attendanceButton.onclick = function () {

                        findStudentAttendance(
                            lessons[i]["id"],
                            lessons[i]["name"],
                            localStorage.getItem("userName"),
                            localStorage.getItem("userId")
                        );
                    }
                    processCell.appendChild(attendanceButton);
                    row.appendChild(processCell);

                    tableBody.appendChild(row);
                }

            table.children[1].remove();
            table.appendChild(tableBody);
            checkTable(table);
        }
    }
}