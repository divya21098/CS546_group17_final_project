(function ($) {
  var commentForm = $("#comments-form"),
    newComments = $("#comment-area"),
    postId = $("#post_id").val();

  commentForm.submit(function (event) {
    event.preventDefault();
    var comment = $("#commentText").val();
    if (newComments) {
      var requestConfig = {
        method: "POST",
        url: "/comments/" + postId,
        contentType: "application/json",
        data: JSON.stringify({
          commentText: comment,
        }),
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        var newElement = $(responseMessage);
        newComments.append(newElement);
        $("#commentText").val("");
      });
    }
  });
})(window.jQuery);
