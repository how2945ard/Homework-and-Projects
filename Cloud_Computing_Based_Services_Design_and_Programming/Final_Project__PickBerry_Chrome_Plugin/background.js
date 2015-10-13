chrome.tabs.onUpdated.addListener(function(){
	onLogin();
	onLoadNews();
})
chrome.tabs.onSelectionChanged.addListener(function(){
	onLogin();
	onLoadNews();
})
chrome.tabs.onActiveChanged.addListener(function(){
	onLogin();
	onLoadNews();
})

var newsData;
var newsDetail; //找不到第三曾
var newsVote; //vote
var userid;

function onLogin(){
	$.ajax({
	    url: "http://localhost:1337/google/checklogin",
	    type: "get"


	}).done(function(data){
		userid = data.Session.user;
		console.log(userid)
	    if(!data.Session.access_token){

	        chrome.browserAction.setIcon({path: 'icon_off.png'})

	    }
	    else{

	    	chrome.browserAction.setIcon({path: 'icon_on.png'})
	    }

	})
}

function onSearch(url){
	$.ajax({
		type: "post",
		url: "http://localhost:1337/google/newsdata",
		data: {url: url}

	}).done(function(data){
		console.log("找到了！資訊如下：")
		console.log(data);
		newsDetail = data;
	})

}

function onLoadNews(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    	newsDetail = [];
    	newsData = [];
        console.log(tabs[0].url);
        $.ajax({
            type: "post",
            url: "http://localhost:1337/google/uri",
            data: {Uri : tabs[0].url},

        }).done(function(data){
            newsData = data;
            if(newsData.newsUrl){
            	console.log("有url，開始找新聞資訊");
            	onSearch(newsData.newsUrl);
            }else{
           		console.log("沒有url")
            }
        });
    });
}

// function onClassify(url){
// 	switch(url){
// 		case
// 	}
// }
