module.exports = {
    attributes:{

    }
    photos :function (photos,res,callback) {
        if(photos!=undefined&&!finish){
            request.get(photos, function (err, body, response) {
                count+=1
                response = JSON.parse(response);
                if(response&&response.data){
                    response.data.forEach(function (val, idx) {
                        if(val.images[2]!=undefined){
                            // data+= carouselMid1+ val.images[2].source+ carouselMid2
                            data += waterfallBody + "<img  src='"+val.images[2].source+"'></div>"
                        }
                    });
                }
                res.write(data)
                data=""
                console.log(count+"  "+photos)
                done = !(response.paging.next!=undefined)
                // if(response.paging!=undefined&&response.paging.next!=undefined){
                do_photos(response.paging.next,res,callback);
            })
        }
        else{
            if(photos===undefined&&!finish&&done){
                // data += carouselEnd
                res.end(data)
                data=""
                finish = true
            }
        }
        return 0
    }
}
var request = require("request");
var oauth = "https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=1408136699459824&client_secret=61c6cde64897ef9ae581a7e323e835f8"
var fanpage
var posts
var photos
var step= require("step")
fanpage = "zora123123"
posts ="https://graph.facebook.com/"+fanpage+"?fields=about,likes,posts"
photos = "https://graph.facebook.com/"+fanpage+"/photos?type=uploaded"
function do_photos (photos,res,callback) {
    if(photos!=undefined&&!finish){
        request.get(photos, function (err, body, response) {
            count+=1
            response = JSON.parse(response);
            if(response&&response.data){
                response.data.forEach(function (val, idx) {
                    if(val.images[2]!=undefined){
                        // data+= carouselMid1+ val.images[2].source+ carouselMid2
                        data += waterfallBody + "<img  src='"+val.images[2].source+"'></div>"
                    }
                });
            }
            res.write(data)
            data=""
            console.log(count+"  "+photos)
            done = !(response.paging.next!=undefined)
            // if(response.paging!=undefined&&response.paging.next!=undefined){
            do_photos(response.paging.next,res,callback);
        })
    }
    else{
        if(photos===undefined&&!finish&&done){
            // data += carouselEnd
            res.end(data)
            data=""
            finish = true
        }
    }
    return 0
}