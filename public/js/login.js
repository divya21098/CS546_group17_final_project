const newLoginForm = document.getElementById("loginForm");
const newLoginEmail = document.getElementById("emailId");
const newLoginPassword = document.getElementById("password");

const errorLoginEmail = document.getElementById("no-email");
const errorLoginPassword = document.getElementById("no-password");

if(newLoginForm) {

    newLoginForm.addEventListener("submit", (event) => {
        
        if (newLoginEmail.value && newLoginPassword.value) {
            errorLoginEmail.hidden = true;
            errorLoginPassword.hidden = true;
            loginForm.submit();
        } else {
            event.preventDefault();
            errorLoginEmail.hidden = newLoginEmail.value;
            errorLoginPassword.hidden = newLoginPassword.value;
            errorList.hidden = true;
            
        }
    })
}

