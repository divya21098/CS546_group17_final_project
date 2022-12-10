const registrationForm = document.getElementById("registration-form");
const newFirstName = document.getElementById("firstName");
const newLastName = document.getElementById("lastName");
const newEmail = document.getElementById("emailId");
const newPassword = document.getElementById("password");
const newAge = document.getElementById("age");
const newPhoneNumber = document.getElementById("phoneNumber");
const newGender = document.getElementById("gender");
const newNationality = document.getElementById("nationality");
const newAboutMe = document.getElementById("aboutMe");

const errorFirstName = document.getElementById("no-first-name");
const errorLastName = document.getElementById("no-last-name");
const errorEmail = document.getElementById("no-email");
const errorPassword = document.getElementById("no-password");
const errorAge = document.getElementById("no-age");
const errorPhoneNumber = document.getElementById("no-phone");
const errorGender = document.getElementById("no-gender");
const errorNationality = document.getElementById("no-nationality");
const errorAboutMe = document.getElementById("no-aboutme");

const emailRegex = /^[A-Za-z0-9._%+-]+@stevens\.edu$/;
const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

if(registrationForm){
    registrationForm.addEventListener("submit", (event) =>{
        if(newFirstName.value && newLastName.value && newEmail.value && newPassword.value && newAge.value && newPhoneNumber.value && newGender.value && newNationality.value && newAboutMe.value && emailRegex.test(newEmail.value)){
            if(newPassword.value.trim().length < 8 && !passRegex){
                event.preventDefault();
            }
        }
        else{
            event.preventDefault();
            errorFirstName.hidden = newFirstName.value;
            errorLastName.hidden = newLastName.value;
            if(newEmail.value){
                errorEmail.hidden = !emailRegex.test(newEmail.value);
            }
            else{
                errorEmail.hidden = false;
            }

            if(newPassword.value){
                errorPassword.hidden = !passRegex.test(newPassword.value);
            }
            else{
                errorPassword.hidden = false;
            }
            errorAge.hidden = newAge.value;
            errorPhoneNumber.hidden = newPhoneNumber.value;
            errorNationality.hidden = newNationality.value;
            errorGender.hidden = newGender.value;
            errorAboutMe.hidden = newAboutMe.value;
        }
    })
}