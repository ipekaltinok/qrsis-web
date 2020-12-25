function findStudentAttendance(lessonId, lessonName, studentName, studentId) {

    document.getElementById("lesson-name").innerText = lessonName;

    const studentNameTitle = document.getElementById("student-name");
    if (studentNameTitle != null)
        studentNameTitle.innerText = studentName;

    let pathVariables = {};
    pathVariables["lessonId"] = lessonId;
    pathVariables["studentId"] = studentId;

    const req = request("student/attendance", "GET", null, null, pathVariables);
    req.onload = function () {
        if (req.status === 200) {

            const studentAttendance = JSON.parse(this.responseText);

            const attendanceRatio = studentAttendance["ratio"];
            const attendanceDetails = studentAttendance["details"];

            const attendanceRatioTitle = document.getElementById("attendance-ratio");
            attendanceRatioTitle.textContent = "Katılım Oranı: %" + attendanceRatio;

            const table = document.getElementById("student-attendance");

            const tableBody = document.createElement("tbody");

            for (let i in attendanceDetails)
                if (attendanceDetails.hasOwnProperty(i)) {

                    const starTime = new Date(attendanceDetails[i]["startTime"]);
                    const endTime = new Date(attendanceDetails[i]["endTime"]);

                    const row = document.createElement("tr");

                    const dateInput = document.createElement("input");
                    dateInput.disabled = true;
                    dateInput.type = "date";
                    dateInput.value = starTime.toISOString().substr(0, 10);

                    const dateCell = document.createElement("td");
                    dateCell.appendChild(dateInput);
                    row.appendChild(dateCell);

                    let timeValue;
                    if (starTime.getHours() < 10)
                        timeValue = "0" + starTime.getHours();
                    else
                        timeValue = starTime.getHours();

                    timeValue += ":";

                    if (starTime.getMinutes() < 10)
                        timeValue += "0" + starTime.getMinutes();
                    else
                        timeValue += starTime.getMinutes();

                    const startTimeInput = document.createElement("input");
                    startTimeInput.disabled = true;
                    startTimeInput.type = "time";
                    startTimeInput.value = timeValue;

                    const startTimeCell = document.createElement("td");
                    startTimeCell.appendChild(startTimeInput);
                    row.appendChild(startTimeCell);

                    if (endTime.getHours() < 10)
                        timeValue = "0" + endTime.getHours();
                    else
                        timeValue = endTime.getHours();

                    timeValue += ":";

                    if (endTime.getMinutes() < 10)
                        timeValue += "0" + endTime.getMinutes();
                    else
                        timeValue += endTime.getMinutes();

                    const endTimeInput = document.createElement("input");
                    endTimeInput.disabled = true;
                    endTimeInput.type = "time";
                    endTimeInput.value = timeValue;

                    const endTimeCell = document.createElement("td");
                    endTimeCell.appendChild(endTimeInput);
                    row.appendChild(endTimeCell);

                    const attendanceStatusCell = document.createElement("td");
                    if (attendanceDetails[i]["isAttended"])
                        attendanceStatusCell.innerHTML = check();
                    else
                        attendanceStatusCell.innerHTML = cancel();
                    row.appendChild(attendanceStatusCell);

                    tableBody.appendChild(row);
                }

            table.children[1].remove();
            table.appendChild(tableBody);
            checkTable(table);
        }
    }
}