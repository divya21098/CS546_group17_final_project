let form = document.getElementById("comments-form");
let commentInput = document.getElementById("commentText");
let errorDiv = document.getElementById("empty-comment");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!commentInput.value) {
    errorDiv.hidden = false;
    errorDiv.innerHTML = "Comment cannot be empty!";
    errorDiv.focus();
  } else errorDiv.hidden = true;
});
