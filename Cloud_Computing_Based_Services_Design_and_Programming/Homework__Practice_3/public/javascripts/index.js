(function(){


// 插入 <ul> 之 <li> 樣板
var tmpl = '<li><input type="text" placeholder="New task"><span></span></li>',
    addButton = $('#add'),
    connected = $('.connected'), // 三個 <ul>
    placeholder = $('#placeholder'), // 三個 <ul> 的容器
    mainUl = $('.main'), // main <ul>
    deleteUl = $('.delete'), // delete <ul>
    ul = $('ul'),
    start,
    end,
    deleted,
    doneUl = $('.done'); // done <ul>

load();
addButton.on('click', function(){
  $(tmpl).prependTo(mainUl).addClass('is-editing').find('input').focus()
});

ul.on('keyup','input',function(e){
  if(e.which===13&&$(this).val()){
    $(this).parents('li').find('span').text($(this).val())
    $(this).val()
    $(this).parents('li').removeClass('is-editing')
    var text = JSON.stringify({"done": $(this).parent("li").hasClass("is-done"), "text":$(this).val()})
    $.ajax({
      url: '/items',
      type: 'POST',
      data: text,
      dataType: 'json',
      contentType: 'application/json',
      success: function(data){
        console.log(data)
      }
    });
  }
});

mainUl.sortable({ tolerance: "pointer" ,connectWith : '.done , .delete' });
doneUl.sortable();
deleteUl.sortable();

ul.on('sortstart',function(event,ui){
  start = ui.item.index();
  deleted = false
  placeholder.addClass('is-dragging')
});

ul.on('sortstop',function(event,ui){
  end = ui.item.index()
  console.log(deleted)
  if(end!=start&&!deleted){
    $.ajax({
      url: '/items/'+start+'/reposition/'+end,
      type: 'put',
      data: JSON.stringify({"done": $(this).parent("li").hasClass("is-done"), "text":$(this).text()}),
      dataType: 'json',
      contentType: 'application/json',
      success: function(data){
        placeholder.removeClass('is-dragging')
        console.log(data)
      }
    });
  }
});

doneUl.on('sortreceive',function(event,ui){
  ui.item.addClass('is-done')
  ui.item.appendTo('.main')
  $.ajax({
    url: '/items/'+start,
    type: 'put',
    data: JSON.stringify({"done": $(this).parent("li").hasClass("is-done"), "text":$(this).text()}),
    dataType: 'json',
    contentType: 'application/json',
    success: function(data){
      console.log(data)
    }
  });
});


deleteUl.on('sortreceive',function(event,ui){
  deleted = true
  console.log(deleted)
  $.ajax({
    url: '/items/'+start,
    type: 'delete',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data){
      console.log(data)
      ui.item.remove()
    }
  });
});

function load(){
  $.ajax({
    url: '/items',
    type: 'get',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data){
      var arr =  data,i;
      console.log(data)
      for(i=arr.length-1; i>=0; i-=1){
        var lin = $(tmpl).prependTo(mainUl)
        lin.find('span').text(arr[i].text)
        if(arr[i].done){
         lin.addClass('is-done')
        }
      }
    }
  });
}
}());