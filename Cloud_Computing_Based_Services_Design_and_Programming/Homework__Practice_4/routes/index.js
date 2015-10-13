exports.index = function(req, res){
	var i
	var skip = 0
	var request = require('request')
	var cheerio = require('cheerio')
	var Step = require('step')
	var iconv = require('iconv-lite');
	var S = require('string')
	var category = []
	var fs =require('fs')
	var totalNum = 0
	var conti = true
	res.header("Content-Type", "application/json; charset=utf-8");

	function gettingUrlApple(i,e,callback){
		if(i>=e){
			request.get('http://www.appledaily.com.tw/appledaily/archive/'+i,function (err, body, response){
				console.log('http://www.appledaily.com.tw/appledaily/archive/'+i)
				if (err) {
				}
				else{
					$ =  cheerio.load(response)
					if($(".nclns").length!=0){
						category.push({'date': i,'totalNum':0,'result':[]})
						$(".nclns").each(function(index,element){
							console.log($(this).find('h2').text()+"   "+$(this).find('li').length)
							category[staringDate-i-skip].result.push({"category":$(this).find('h2').text(),"number":$(this).find('li').length})
						})
					}
					else{
						skip+=1
					}
				}
				gettingUrlApple(i-1,e)
			})
		}
		else{
			category.forEach(function(val,idx){
				val.result.forEach(function(value,index){
					val.totalNum += value.number
				})
			})
			fs.writeFile('./appleDaily.json',JSON.stringify(category, null, 4),function(err, data){
				console.log(category)
				console.log("#########################################")
				console.log("#########################################")
				console.log("##################DONE###################")
				console.log("#########################################")
				console.log("#########################################")
				skip = 0
				conti = true
				callback&&callback()
				if(!callback){
					res.send(JSON.stringify(category, null, 4))
				}
				category = []
				routing(4)
			})
		}
	}

	function gettingUrlLibertyTimes(i,c,e,callback){
		var sort = ['politics','society','local','life','opinion','world','business','sports','entertainment','consumer','supplement']
			if(i>=e){
				request.get('http://news.ltn.com.tw/newspaper/'+sort[c]+'/'+i,function (err, body, response){
					console.log('http://news.ltn.com.tw/newspaper/'+sort[c]+'/'+i)
					if(c<=10){
						if (err) {
						}
						else{
							$ =  cheerio.load(response)
							if($(".lipic").length!=0){
								var matchDate = false
								console.log($('div').find('.tit').text())
								var cate = $('div').find('.tit').text()
								category.forEach(function(val,idx){
									if(val.date===i){
										val.result.push({"category":sort[c],"number":parseInt(S(cate).left(16).right(2).s)})
										matchDate = true
									}
								})
								if(!matchDate){
									category.push({'date': i,'totalNum':0,'result':[{"category":sort[c],"number":parseInt(S(cate).left(16).right(2).s)}]})
								}
							}
							gettingUrlLibertyTimes(i,c+1,e)
						}
					}
					else{
						gettingUrlLibertyTimes(i-1,0,e)
					}
				})
			}
		else{
			category.forEach(function(val,idx){
				val.result.forEach(function(value,index){
					val.totalNum += value.number
				})
			})
			fs.writeFile('./libertyTimes.json',JSON.stringify(category, null, 4),function(err, data){
				console.log(category)
				console.log("#########################################")
				console.log("#########################################")
				console.log("##################DONE###################")
				console.log("#########################################")
				console.log("#########################################")
				skip = 0
				conti = true
				callback&&callback()
				if(!callback){
					res.send(JSON.stringify(category, null, 4))
				}
				category = []
				routing(2)
			})
		}
	}

	function gettingUrlTVBS(i,c,e,callback){
		var sort = ['01','02','03','05','06','07','08','11']
		var cate = ['社會','生活','世界','娛樂','兩岸','財經','體壇','政治']
		var date, year, month, day, datetime
		request.get('http://news.tvbs.com.tw/news_cate/'+sort[c]+'/'+i,function (err, body, response){
			console.log('http://news.tvbs.com.tw/news_cate/'+sort[c]+'/'+i)
			if(c<8){
				if (err) {
				}
				else{
					totalNum = 0
					$ =  cheerio.load(response)
					var length = $('.news-categories-list').find('li').length

					$('.news-categories-list').find('li').each(function(index,element){
						console.log($(this).find('h5').text())
						date = S($(this).find('.dateline').text()).left(17).s
						year = S(date).left(4).s
						month = S(date).left(9).right(2).s
						day = S(date).right(5).left(2).s
						datetime = year+month+day
						datetime = parseInt(datetime)
						conti = (datetime >= e)
						if(conti){
							if(category.length===0){
								category.push({'date': datetime,'totalNum':0,'result':[{"category":cate[c],"number":1}]})
							}
							else{
								var matchDate = false
								var matchCate = false
								category.forEach(function(val,idx){
									if(val.date === datetime){
										matchDate = true
										val.result.forEach(function(value,index){
											if(value.category===cate[c]){
												value.number+=1
												matchCate = true
											}
										})
										if(!matchCate){
											val.result.push({"category":cate[c],"number":1})
										}
									}
								})
								if(!matchDate){
									category.push({'date': datetime,'totalNum':0,'result':[{"category":cate[c],"number":1}]})
								}
							}
						}
						if(index===length-1){
							category.forEach(function(val,idx){
							})
							if(conti){
								gettingUrlTVBS(i+1,c,e)
							}
							else{
								gettingUrlTVBS(1,c+1,e)
							}
						}
					})
				}
			}
			else{
				category.forEach(function(val,idx){
					val.result.forEach(function(value,index){
						val.totalNum += value.number
					})
				})
				fs.writeFile('./TVBS.json',JSON.stringify(category, null, 4),function(err, data){
				console.log(category)
				console.log("#########################################")
				console.log("#########################################")
				console.log("##################DONE###################")
				console.log("#########################################")
				console.log("#########################################")
				skip = 0
				conti = true
				callback&&callback()
				if(!callback){
					res.send(JSON.stringify(category, null, 4))
				}
				category = []
				routing(5)
			})
			}
		})
	}

	function gettingUrlTTV(i,c,e,callback){
		var sort = ['A','B','C','D','E','F','G','H','I','J','K','L','M']
		var cate = ['政治','財經','社會','醫藥','科技','娛樂','國際','綜合','消費','體育','休閒','產業','教育']
		var date, year, month, day, datetime
		request.get({uri:'http://www.ttv.com.tw/news/newscontent.asp?newscond='+sort[c]+'&newsday=&page='+i,encoding: null} ,function (err, body, response){
			response = iconv.decode(new Buffer(response), "big5");
			console.log('http://www.ttv.com.tw/news/newscontent.asp?newscond='+sort[c]+'&newsday=&page='+i)
			if(c<13){
				if (err) {
				}
				else{
					totalNum = 0
					$ =  cheerio.load(response)
					var length = $('.NewsHead').find('li').length
					$('.NewsHead').find('li').each(function(index,element){
						date = S($(this).find('.NewsDate').text()).replaceAll('[', '').replaceAll(']', '').s
						console.log(date+"  "+$(this).find('a').text())
						month = S(date).between('/','/').padLeft(2,'0').s
						year = S(date).left(4).s
						day = S(date).right(2).stripPunctuation().padLeft(2,'0').s
						datetime = year+month+day
						datetime = parseInt(datetime)
						conti = (datetime >= e)
						if(conti){
							if(category.length===0){
								category.push({'date': datetime,'totalNum':0,'result':[{"category":cate[c],"number":1}]})
							}
							else{
								var matchDate = false
								var matchCate = false
								category.forEach(function(val,idx){
									if(val.date === datetime){
										matchDate = true
										var temp
										val.result.forEach(function(value,index){
											if(value.category===cate[c]){
												value.number+=1
												matchCate = true
											}
											temp = index
										})
										if(!matchCate){
											val.result.push({"category":cate[c],"number":1})
										}
									}
								})
								if(!matchDate){
									category.push({'date': datetime,'totalNum':0,'result':[{"category":cate[c],"number":1}]})
								}
							}
						}
						if(index===length-1){
							category.forEach(function(val,idx){
							})
							if(conti){
								gettingUrlTTV(i+1,c,e)
							}
							else{
								gettingUrlTTV(1,c+1,e)
							}
						}
					})
				}
			}
			else{
				category.forEach(function(val,idx){
					val.result.forEach(function(value,index){
						val.totalNum += value.number
					})
				})
				fs.writeFile('./TTV.json',JSON.stringify(category, null, 4),function(err, data){
				console.log(category)
				console.log("#########################################")
				console.log("#########################################")
				console.log("##################DONE###################")
				console.log("#########################################")
				console.log("#########################################")
				skip = 0
				conti = true
				callback&&callback()
				if(!callback){
					res.send(JSON.stringify(category, null, 4))
				}
				category = []
			})
			}
		})
	}
	function gettingUrlChinaTimes(i,e,callback){
			if(i>=e){
				var date = i+""
				request.get('http://www.chinatimes.com/history-by-date/'+S(date).left(4)+'-'+S(date).left(6).right(2)+'-'+S(date).right(2)+'-2601?page=1',function (err, body, response){
					console.log('http://www.chinatimes.com/history-by-date/'+S(date).left(4)+'-'+S(date).left(6).right(2)+'-'+S(date).right(2)+'-2601?page=1')
					if (err) {
					}
					else{
						$ =  cheerio.load(response)
						if($(".title_name").length!=0){
							category.push({'date': i,'totalNum':parseInt(S($(".listLeft").find('.clear-fix .on').find('.rwd').next().text()).between('(',')').s),'result':[]})
							skip+=1
							$('.sub_icon').each(function(val,idx){
								var number = S($(this).parent().text()).between('(',')').s
								var cate = S($(this).parent().text()).left(4).replaceAll('《','').s
								category[skip-1].result.push({"category":cate,"number":parseInt(number)})
							})
						}
						gettingUrlChinaTimes(i-1,e)
					}
				})
			}
		else{
			fs.writeFile('./chinaTimes.json',JSON.stringify(category, null, 4),function(err, data){
				console.log(category)
				console.log("#########################################")
				console.log("#########################################")
				console.log("##################DONE###################")
				console.log("#########################################")
				console.log("#########################################")
				skip = 0
				conti = true
				callback&&callback()
				if(!callback){
					res.send(JSON.stringify(category, null, 4))
				}
				category = []
				routing(3)
			})
		}
	}
	var staringDate = 20140526
	var endingDate = 20140501
	function routing(c){
		var staringDate = 20140526
		var endingDate = 20140501
		switch (c){
			case 1:
				gettingUrlLibertyTimes(staringDate,0,endingDate)
				break
			case 2:
				gettingUrlChinaTimes(staringDate,endingDate)
				break
			case 3:
				gettingUrlApple(staringDate,endingDate)
				break
			case 4:
				gettingUrlTVBS(1,0,endingDate)
				break
			case 5:
				gettingUrlTTV(1,0,endingDate)
				break
			default:
				break
		}
	}
	// gettingUrlLibertyTimes(staringDate,0,endingDate)
	// gettingUrlChinaTimes(staringDate,endingDate)
	// gettingUrlApple(staringDate,endingDate)
	// gettingUrlTVBS(1,0,endingDate)
	// gettingUrlTTV(1,0,endingDate)
	routing(1)
};