const Discord = require('discord.js');
const puppeteer = require("puppeteer");
var fetch = require("node-fetch")
var bot = new Discord.Client();
var token = 'YOUR_BOT_TOKEN';
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, data);
    return response.json(); // parses JSON response into native JavaScript objects
}
/*async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://mcsrvstat.us/server/172.65.219.10:36102");
    let number = await page.evaluate(() => {

        let a = document.querySelector('#content').innerText

        return a;

    });
    //await page.screenshot({path: 'screenshot.png'});
    browser.close();
}*/
var boomCount = 0
bot.on('ready', function (msg) {
    console.log(1)
    //bot.channels.cache.get("961310726402736128").send("1")

    setInterval(() => {
        bot.channels.cache.get("CHANNEL_ID").messages.fetch({ around: 'MESSAGE_ID', limit: 1 })
            .then(msg => {
                msg = msg.first()
                async function run() {
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.goto("https://mcsrvstat.us/server/YOUR_IP_ADDRESS_OF_MC_SERVER");
                    const element = await page.$("#content");
                    let number = await page.evaluate(() => {
                        if(!document.querySelector('#content')){
                            let a = document.querySelector('html').innerText
                            return a
                        }else{
                            let a = document.querySelector('#content').innerText
                            return a
                        }
                        

                        

                    });
                    if (number.includes("Could not get the server status") && boomCount == 0) {
                        bot.channels.cache.get("CHANNEL_ID").send("The server is down")
                        boomCount++
                    }
                    if (!number.includes("Could not get the server status") && boomCount != 0) {
                        boomCount = 0
                    }
                    await element.screenshot({ path: 'screenshot.png' });

                    const attachment = new Discord
                        .MessageAttachment('./screenshot.png', '1.png');
                    bot.channels.cache.get("TEMP_CHANNEL_ID").send(attachment).then(msg2 => {
                        bot.channels.cache.get("CHANNEL_ID").messages.fetch({ limit: 1 })
                            .then(msg1 => {
                                url = msg1.first().attachments.first().url

                                postData("https://api.mcsrvstat.us/2/YOUR_IP_ADDRESS_OF_MC_SERVER", {
                                    "headers": {
                                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                                        "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6",
                                        "cache-control": "max-age=0",
                                        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
                                        "sec-ch-ua-mobile": "?0",
                                        "sec-ch-ua-platform": "\"Windows\"",
                                        "sec-fetch-dest": "document",
                                        "sec-fetch-mode": "navigate",
                                        "sec-fetch-site": "none",
                                        "sec-fetch-user": "?1",
                                        "upgrade-insecure-requests": "1"
                                    },
                                    "referrerPolicy": "strict-origin-when-cross-origin",
                                    "body": null,
                                    "method": "GET"
                                })
                                    .then(data => {
                                        // console.log(data)
                                        if (!data.players) {
                                            var playerList="" 
                                        } else if(!data.players.list){
                                            var playerList=""
                                        }else{
                                            var playerList = "\n"+data.players.list.join(", ")
                                            if (playerList.includes("SOME_MINECRAFT_ID")) {
                                                playerList += "\n" + ":red_circle::red_circle::red_circle::red_circle::red_circle:Someone is online:red_circle::red_circle::red_circle::red_circle::red_circle:"
                                            }
                                        }
                                            msg.edit(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()   + playerList + "\n" + url)
                                            //msg.edit("2")
                                        
                                    })


                            })
                        setTimeout(() => msg2.delete(), 1000)
                    })
                    browser.close();
                }
                run()


            })
    }, 10000)

})
bot.login(token)
//