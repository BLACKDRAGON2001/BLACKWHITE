function changeText(isSuccessful) {
    const messageBox = document.getElementById("MessageBox");
    if (isSuccessful) {
        messageBox.textContent = "LOGIN SUCCESSFUL";
    } else {
        messageBox.textContent = "LOGIN UNSUCCESSFUL";
    }
}

function clearInputFields() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("MessageBox").textContent = "";
}

// Hardcoded credentials for demonstration
const correctUsername = "Admin";
const correctPassword = "a";
const LoginTimeout = 50 * 60 * 1000; // 50 minutes in milliseconds

function checkLoginStatus() {
    const LoginTime = localStorage.getItem("LoginTime");
    const loginPage = document.getElementById("LoginPage");
    const homePage = document.getElementById("HomePage");

    if (LoginTime) {
        const currentTime = new Date().getTime();
        if (currentTime - parseInt(LoginTime) < LoginTimeout) {
            loginPage.style.display = "none";
            homePage.style.display = "block";
        } else {
            localStorage.removeItem("LoginTime");
            loginPage.style.display = "block";
            homePage.style.display = "none";
            document.body.style.backgroundColor = "white";
        }
    } else {
        loginPage.style.display = "block";
        homePage.style.display = "none";
        document.body.style.backgroundColor = "white";
    }
}

document.getElementById("signinBtn").addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === correctUsername && password === correctPassword) {
        localStorage.setItem("LoginTime", new Date().getTime());
        document.getElementById("LoginPage").style.display = "none";
        clearInputFields();
        changeText(true);
        document.getElementById("HomePage").style.display = "block";
        document.body.style.backgroundColor = "black";
    } else {
        changeText(false);
    }
});

document.addEventListener("DOMContentLoaded", checkLoginStatus);

function refreshPage() {
    location.reload();
}

document.getElementById("title").addEventListener("click", function() {
    document.getElementById("HomePage").style.display = "none";
    document.getElementById("LoginPage").style.display = "block";
    localStorage.removeItem("LoginTime");
    document.body.style.backgroundColor = "white";
    clearInputFields();
    refreshPage();
});