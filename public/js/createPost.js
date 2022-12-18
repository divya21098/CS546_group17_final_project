const postForm = document.getElementById("posts-form");
const newPostTitle = document.getElementById("postTitle");
const newPostBody = document.getElementById("postBody");


const errorPostTitle = document.getElementById("no-post-title");
const errorPostBody = document.getElementById("no-post-body");


// if(postForm){
//     postForm.addEventListener("submit", (event) =>{
//         if(newPostTitle.value && newPostBody.value)
//         {
//             event.preventDefault();
//         }
//         else{
//             event.preventDefault();
//             errorPostTitle.hidden = newPostTitle.value;
//             errorPostBody.hidden = newPostBody.value;
//         }
//     })
// }

const url = window.location.href
const [path,queryString]= url.split('?');
const post_id = path.split('/')[4];
const host = window.location.origin

//|| newPostPhoto === ""
postForm.addEventListener("submit", (e) => {
    if (newPostTitle.value === "" || newPostBody.value === "" ) {
        e.preventDefault();
        if (newPostTitle.value === "") {
            errorPostTitle.hidden = newPostTitle.value;
        }
        if (newPostBody.value === "") {
            errorPostBody.hidden = newPostBody.value;
        }
   
    } else {
        e.preventDefault();
        const createPost = new XMLHttpRequest();
        createPost.open("POST", `/posts/add`);
        createPost.setRequestHeader("Content-Type", "multipart/form-data");
        createPost.send(
        JSON.stringify({
            postTitle: newPostTitle.value,
            postBody: newPostBody.value,
        })
        );
        window.location.href = host + "/posts";

    }
    }
);