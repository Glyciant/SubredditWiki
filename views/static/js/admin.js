$(document).delegate("#approve-button", "click", function() {
  var id = $(this).data("id")
  var id = parseInt(id)

  var postData = {
    id: id
  }

  $.post("/admin/approve", postData, function(data) {
    $("#row-" + id).slideUp()
  })
})

$(document).delegate("#reject-button", "click", function() {
  var id = $(this).data("id")
  var id = parseInt(id)

  var postData = {
    id: id
  }

  $.post("/admin/reject", postData, function(data) {
    $("#row-" + id).slideUp()
  })
})
