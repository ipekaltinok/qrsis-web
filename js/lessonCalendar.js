function lessonCalendarModal(lessonId, lessonName) {

    if (lessonId === null)
        lessonId = sessionStorage.getItem("lessonId");
    else
        sessionStorage.setItem("lessonId", lessonId);

    if (lessonName === null)
        lessonName = sessionStorage.getItem("lessonName");
    else
        sessionStorage.setItem("lessonName", lessonName);

    document.getElementById("lesson-calendar-modal-title").innerHTML = lessonName;

    const table = document.getElementById("lesson-calendar-table");

    const pathVariable = [];
    pathVariable["lessonId"] = lessonId;

    const req = request("lesson/calendar", "GET", null, null, pathVariable);
    req.onload = function () {
        if (req.status === 200) {

            const lessonCalendars = JSON.parse(req.responseText);

            const tableBody = document.createElement("tbody");

            for (let i in lessonCalendars)
                if (lessonCalendars.hasOwnProperty(i)) {

                    const starTime = new Date(lessonCalendars[i]["startTime"]);
                    const endTime = new Date(lessonCalendars[i]["endTime"]);

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

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Sil";
                    deleteButton.type = "button";
                    deleteButton.classList.add("btn");
                    deleteButton.classList.add("btn-danger");
                    deleteButton.onclick = function () {

                        deleteButton.innerHTML = loading();

                        deleteLessonCalendar(lessonCalendars[i]["id"], row);
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

function emptyLessonCalendar() {

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.min = new Date().toISOString().split('T')[0];

    const dateCell = document.createElement("td");
    dateCell.appendChild(dateInput);

    const startTimeInput = document.createElement("input");
    startTimeInput.type = "time";

    const startTimeCell = document.createElement("td");
    startTimeCell.appendChild(startTimeInput);

    const endTimeInput = document.createElement("input");
    endTimeInput.type = "time";

    const endTimeCell = document.createElement("td");
    endTimeCell.appendChild(endTimeInput);

    const addButton = document.createElement("button");
    addButton.id = "addLessonCalendar";
    addButton.classList.add("btn");
    addButton.classList.add("btn-success");
    addButton.type = "button";
    addButton.textContent = "Ekle";
    addButton.onclick = function () {

        addButton.innerHTML = loading();

        const date = dateInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;

        if (date === "" || startTime === "" || endTime === "") {

            addButton.textContent = "Ekle";

            error("Tarih, Başlangıç zamanı ve Bitiş saati alanları zorunlu");
            return;
        }

        const startDateTime = new Date(date + " " + startTime);
        const endDateTime = new Date(date + " " + endTime);
        const lessonId = sessionStorage.getItem("lessonId");

        if (startDateTime >= endDateTime) {

            addButton.textContent = "Ekle";

            error("Bitiş zamanı başlangıç zamanından küçük olmalı");
            return;
        }

        createLessonCalendar(lessonId, startDateTime, endDateTime);
    }

    const processCell = document.createElement("td");
    processCell.appendChild(addButton);

    const row = document.createElement("tr");
    row.appendChild(dateCell);
    row.appendChild(startTimeCell);
    row.appendChild(endTimeCell);
    row.appendChild(processCell);

    document.querySelector("#lesson-calendar-table tbody").appendChild(row);
}

function deleteLessonCalendar(lessonCalendarId, row) {

    const data = new FormData();
    data.append("id", lessonCalendarId);

    const req = request("lesson/calendar", "DELETE", null, data, null);
    req.onload = function ()  {
        if (req.status === 204) {
            row.remove();
        }
    }
}

function createLessonCalendar(lessonId, startDateTime, endDateTime) {

    const headers = {};
    headers["Content-Type"] = "application/json";

    const body = JSON.stringify({
        "lessonId": lessonId,
        "startTime": startDateTime.toISOString(),
        "endTime": endDateTime.toISOString()
    });

    const req = request("lesson/calendar", "POST", headers, body, null);
    req.onload = function () {
        if (req.status !== 201) {
            const response = JSON.parse(this.responseText);
            error(response["message"]);
        }

        lessonCalendarModal(lessonId, null);
    }
}