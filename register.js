const apiURL = "https://66e87262b17821a9d9dcbf14.mockapi.io/users/signup/"
localStorage.setItem("allowance1", "false")

const signUpBtn = document.querySelector(".sign-up-btn")
const signInBtn = document.querySelector(".sign-in-btn")
const usernameContainer = document.querySelector(".username-container")
const mainTitle = document.querySelector(".main-title")
const highlightBtnClass = "highlight-btn"

const username = document.getElementById("username")
const email = document.getElementById("email")
const password = document.getElementById("password")

const usernameWarning = document.getElementById("username-warning")
const emailWarning = document.getElementById("email-warning")
const passwordWarning = document.getElementById("password-warning")
let countSignIn = 0 // Just to not show the warning from the first time user hit the Sign In button

const invalidPopupBox = document.getElementById("invalid-popup-box")
const invalidMessage = document.getElementById("invalid-message")

signUpBtn.onclick = () => {
    usernameContainer.style.maxHeight = "65px"
    usernameContainer.style.padding = "6px 12px"
    mainTitle.innerText = "Sign Up"
    signUpBtn.classList.add(highlightBtnClass)
    signInBtn.classList.remove(highlightBtnClass)

    if (signUpValidation()) {
        signUpUser(url = apiURL, data = {
            "username": username.value,
            "email": email.value,
            "password": password.value
        })
    }

}

signInBtn.onclick = () => {
    usernameWarning.classList.add("hidden")
    usernameContainer.style.maxHeight = "0"
    usernameContainer.style.padding = "0"
    usernameContainer.style.margin = "0"
    mainTitle.innerText = "Sign In"
    signInBtn.classList.add(highlightBtnClass)
    signUpBtn.classList.remove(highlightBtnClass)

    if (countSignIn !== 0 && signInValidation()) {
        signInUser(apiURL)
    }
    countSignIn += 1
}


function signUpValidation() {
    let flag = true
    if (username.value.length < 5) {
        usernameWarning.classList.remove("hidden")
        flag = false
    } else {
        usernameWarning.classList.add("hidden")
    }

    if (!validateEmail(email.value)) {
        emailWarning.classList.remove("hidden")
        flag = false
    } else {
        emailWarning.classList.add("hidden")
    }

    if (password.value.length < 8) {
        passwordWarning.classList.remove("hidden")
        flag = false
    } else {
        passwordWarning.classList.add("hidden")
    }

    return flag
}

function signInValidation() {
    let flag = true

    if (!validateEmail(email.value)) {
        emailWarning.classList.remove("hidden")
        flag = false
    } else {
        emailWarning.classList.add("hidden")
    }

    if (password.value.length < 8) {
        passwordWarning.classList.remove("hidden")
        flag = false
    } else {
        passwordWarning.classList.add("hidden")
    }

    return flag
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        );
}


async function signUpUser(url = "", data = {}) {
    if (await checkUserExists(url, data)) {
        invalidPopupBox.classList.add("visible");
        invalidMessage.innerText = "User already exists";
        setTimeout(() => {
            invalidPopupBox.classList.remove("visible");
        }, 2000);
    } else {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const user = await response.json();
            localStorage.setItem('userId', user.id);
            localStorage.setItem("allowance1", "true")
            window.location.href = "index.html"

        } catch (error) {
            console.error("Error:", error);
        }
    }
}

async function checkUserExists(url = "", user = {}) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const users = await response.json();
        const userIndex = users.findIndex(existingUser => {
            return existingUser.email === user.email || existingUser.username === user.username;
        });

        return userIndex !== -1;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

async function signInUser(url = "") {
    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const users = await response.json();
        const userIndex = users.findIndex(user => {
            return user.email === email.value && user.password === password.value
        })
        if (userIndex + 1) {
            localStorage.setItem('userId', users[userIndex].id);
            localStorage.setItem("allowance1", "true")
            window.location.href = "index.html"
        } else {
            invalidPopupBox.classList.add("visible");
            invalidMessage.innerText = "Invalid email or password";
            setTimeout(() => {
                invalidPopupBox.classList.remove("visible");
            }, 2000);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
