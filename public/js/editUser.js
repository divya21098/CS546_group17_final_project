//const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

// if(editUserForm){
//     editUserForm.addEventListener("submit", (event) =>{
//         event.preventDefault();
//         if(newEditFirstName.value && newEditLastName.value && newEditEmail.value && newEditAge.value && newEditPhoneNumber.value && newEditGender.value && newEditNationality.value && newEditAboutMe.value && emailRegex.test(newEditEmail.value)){
//             event.preventDefault();
//         }
//         else{
//             event.preventDefault();
//             errorEditFirstName.hidden = newEditFirstName.value;
//             errorEditLastName.hidden = newEditLastName.value;
//             if(newEditEmail.value){
//                 errorEditEmail.hidden = !emailRegex.test(newEditEmail.value);
//             }
//             else{
//                 errorEditEmail.hidden = false;
//             }
//             errorEditEmail.hidden = newEditEmail.value;
            
//             errorEditAge.hidden = newEditAge.value;
//             errorEditPhoneNumber.hidden = newEditPhoneNumber.value;
//             errorEditNationality.hidden = newEditNationality.value;
//             errorEditGender.hidden = newEditGender.value;
//             errorEditAboutMe.hidden = newEditAboutMe.value;
//         }
//     })
// }


const editUserForm = document.getElementById("edit-form");
const newEditFirstName = document.getElementById("editFirstName");
const newEditLastName = document.getElementById("editLastName");
const newEditEmail = document.getElementById("editEmailId");
// const newPassword = document.getElementById("password");
const newEditAge = document.getElementById("editAge");
const newEditPhoneNumber = document.getElementById("editPhoneNumber");
const newEditGender = document.getElementById("editGender");
const newEditNationality = document.getElementById("editNationality");
const newEditAboutMe = document.getElementById("editAboutMe");

const errorEditFirstName = document.getElementById("no-edit-first-name");
const errorEditLastName = document.getElementById("no-edit-last-name");
const errorEditEmail = document.getElementById("no-edit-email");
// const errorPassword = document.getElementById("no-password");
const errorEditAge = document.getElementById("no-edit-age");
const errorEditPhoneNumber = document.getElementById("no-edit-phone");
const errorEditGender = document.getElementById("no-edit-gender");
const errorEditNationality = document.getElementById("no-edit-nationality");
const errorEditAboutMe = document.getElementById("no-edit-aboutme");

const emailRegex = /^[A-Za-z0-9._%+-]+@stevens\.edu$/;

const url = window.location.href
const [path,queryString]= url.split('?');
const post_id = path.split('/')[4];
const host = window.location.origin

editUserForm.addEventListener("submit", (e) => {
    if (newEditFirstName.value === "" || newEditLastName.value === "" || newEditEmail.value === "" || newEditAge.value === "" || newEditPhoneNumber.value === "" || newEditGender.value === "" || newEditNationality.value === "" || newEditAboutMe.value === "") {
        e.preventDefault();
        if (newEditFirstName.value === "") {
            errorEditFirstName.hidden = newEditPostTitle.value;
        }
        if (newEditLastName.value === "") {
            errorEditLastName.hidden = newEditLastName.value;
        }
        if (newEditEmail.value === "") {
            errorEditEmail.hidden = newEditEmail.value;
        }
        if (newEditAge.value === "") {
            errorEditAge.hidden = newEditAge.value;
        }
        if (newEditPhoneNumber.value === "") {
            errorEditPhoneNumber.hidden = newEditPhoneNumber.value;
        }
        if (newEditGender.value === "") {
            errorEditGender.hidden = newEditGender.value;
        }
        if (newEditNationality.value === "") {
            errorEditNationality.hidden = newEditNationality.value;
        }
        if (newEditAboutMe.value === "") {
            errorEditAboutMe.hidden = newEditAboutMe.value;
        }
    } else {
        e.preventDefault();
        const editUser = new XMLHttpRequest();
        editUser.open("POST", `/users/editProfile`);
        editUser.setRequestHeader("Content-Type", "application/json");
        editUser.send(
        JSON.stringify({
            firstName: newEditFirstName.value,
            lastName: newEditLastName.value,
            emailId: newEditEmail.value,
            age: newEditAge.value,
            phoneNumber: newEditPhoneNumber.value,
            gender: newEditGender.value,
            nationality: newEditNationality.value,
            aboutMe: newEditAboutMe.value,
        })
        );
        window.location.href = host + "/users/myProfile";

    }
    }
);