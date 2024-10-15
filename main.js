
// Header

function displayLogOutButton() {
    const logOutButtons = document.querySelectorAll(".log-out-button")
    const registerButtons = document.querySelectorAll(".register-button")

    if (localStorage.getItem("allowance1") === "false" || localStorage.getItem("allowance1") === undefined) {
        logOutButtons.forEach(button => {
            button.style.display = "none"
        });
        registerButtons.forEach(button => {
            button.style.display = "inline-block"
        });
    } else {
        logOutButtons.forEach(button => {
            button.style.display = "inline-block"
        });
        registerButtons.forEach(button => {
            button.style.display = "none"
        });
    }

    logOutButtons.forEach(button => {
        button.addEventListener("click", () => {
            localStorage.setItem("allowance1", "false")
            window.location.reload()
        })
    })
}

function displayMobilNavbar() {
    const mobileNavbarListContainer = document.getElementById("mobile-navbar-list-container");
    const hamburgerMenuContainer = document.getElementById("hamburger-menu-container");
    hamburgerMenuContainer.addEventListener("click", () => {
        mobileNavbarListContainer.classList.toggle("none")
    });
}

displayMobilNavbar()
displayLogOutButton()