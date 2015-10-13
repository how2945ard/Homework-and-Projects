
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , fs = require('fs');
var app = module.exports = express.createServer();
var file = "./todoItems.json";


// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/items',function(req,res){
  fs.readFile(file,function(err, data){
    res.send(data)
  })
})

app.post('/items',function(req,res){
  fs.readFile(file,function(err, data){
    var arr = JSON.parse(data)
    arr.unshift(req.body)
    fs.writeFile(file,JSON.stringify(arr),function(err, data){
      if (err) throw err;
      res.send(JSON.stringify(arr));
    });
  })
});

app.put('/items/:id',function(req,res){
  fs.readFile(file,function(err, data){
    var arr = JSON.parse(data)
    arr[req.params.id].done = true
    fs.writeFile(file,JSON.stringify(arr),function(err, data){
      if (err) throw err;
      res.send(JSON.stringify(arr));
    });
  })
});

app.put('/items/:old/reposition/:new',function(req,res){
  fs.readFile(file,function(err, data){
    var arr = JSON.parse(data)
    var item = arr.splice(req.params.old,1)
    arr.splice(req.params.new,0,item[0])
    fs.writeFile(file,JSON.stringify(arr),function(err, data){
      if (err) throw err;
      res.send(JSON.stringify(arr));
    });
  })
});

app.delete('/items/:id',function(req,res){
  fs.readFile(file,function(err, data){
    var arr = JSON.parse(data)
    arr.splice(req.params.id,1)
    fs.writeFile(file,JSON.stringify(arr),function(err, data){
      if (err) throw err;
      res.send(JSON.stringify(arr));
    });
  })
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});



// function save(){
//   // 準備好要裝各個項目的空陣列
//   var arr = []
//     // 對於每個 li，
//   // 把 <span> 裡的文字放進陣列裡
//   ul.find('span').each(function(){
//     arr.push({"done": $(this).parent("li").hasClass("is-done"), "text":$(this).text()});
//   });

//   // 把陣列轉成 JSON 字串後存進 localStorage
//   localStorage.todoItems = JSON.stringify(arr);
// }

// // 從 localStorage 讀出整個表，放進 <ul>
// function load(){
// // 從 localStorage 裡讀出陣列 JSON 字串
//   // 把 JSON 字串轉回陣列
//   var arr = json.parse( localstorage.todoitems ),i;
//   // 對於陣列裡的每一個項目，插入回 ul 裡。
//   for(i=0; i<arr.length; i+=1){
//     var lin = $(tmpl).prependTo(mainUl)
//     lin.find('span').text(arr[i].text)
//     if(arr[i].done){
//      lin.addClass('is-done')
//     }
//   }
// }