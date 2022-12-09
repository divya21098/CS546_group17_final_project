const loginForm = document.getElementById("login-form");
const newEmail = document.getElementById("emailId");
const newPassword = document.getElementById("password");

const errorEmail = document.getElementById("no-email");
const errorPassword = document.getElementById("no-password");

if(loginForm) {

    loginForm.addEventListener("submit", (event) => {
        
        if (newEmail.value && newPassword.value) {
            errorEmail.hidden = true;
            errorPassword.hidden = true;
            loginForm.submit();
        } else {
            event.preventDefault();
            errorEmail.hidden = newEmail.value;
            errorPassword.hidden = newPassword.value;
            errorList.hidden = true;
            
        }
    })
}

