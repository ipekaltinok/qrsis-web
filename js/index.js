window.onload = function () {
    checkUser("index");
}

function menu() {

    const userType = localStorage.getItem("userType");
    if (userType === "student") {

        document.getElementById("my-lessons-student").hidden = false;

    } else if (userType === "teacher") {

        document.getElementById("my-lessons-teacher").hidden = false;

        if (localStorage.getItem("userRoles").includes("ADMIN")) {
            document.getElementById("student-operation").hidden = false;
            document.getElementById("teacher-operation").hidden = false;
            document.getElementById("lesson-operation").hidden = false;
        }
    }
}