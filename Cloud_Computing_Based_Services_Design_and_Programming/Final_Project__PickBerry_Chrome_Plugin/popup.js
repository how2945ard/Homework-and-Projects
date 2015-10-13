$(".frame .phone").slideUp(0);

$(".link-a:eq(0)").click(function(e){
    $(".link-a").removeClass("active")
    $(".link-a:eq(0)").addClass("active")
    $(".frame .phone").slideUp(100);
});

$(".link-a:eq(1)").click(function(e){
    $(".link-a").removeClass("active")
    $(".link-a:eq(1)").addClass("active")
    $(".frame .phone").slideToggle(100)

});
$(".link-a:eq(2)").click(function(e){
    $(".link-a").removeClass("active")
    $(".link-a:eq(2)").addClass("active")
    $(".frame .phone").slideUp(100);
});


var currenttab;
var booed;
var media;
var userId;
var reasonArr = [];


var mediaPhone =
{
    china: "02-2308-7111",
    et   : "02-5555-6366",
    apple: "0809-012-555",
    ncc  : "0800-201-205"
};


function classify(url){
    media = "no"
    switch(url.split('/')[2])
    {
        case 'www.appledaily.com.tw':
            media = "apple";
            setPhone();
            break;
        case 'www.chinatimes.com':
            media = "china";
            setPhone();
            break;
        case 'www.ettoday.net':
            media = "et";
            setPhone();
            break;
        default:
            console.log('NOT media OR unscrapable!')
            media = "no";
    }
}

function setPhone(){
    var appendMedia;
    var appendPhone;
    switch(media)
    {
        case "apple":
            appendMedia = "蘋果投訴專線";
            appendPhone = mediaPhone.apple;
            break;
        case "china":
            appendMedia = "中天投訴專線";
            appendPhone = mediaPhone.china;
            break;
        case "et":
            appendMedia = "東森投訴專線";
            appendPhone = mediaPhone.et;
            break;
    }


    $('.phone .phone-list').find('.phone-dyma-n').append(appendMedia);
    $('.phone .phone-list').find('.phone-dyma-p').append(appendPhone);
    $('.mail-addr').attr('href','http://localhost:1337/mailer/form?media='+media+'&url='+currenttab);

}


chrome.tabs.query({currentWindow: true, active: true}, function(tabs){

    currenttab = tabs[0].url;
    console.log(currenttab);
    classify(currenttab);
    console.log(media);

    if(media !== "no"){
        console.log("scrape!!!!!")
        $.ajax({
            type: "get",
            url: "http://localhost:1337/google/checklogin",

        }).done(function(data){
            if(!data.Session.access_token){
                console.log("Not login");
                $('.a').html("<a style='position:absolute; bottom:50px; z-index:101;' href="+data.loginUrl+" target='_blank'>FbLogin</a>");

            }
            else{
                $('.load').addClass('load-active');

            }


            var found = []
            exNewsPage(chrome.extension.getBackgroundPage().newsData);
            exReasons(chrome.extension.getBackgroundPage().newsDetail,function(){
                userId = chrome.extension.getBackgroundPage().userid;
                reasonArr.forEach(function(val,index){
                    $.ajax({
                        type:"get",
                        url:"http://localhost:1337/voter/"+val.id
                    }).done(function(data){
                        console.log(data)
                        $(".reason-list").on('click','.'+val.id,function(){
                            found[index] = false
                            val.voters.forEach(function(value,idx){
                                if(value===userId){
                                    val.voters.splice(0,1)
                                    found[index] = true
                                    console.log(val.voters)
                                    console.log('found')
                                }
                            })
                            if(!found[index]){
                                val.voters.push(userId)
                                console.log(val.voters)
                                console.log("not found")
                            }
                            var con
                            if(val.voters.length===0){
                                con = "[]"
                            }
                            else{
                                con = val.voters
                            }
                            console.log(val.voters)
                            $.ajax({
                                type: "put",
                                url: "http://localhost:1337/reason/"+val.id,
                                data:{
                                    voters: con,
                                    vote: val.voters.length
                                }
                            }).done(function(data){
                                    console.log(data)
                            })
                        })
                    })
                })
            });
        })
    }
    else{
        console.log("對不起，這不是新聞頁。");

        $('.newstitle')     .html("對不起，這不是新聞頁。</br>或是我們沒有支援此新聞頁面。");
    }





 })


///////////REASON VOTE/////////////


// $('.reason-vote').on('click','a',function(){
//     console.log('click reason a');

//     $.ajax({
//         type: "get",
//         url: "http://localhost:1337/reasons/vote/:rid/:uid"
//     }).done(function(data){

//     })
// })








$('.submit').on('click', '.cool', function() {
     console.log('click');
      $.ajax({
        type: "post",
        url: "http://localhost:1337/news/addNews",
        data: {uri: currenttab}
    }).done(function(data){
        console.log(data);
        $('.boo-number').html("此新聞已經有 <strong>"+data.news.hot+"</strong> 人說爛");
        $('.cool').remove();
    })

})

$('.boo-icon').on('click', 'i', function() {
     console.log('click');
      $.ajax({
        type: "post",
        url: "http://localhost:1337/news/addNews",
        data: {uri: currenttab}
    }).done(function(data){
        console.log(data);
        if(data.booed){
            $('.boo-icon i').removeClass("fa-thumbs-o-down");
            $('.boo-icon i').addClass("fa-thumbs-down");


        }
        $('.boo-number').html("此新聞已經有 <strong>"+data.news.hot+"</strong> 人說爛");    })

})



function verifyBoo(data){


    var newsid;

    console.log("IN!"+currenttab);
    // GET NEWS ID
    $.ajax({
        type: "post",
        url: "http://localhost:1337/boo/getNewsId",
        data: {newsurl: currenttab}
    }).done(function(data){
        console.log("FUCK!");
        console.log(data);
        newsid = data.newsid;
    });

    $.ajax({
        type: "post",
        url: "http://localhost:1337/google/boo",
        data: {userid: data.Session.user, newsid: newsid}//要找到NEWSID

    }).done(function(data){ //  傳回BOOL值
        console.log(data);
        if(data.booed){
            console.log("booed!");
        }
        else{
            console.log("UNbooed!")
        }
    })
}



function exNewsPage(data){
    $(".load").removeClass('load-active');
    if(data.scrape === false){
        console.log("對不起，這不是新聞頁。")

        $('.newstitle')     .text("對不起，這不是新聞頁。");
    }
    else{
        $('.boo-icon').html("<i class='fa fa-thumbs-o-down'></i>")
        $('.newstitle')     .text(data.newsTitle);
        $('.reason-stat').text("為什麼這個新聞不好？")


        //$('.newscontent') .find('p').text(data.newsContent);
        //$('.newsurl')       .text("新聞連結： "+data.newsUrl);
        if(data.newsExist == 0)
        {
            $('.boo-number').text("這則新聞還沒被批評過。");
            
        }else{
            console.log(data)
            $('.boo-number').html("此新聞已經有 <strong>"+data.newshot+"</strong> 人說爛");
        }
    }


}


function exReasons(data,callback){

    var reasons = data.reasons;
    console.log("AAA")
    console.log(data);
    if(data.reasons)
    {

        $('.reason-stat').text("為什麼這個新聞不好？")
        reasons.forEach(function(reason, idx){



            $.ajax({
                type:"get",
                url:"http://localhost:1337/voter/"+reason.id
            }).done(function(data){

                reasonArr.push({id:reason.id,voters:data.voters});
                if(idx==reasons.length-1){
                    console.log("callback")
                    callback&&callback()
                }
            })
            console.log("con")

            $('.reasons').find('.reason-list').append("<hr>");
            $('.reasons').find('.reason-list').append("<div class='reason-obj'>"+reason.content+"</div>");
            $('.reasons').find('.reason-list')
            .append("<div class='reason-vote'>"+reason.vote+"</div><div class='"+reason.id+" reason-vote'><a href='#'>同意！</a><div>")

        })
    }
    else{
        console.log("no reason");
    }

}


function test(){
    console.log("!!!");
}

