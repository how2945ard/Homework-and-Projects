(function(){


// 插入 <ul> 之 <li> 樣板
var tmpl = '<li><input type="text" placeholder="New task"><span></span></li>',
    addButton = $('#add'),
    connected = $('.connected'),      // 三個 <ul>
    placeholder = $('#placeholder'),  // 三個 <ul> 的容器
    mainUl = $('.main'),              // main <ul>
    deleteUl = $('.delete'),          // delete <ul>
    ul = $('ul'),
    doneUl = $('.done');              // done <ul>

load();
addButton.on('click', function(){
  $(tmpl).prependTo(mainUl).addClass('is-editing').find('input').focus()
});

ul.on('keyup','input',function(e){
	if(e.which===13){
		$(this).parents('li').find('span').text($(this).val())
		$(this).val()
		$(this).parents('li').removeClass('is-editing')
		save()
	}
});

mainUl.sortable({  tolerance: "pointer" ,connectWith : '.done , .delete' });
doneUl.sortable();
deleteUl.sortable();

ul.on('sortstart',function(){
	placeholder.addClass('is-dragging')
});

ul.on('sortstop',function(){
	placeholder.removeClass('is-dragging')
});

doneUl.on('sortreceive',function(event,ui){
	// var done = '<li><span></span></li>';
	// $(done).prependTo(mainUl).addClass('is-done')
	// $(done).text(+ui.item.find('span').val())
	ui.item.addClass('is-done')
	ui.item.appendTo('.main')
	save();
});
deleteUl.on('sortreceive',function(event,ui){
	ui.item.remove()
	save();
});


function save(){
  // 準備好要裝各個項目的空陣列
  var arr = []
    // 對於每個 li，
  // 把 <span> 裡的文字放進陣列裡
  ul.find('span').each(function(){
	// var d
 //    if($(this).attr('class')===".done"){
 //    	d = true
 //    }
 //    else if(!$(this).attr('class')===".done"){
 //    	d = false
 //    }
    arr.push({"done": $(this).parent("li").hasClass("is-done"), "text":$(this).text()});
  });

  // 把陣列轉成 JSON 字串後存進 localStorage
  localStorage.todoItems = JSON.stringify(arr);

}

// 從 localStorage 讀出整個表，放進 <ul>
function load(){
// 從 localStorage 裡讀出陣列 JSON 字串
  // 把 JSON 字串轉回陣列
  var arr = JSON.parse( localStorage.todoItems ),i;
  // 對於陣列裡的每一個項目，插入回 ul 裡。
  for(i=0; i<arr.length; i+=1){
    var lin = $(tmpl).prependTo(mainUl)
    lin.find('span').text(arr[i].text)
    if(arr[i].done){
    	lin.addClass('is-done')
    }
  }
}
}());