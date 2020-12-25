window.onload = function () {
    checkUser("my-lessons-teacher");

    findMyLessons();
}

function findMyLessons() {

    const table = document.getElementById("lesson-table");

    let pathVariables = {};
    pathVariables["teacherId"] = localStorage.getItem("userId");

    const req = request("teacher/lesson", "GET", null, null, pathVariables);
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

                    const statisticButton = document.createElement("button");
                    statisticButton.textContent = "İstatistik";
                    statisticButton.type = "button";
                    statisticButton.classList.add("btn");
                    statisticButton.classList.add("btn-primary");
                    statisticButton.setAttribute("data-toggle", "modal");
                    statisticButton.setAttribute("data-target", "#statistic-modal");
                    statisticButton.onclick = function () {
                        statisticOfLesson(lessons[i]["id"], lessons[i]["name"]);
                    }
                    processCell.appendChild(statisticButton);
                    row.appendChild(processCell);

                    const attendanceButton = document.createElement("button");
                    attendanceButton.textContent = "Yoklama Başlat";
                    attendanceButton.type = "button";
                    attendanceButton.classList.add("btn");
                    attendanceButton.classList.add("btn-danger");
                    attendanceButton.setAttribute("data-toggle", "modal");
                    attendanceButton.setAttribute("data-target", "#attendance-modal");
                    attendanceButton.onclick = function () {
                        startAttendance(lessons[i]["id"], lessons[i]["name"]);
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

function statisticOfLesson(lessonId, lessonName) {

    const modal = document.querySelector("#statistic-modal .modal-body");

    document.getElementById("statistic-modal-title").innerText = lessonName;

    let pathVariables = {};
    pathVariables["lessonId"] = lessonId;

    const req = request("attendance/ratio", "GET", null, null, pathVariables);
    req.onload = function () {
        if (req.status === 200) {

            const students = JSON.parse(this.responseText);

            const table = document.createElement("table");
            const tableBody = document.createElement("tbody")
            table.appendChild(tableBody)

            for (let i in students)
                if (students.hasOwnProperty(i)) {

                    const row = document.createElement("tr");

                    const studentIdCell = document.createElement("td");
                    studentIdCell.textContent = students[i]["studentNumber"];
                    row.appendChild(studentIdCell);

                    const nameCell = document.createElement("td");
                    nameCell.textContent = students[i]["name"];
                    row.appendChild(nameCell);

                    const ratioCell = document.createElement("td");
                    ratioCell.textContent = "%" + students[i]["ratio"];
                    row.appendChild(ratioCell);

                    const detailButton = document.createElement("button");
                    detailButton.textContent = "Detay";
                    detailButton.type = "button";
                    detailButton.classList.add("btn");
                    detailButton.classList.add("btn-success");
                    detailButton.setAttribute("data-toggle", "modal");
                    detailButton.setAttribute("data-target", "#student-attendance-modal");
                    detailButton.onclick = function () {
                        findStudentAttendance(lessonId, lessonName, students[i]["name"], students[i]["id"])
                    }

                    const processCell = document.createElement("td");
                    processCell.appendChild(detailButton);
                    row.appendChild(processCell);

                    tableBody.appendChild(row);
                }

            table.appendChild(tableBody);

            modal.innerHTML = "";
            modal.appendChild(table);
        }
    }
}