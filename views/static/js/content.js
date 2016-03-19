$(document).delegate("#upvote", "click", function() {
  var id = $(this).data("id")
  var id = parseInt(id)

  var postData = {
    id: id
  }

  $.post("/content/upvote", postData)
})
