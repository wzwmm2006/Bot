// discord 机器�?
const { Client, GatewayIntentBits } = require('discord.js');

const bot_token = "";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 登录机器�?
exports.discord_login = function(){
    try{
        client.login(bot_token);
        
        client.on("ready", () => {
            console.log("機器人已經成功上線且載入成功!");
        });
    }
    catch(e){
        console.log(e);
    }
}

// 发送消息刀某个频道
exports.discord_sendMsg = async function(channel, msg){
    try{
        //client.on("ready", () => {
            client.channels.fetch(channel).then(channel => channel.send(msg));
        //});
    }
    catch(e){
        console.log(e);
    }
}

