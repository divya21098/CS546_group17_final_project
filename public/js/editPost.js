const postForm = document.getElementById("edit-posts-form");
const newPostTitle = document.getElementById("editPostTitle");
const newPostBody = document.getElementById("editPostBody");

const errorPostTitle = document.getElementById("no-edit-post-title");
const errorPostBody = document.getElementById("no-edit-post-body");

if(postForm){
    postForm.addEventListener("submit", (event) =>{
        if(newPostTitle.value && newPostBody.value)
        {
            event.preventDefault();
        }
        else{
            event.preventDefault();
            errorPostTitle.hidden = newPostTitle.value;
            errorPostBody.hidden = newPostBody.value;
        }
    })
}