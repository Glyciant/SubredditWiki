$(document).ready(function(){
  $("#submit-content").click(function(){
    var title = $("#title").val(),
        link = $("#link").val(),
        body = $("#body").val(),
        approved = false,
        author = $("#author").val(),
        id = Math.floor((Math.random() * 9999999999) + 1000000000);

    $.post('/content/submit', {
      title: title,
      link: link,
      body: body,
      approved: approved,
      version: 1,
      author: author,
      id: id
    });
  });
});
