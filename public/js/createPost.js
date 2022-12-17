const postForm = document.getElementById("posts-form");
const newPostTitle = document.getElementById("postTitle");
const newPostBody = document.getElementById("postBody");

const errorPostTitle = document.getElementById("no-post-title");
const errorPostBody = document.getElementById("no-post-body");

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