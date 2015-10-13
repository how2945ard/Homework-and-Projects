/**
 * ReasonController
 *
 * @description :: Server-side logic for managing reasons
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var request = require('request')

module.exports = {

	//丟REASON 的 ID進來 然後 在REASON裡面找VOTER這個ARRAY，然後在VOTER檢查有沒有USERID
 	vote: function(req,res){
 		var reasonid = req.param('rid'); //REASON的ID
 		 var userid = req.param('uid'); // USER's ID

 		Reason.findOne({id: reasonid})
 		.exec(function(err, data){ //GET a reason type data
 			//if find reason data (reason exist)
 			if(data)
 			{
				if(data.voters.length == 0){ //VOTER NULL
					var voters = []
					voters.push(userid)
					// data.voters.add(userid); //推入USERID
					console.log("0->1");
					// request(
					//     { method: 'PUT'
					//     , uri: 'http://localhost:1337/reason/'+reasonid
					//     , body: {voters: data.voters, vote: data.voters.length}
					//     }
					//   , function (error, response, body) {
					// 	    console.log('saved')
					// 		res.send({
					// 			reasons: true,
					// 			votedNum: data.voters.length
					// 		})
					// 	}
					// )
					request.put('http://localhost:1337/reason/'+reasonid,{voters: data.voters, vote: data.voters.length}, function (error, response, body) {
						    console.log('saved')
							res.send({
								reasons: true,
								votedNum: data.voters.length
							})
						}
					)
				}
				else{		//有VOTER
					console.log("1");
					var found = false;
					data.voters.forEach(function(val,idx){ //VAL為USERID
						//檢查USERID是否跟CURRENT USER一樣
						console.log("deleted")
						if(val.id === userid){
							data.voters.splice(idx,1); //作取消同意的動作
							data.vote=data.voters.length;
							found = true; //find user vote
							// request.put('http://localhost:1337/reason/'+reasonid,{voters: data.voters, vote: data.voters.length},function(err,response,html){
							// 	console.log('saved')
							// 	res.send({
							// 		reasons: true,
							// 		votedNum: data.voters.length
							// 	})
							// })
							request(
							    { method: 'PUT'
							    , uri: 'http://localhost:1337/reason/'+reasonid
							    , multipart:
							      [ {voters: data.voters, vote: data.voters.length} ]
							    }
							  , function (error, response, body) {
								    console.log('saved')
									res.send({
										reasons: true,
										votedNum: data.voters.length
									})
								}
							)
						}
					})
					//看FOUND是否找到東西
					if(!found){
												// find nothing
						data.voters.push(userid); //推入USERID
						data.vote=data.voters.length;
						console.log("找不到");

					}



				}




 			}

 			//find no reasons
 			else{
 				res.send({
 					reasons: false,
 					votedNum: 0
 				})
 			}

 		})




 	},

 	getVoter: function(req,res){

 		Reason.findOne({id: req.param('id')})
 		.exec(function(err, data){
 			if(data){
 				res.send({voters: data.voters});
 			}
 		})
 	}

};