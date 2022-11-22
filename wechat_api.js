const request = require("request");
const url = "http://localhost:8055/DaenWxHook/client/";
exports.wxid_机器人A8 = "";
exports.wxid_机器人_A9 = "";

exports.SendMsg = function(msg, robot) {
  try{
    let options = {
      'method': 'POST',
      'url': url,
      'headers': {
        'User-Agent': 'Apifox/1.0.0 (https://www.apifox.cn)',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "type": "Q0001",
        "data": {
          "wxid": robot,
          "msg": msg
        }
      })
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      //console.log("wechat msg:"+response.body);
    });
  }
  catch(e){
    console.log("wechat SendMsg:"+e);
  }
}

exports.GetWexQunList = function(){
  let options = {
    'method': 'POST',
    'url': url,
    'headers': {
      'User-Agent': 'Apifox/1.0.0 (https://www.apifox.cn)',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "type": "Q0006",
      "data": {
        "type": "1"
     }
    })
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    //console.log(response.body);

    let resJson = JSON.parse(response.body);
    return resJson.wexid;
  });
}
