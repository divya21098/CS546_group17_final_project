// const editPostForm = document.getElementById("editPostsForm");
// const newEditPostTitle = document.getElementById("editPostTitle");
// const newEditPostBody = document.getElementById("editPostBody");

// const errorEditPostTitle = document.getElementById("no-edit-post-title");
// const errorEditPostBody = document.getElementById("no-edit-post-body");

// if(editPostForm){
//     editPostForm.addEventListener("submit", (event) =>{
//         if(((newEditPostTitle && newEditPostTitle.value)?newEditPostTitle.value: null) && ((newEditPostBody && newEditPostBody.value)? newEditPostBody.value : null))
//         {
//             console.log((newEditPostBody && newEditPostBody.value)? newEditPostBody.value : null)
//         }
//         else{
//             event.preventDefault();
//             errorEditPostTitle.hidden = newEditPostTitle.value;
//             errorEditPostBody.hidden = newEditPostBody.value;
//         }
//     })
// }

const editPostForm = document.getElementById("editPostsForm");
const newEditPostTitle = document.getElementById("editPostTitle");
const newEditPostBody = document.getElementById("editPostBody");

const errorEditPostTitle = document.getElementById("no-edit-post-title");
const errorEditPostBody = document.getElementById("no-edit-post-body");


//ajax submit post
const url = window.location.href
const [path,queryString]= url.split('?');
const post_id = path.split('/')[5];
const host = window.location.origin


editPostForm.addEventListener("submit", (e) => {
    if (newEditPostTitle.value === "" || newEditPostBody.value === "") {
        e.preventDefault();
        if (newEditPostTitle.value === "") {
            errorEditPostTitle.hidden = newEditPostTitle.value;
        }
        if (newEditPostBody.value === "") {
            errorEditPostBody.hidden = newEditPostBody.value;
        }
    } else {
        e.preventDefault();
        const editPost = new XMLHttpRequest();
        editPost.open("POST", `/posts/edit/${post_id}`);
        editPost.setRequestHeader("Content-Type", "application/json");
        editPost.send(
        JSON.stringify({
            postTitle: newEditPostTitle.value,
            postBody: newEditPostBody.value,
        })
        );
        window.location.href = host + "/posts/" + post_id;

}
}
);