const editForm = document.getElementsByClassName("edit-form");
const newFirstName = document.getElementById("editFirstName");
const newLastName = document.getElementById("editLastName");
const newEmail = document.getElementById("editEmailId");
// const newPassword = document.getElementById("password");
const newAge = document.getElementById("editAge");
const newPhoneNumber = document.getElementById("editPhoneNumber");
const newGender = document.getElementById("editGender");
const newNationality = document.getElementById("editNationality");
const newAboutMe = document.getElementById("editAboutMe");

const errorFirstName = document.getElementById("no-edit-first-name");
const errorLastName = document.getElementById("no-edit-last-name");
const errorEmail = document.getElementById("no-edit-email");
// const errorPassword = document.getElementById("no-password");
const errorAge = document.getElementById("no-edit-age");
const errorPhoneNumber = document.getElementById("no-edit-phone");
const errorGender = document.getElementById("no-edit-gender");
const errorNationality = document.getElementById("no-edit-nationality");
const errorAboutMe = document.getElementById("no-edit-aboutme");

const emailRegex = /^[A-Za-z0-9._%+-]+@stevens\.edu$/;
//const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

if(editForm){
    editForm.addEventListener("submit", (event) =>{
        event.preventDefault();
        if(newFirstName.value && newLastName.value && newEmail.value && newAge.value && newPhoneNumber.value && newGender.value && newNationality.value && newAboutMe.value && emailRegex.test(newEmail.value)){
            event.preventDefault();
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
            errorEmail.hidden = newEmail.value;
            
            errorAge.hidden = newAge.value;
            errorPhoneNumber.hidden = newPhoneNumber.value;
            errorNationality.hidden = newNationality.value;
            errorGender.hidden = newGender.value;
            errorAboutMe.hidden = newAboutMe.value;
        }
    })
}