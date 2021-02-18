const Discord = require("discord.js");



const {google} = require('googleapis');

const Drive = require('./Storage/Drive.js')

const readline = require('readline');

const urban = require("relevant-urban")

const cvs = require('canvas')

const cheerio = require('cheerio');

const ffmpeg = require('ffmpeg');

const { error } = require("console");

const request = require('request');

const ytdl = require("ytdl-core");

const bot = new Discord.Client();

const token = 'NzAxNDM1OTM5MTY3MjcyOTYx.XqsAOQ.jVBb1AmeN72eFmZjOHqJaWgrYmM';

const PREFIX = '!';

var version = '1.2';

var servers = {};

const fs = require('fs');

const sl = require('./commands/Sundleikurinn.js')


let RawSundleykurinnData;
let JamesBot;
const EndingsId = '1CxeqpkqA238s1WYz83n88NK-GdwgIgtU';

//voice chat
var dispatcher = false;
const broadcast = bot.voice.createBroadcast();
var volume = 1;
console.log("brodcast start")
const pasw = Math.floor(Math.random() * 8999999 + 1000000)


// let randomstring = "";
// for (let i = 0; i < 100000; i++) {
//     randomstring = randomstring + Math.floor(Math.random() * 10).toString();
// }


// Types: 0. Bad, 1. Neutral, 2. Good
const EndingsList = [
    {},
    {Number: 5, Type: 0, Secret: false}, //  1
    {Number: 7, Type: 2, Secret: false}, //  2
    {Number: 8, Type: 0, Secret: false}, //  3
    {Number: 9, Type: 1, Secret: false}, //  4
    {Number: 12, Type: 0, Secret: false}, // 5
    {Number: 13, Type: 1, Secret: false}, // 6
    {Number: 17, Type: 0, Secret: true}, //  7
    {Number: 18, Type: 1, Secret: true}, //  8
    {Number: 19, Type: 0, Secret: false}, // 9
    {Number: 20, Type: 0, Secret: false}, // 10
    {Number: 21, Type: 2, Secret: false}, // 11
    {Number: 22, Type: 1, Secret: true},  // 12
    {Number: 23, Type: 2, Secret: false}, // 13
    {Number: 24, Type: 0, Secret: false}, // 14
    {Number: 27, Type: 1, Secret: false}, // 15
    {Number: 28, Type: 2, Secret: false}, // 16
    {Number: 29, Type: 0, Secret: false}, // 17
    {Number: 30, Type: 0, Secret: false}, // 18
    {Number: 31, Type: 2, Secret: true}, //  19
    {Number: 33, Type: 2, Secret: false}, // 20
    {Number: 35, Type: 2, Secret: false}, // 21
    {Number: 36, Type: 0, Secret: false}, // 22
    {Number: 38, Type: 2, Secret: false}, // 23
    {Number: 39, Type: 0, Secret: false}, // 24
    {Number: 40, Type: 2, Secret: false} //  25
]

cvs.CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
}

let BotEndings = [];
for (let i = 1; i < EndingsList.length; i++) {
    BotEndings.push(i)
}

async function getSundleikurinnPlayerData(data){
    process.stdout.write("Getting player data for sundleykurinn".green + " - " + "[..........] 0%".red)

    for(let i = 0; i < data.length; i++){
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write("Getting player data for sundleykurinn".green + " - " + `[${"|".repeat(Math.floor(10 * i / (data.length - 1))) + ".".repeat(Math.ceil(10 - 10 * i / (data.length - 1)))}] ${i / (data.length - 1) * 100}%`.red);
        data[i].User = await bot.users.fetch(data[i].UserId)
    }
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    console.log("Getting player data for sundleykurinn".green + " - " + "Finished".green)

    sl.SundleikurinnData.botData.Endings = {
        UserId: bot.user.id,
        Endings: BotEndings,
        User: bot.user
    }
    //console.log(data)
    sl.SundleikurinnData.userData.Endings = data
}






const { DiscordBattleShip } = require("discord-battleship");

const BattleShip = new DiscordBattleShip({ 
    embedColor: "RED",
    prefix: "?",
});

bot.on("message", async (message) => {
    if (message.content.toLowerCase().startsWith("?battleship"))
        await BattleShip.createGame(message);
});




bot.on('ready', () => {
    if(Drive.WaitingForInput){
        Drive.WaitingForInputCallback(() => {
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0);
            console.log("Bot login".green + " - " + (`Finished, version ` + version).green);
        })
    }else{
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.log("Bot login".green + " - " + (`Finished, version ` + version).green);
    }
    getSundleikurinnPlayerData(RawSundleykurinnData)
    JamesBot.onChanges(EndingsId, data => {
        if(!sl.SundleikurinnData.updatedDrive){
            console.log("The file changet, updating local database:")
            getSundleikurinnPlayerData(data)
        }else{
            sl.SundleikurinnData.updatedDrive = true;
        }
    }, undefined, 10000)
});

bot.on("guildMemberAdd", member => {
    member.send(
        "Hey here´s some good advice: Don't be racist \n \n \n For further info please type in chat !racist-info"
    )

    var role = member.guild.roles.resolve("727092499822411816"); 
    member.roles.add(role);
 
})

bot.on('message', msg=> {
    if (msg.content === "Blubadub") {
        msg.channel.send(3+3)
   
    }else if (msg.content === "Ey whats my mental age bot?") {
        msg.channel.send("You're mentally: " + Math.floor(Math.random() * 100 + 1) + "")
   
    }else if(msg.content === "Ó góði ráðgjafar-botti lof mér að fá þær upplýsingar um hver er besti bottinn á þessari discord rás"){
        msg.reply("Svo verði ósk þín. Besti bottin á þessari discord rás er James's Good Advice Bot");
   
    }else if(msg.content === "Snær er ekki skemtilegur"){
        msg.reply('NEI!!!');
   
    }else if(msg.content === "!racist-info"){
        msg.reply('https://youtu.be/USE86UbsV8c');
   
    }else if(msg.content === "!nice"){
        msg.reply('https://youtu.be/ffQmb-cNFuk');
   
    }else if(msg.content === "Jæja þá skulum við fara með bæn"){
        msg.reply('Heilagi Gummi! Lífið og heilsan er helgidómur, sem þú hefur gefið okkur, því er allt heilagt sem viðheldur lífinu. Gef okkur því visku til að njóta matar og drykkjar með fögnuði og þakklátum huga og gæta jafnframt hófs. Blessaðu líf okkar og starf og gef okkur náð og þrótttil að vera trúir þjónar á akri þínum. Send snauðum og sjúkum hjálp og syrgjendum huggun. Blessaðu og helgaðu lífið sérhverja stund í Gumma krists heilaga nafni. A M E N');
   
    }else if(msg.content === "!ProfilePicture"){
        msg.reply(`<${msg.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
   
    }else if(msg.content === "Lights out!"){
        var botping = Math.round(bot.ws.ping)
        message.reply(`And away we go! \nI had a reaction time of ${botping}ms.`);
   
    }else if(msg.content === "F"){
        msg.reply('F');
   
    }else if(msg.content === "Welcome to the channel!"){
        msg.reply("It's nice to be here!");
   
    }else if(msg.content === "@James's Good Advice Bot#8745 Stefán vill spila. Á ég að spila með honum?"){
        msg.reply('AUÐVITAÐ HVERSLAGS SPURNING ER ÞETTA EIGINLEGA!!');
   
    }else if(msg.content === "Þorsteinn er dauður!" || msg.content === "Stefán er dauður!"){
        msg.reply('Haha lol það er afþví að ég drakk 10 kíló af monster og 360 no-scopeaði hann! XD XD XD');
   
    }else if(msg.content === "clapping"){
        msg.reply('Bruh it´s claping \n CLAPING \n CLAPING\n CLAPING \n CLAPING\n CLAPING \n CLAPING\n CLAPING \n CLAPING\n CLAPING \n CLAPING\n CLAPING \n CLAPING');
   
    }else if(msg.content === "Kirill hakkaði botinn minn! Hvað á ég að gera!?"){
        msg.reply('https://www.youtube.com/watch?v=Nt2246e0f6I');
   
    }else if(msg.content === "no"){
        msg.reply("Yes");
   
    }else if(msg.content === "ding dong"){
        msg.reply("Your opinion is wrong");
    
    }else if(msg.content.toUpperCase() === "YES"){
         msg.reply('YES YES YES YES YES YES YES YES');
   
    }else if(msg.content === "Kirill hakkaði tölvuna mína! Hvað á ég að gera!?"){
        msg.reply('https://www.youtube.com/watch?v=Nt2246e0f6I');
    
    }else if(msg.content === "Ég fékk heimavinnu í dag hvað á ég að gera?"){
        msg.reply('Kveiktu í landakotsskóla!');
    
    }else if(msg.content === "!events"){
        msg.reply('\n1: James made a kahoot about the discord server a while ago that STILL hasn´t been played. \n2: Lögreglan ætlar að handtaka kaktus sem sást í gærkvöldi um klukkan 11:35 niðri í bæ. Sagt er að kaktusinn býr í matarkjallara sem er neðst niðri í ráðhúsinu. Kaktusinn er sagður heita Pétur. (This is genuienly to long to translate)');
    
    }else if(msg.content === "Hey besti botti ertu vakandi?"){
        msg.reply("Nei");
    
    }else if(msg.content === "🅱️ruh"){
        msg.reply("Bruh");
    
    }else if(msg.content === "Hvaða botti ætlar barasta ekki að læra að reikna?"){
        msg.reply("Ég!");
    
    }else if(msg.content === "!help"){
        //msg.reply("\nUseful commands: \n \n!events \nHey besti botti ertu vakandi? \n!commands \n \n \nFun stuff: \n!image = finds a image  \nÉg fékk heimavinnu í dag hvað á ég að gera? \nKirill hakkaði botinn minn! Hvað á ég að gera!? \nKirill hakkaði tölvuna mína! Hvað á ég að gera!? \nÉg fékk heimavinnu í dag hvað á ég að gera?  \nStefán er dauður!  \n@James's Good Advice Bot#8745 Stefán vill spila. Á ég að spila með honum? \nJæja þá skulum við fara með bæn  \nSnær er ekki skemtilegur  \nÓ góði ráðgjafar-botti lof mér að fá þær upplýsingar um hver er besti bottinn á þessari discord rás ");
        fs.readFile('README.md', (err, readme) => {
            const embeded = new Discord.MessageEmbed()
                .setColor('#CC0000')
                .setTitle("Commands")
                .setURL('https://github.com/JimmyJames188/Discord-bot#commands')
                .setAuthor(bot.user.username, bot.user.avatarURL())
                .setDescription('This are comands for this bot!')
                .setFooter("Takk fyrir að nota bottan!", bot.user.avatarURL());

            let rightSpace = false;
            readme = readme.toString().split('\r\n')
            let commands = "";
            let info = "";
            let type = "";
            
            for (let i = 0; i < readme.length; i++) {
                const line = readme[i];
                if(rightSpace){
                    if(line.startsWith("<!-- END OF COMMANDS -->")){
                        rightSpace = false
                    }else if(line.startsWith('###') || line.startsWith('<!-- break -->')){
                        embeded.addFields([
                            {name: type, value: commands.substring(0, commands.length - 1).replace("||", "\\|\\|"), inline: true},
                            {name: "Info", value: info.substring(0, info.length - 1), inline: true},
                            {name: "\u200B", value: "\u200B", inline: false}
                        ])
                        commands = "";
                        info = "";

                        if(line.startsWith('<!-- break -->')){
                            type = "----"
                        }else{
                            type = line.substring(3)
                        }
                    }else if(line != ''){
                        commands = commands +  line.split(' => ')[0].substring(1) + "\n"
                        info = info +  line.split(' => ')[1] + "\n"
                    }

                }else if(line.startsWith("## Commands")){
                    rightSpace = true
                    i++
                    type = readme[i].substring(3)
                }
                
            }

            msg.channel.send(embeded)
        })
        
    }else if(msg.content === "HVER ER BIG SMORT HÉR?"){
        msg.reply('NEI!!!!! @JimmyJames ER BIG SMORT HÉR!!!');
    
    }else if(msg.content === "Bruh"){
        msg.reply('Bruh');
    
    }else if(msg.content === "bruh"){
        msg.reply('bruh');

    }else if(msg.content === "Mamman þín"){
        msg.reply('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOooooOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
    }
})


bot.on('message', msg=>{
    if(msg.content === "G"){
        msg.channel.send({embed: {
            color: 3447003,
            author: {
                name: bot.user.username,
                icon_url: bot.user.avatarURL
            },
            title: "This is an embed",
            timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL,
                text: "© Example"
                }
          }});
    }
})



bot.on('message', message => {
    let args = message.content.substring(PREFIX.length).split(" ");
    
    switch(args[0]) {
        case 'H':
            const name = message.author.username;
            const embed = new Discord.MessageEmbed()
                .setAuthor('How long you got left in the void', )
                .addField("Who you askin about", message.author.username)
                .addField("Hvenær þessi skilaboð voru send", message.author.createdAt);

            message.channel.send({embed});
            break;

        }
});



bot.on("message", async message => {
    let blacklisted = ["KÚKABOTTI"];

    let foundInText = false;
    for (var i in blacklisted) {
        if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
    }
    
    if (foundInText) {
        message.channel.send("Hver sagði þetta!?");
    }


    blacklisted = ["IS JAMES BANANAMAN"];

    foundInText = false;
    for (var i in blacklisted) {
        if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
    }
    
    if (foundInText) {
        message.react("👎");
        message.channel.send("NEIIII grrrr >:( \nÞÚ ert barasta bananman!!");
    }


    blacklisted = ['SH eru bestir', 'STEFFI ER OWNER', 'JAMES BAD'];

    foundInText = false;
    for (var i in blacklisted) {
        if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
    }
    
    if (foundInText) {
        message.react("👎");
    }


    blacklisted = ['ÞORSTEINN BAD', 'JAMES FOR OWNER', "I'M HOME"];

    foundInText = false;
    for (var i in blacklisted) {
        if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
    }
    
    if (foundInText) {
        message.react("👍");
    }


    if (message.content.startsWith("!kick")) {
      const member = message.mentions.members.first()
      if (!member) {
        return message.reply(
          `Who are you trying to kick? You must mention a user.`
        )
      }
      if (!member.kickable) {
        return message.reply(`I can't kick this user. Sorry!`)
      }
      return member
        .kick()
        .then(() => message.reply(`${member.user.tag} was thrown down a tree.`))
        .catch(error => message.reply(`Sorry, an error occured.`))



    }else if (message.content.startsWith("Ég")) {
        const member = message.mentions.members.first()
        if (!member) {
        return message.reply(
            `Who are you trying to kick? You must mention a user.`
        )
        }
        if (!member.kickable) {
        return message.reply(`I can't kick this user. Sorry!`)
        }
        return member
        .kick()
        .then(() => message.reply(`${member.user.tag} was kicked.`))
        .catch(error => message.reply(`Sorry, an error occured.`))
    }


    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'image':
        image(message);

        break;
    }

});

function image(message){

    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + "banani",
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };





    request(options, function(error, response, responseBody) {
        if (error) {
            return;
        }
  
 
        $ = cheerio.load(responseBody); 
 

        var links = $(".image a.link");
 
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
        
        console.log(urls);

        if (!urls.length) {
           
            return;
        }
 
        // Send result
        message.channel.send( urls[Math.floor(Math.random() * urls.length)]);
    });
}




//voice chat

bot.on("message", msg => {
    if (msg.content.toLowerCase() === ".pause") {
        if(dispatcher != false){
            dispatcher.pause();
        }
    }else if (msg.content.toLowerCase() === ".resume") {
        if(dispatcher != false){
            dispatcher.resume();
        }
    }else if (msg.content.substring(0, 7).toLowerCase() === ".volume") {
        // console.log(msg.content.substring(8, 15) );
        if(msg.content.substring(8, 15) === pasw.toString()){
            volume1 = msg.content.substring(15) / 100;
            console.log(2)
            if(volume1 <= 100){
                if(dispatcher != false){
                    volume = volume1;
                    dispatcher.setVolume(volume);
                }

                msg.reply("Volume set to " + (volume1 * 100).toString() + '%');
            }else{
                msg.reply("Noooooooo the value is too big! \n Please reframe from doing that!");
            }
        }else{
            volume1 = msg.content.substring(7) / 100;
            console.log(1)
            if(volume1 <= 2){
                if(dispatcher != false){
                    volume = volume1;
                    dispatcher.setVolume(volume);
                }

                msg.reply("Volume set to " + (volume1 * 100).toString() + '%');
            }else{
                msg.reply("The value is to big!");
            }
        }
    }else if (msg.content.toLowerCase() === ".stop") {
        for (const connection of bot.voice.connections.values()) {
            connection.play("");
        }
    }else if (msg.content.toLowerCase() === ".join") {

        // console.log(msg.member);

        if(msg.member.voice.channel){
            console.log("joining...");
            msg.member.voice.channel.join()
                .then(connection => {
                    msg.reply("succsesfully joined!");
                    console.log("bot joind the voice channel");
                });

        }else{
            msg.reply("You must to be in a voice channel to use this command!")
        }
    }else if (msg.content.toLowerCase() === ".leave") {

        // console.log(msg.guild.voice);

        if(msg.guild.voice){
            console.log("leaving...");
            msg.guild.voice.channel.leave()
            console.log("bot left the voice channel");
        }else{
            msg.reply("Bot must to be in a voice channel to use this command!")
        }
    }else if (msg.content.substring(0, 5).toLowerCase() === ".play") {
        // console.log(client.voice.connections.values());
        console.log(msg.content.substring(5));
        const song = msg.content.substring(5);
        if(song == ""){
            dispatcher = broadcast.play("https://www.musik.is/Lof/Hljod/thodvocal.mp3");
        }else{
            dispatcher = broadcast.play(ytdl(song, { filter: 'audioonly' }));
        }
        dispatcher.setVolume(volume);
        console.log("playing " + song);
        for (const connection of bot.voice.connections.values()) {
            connection.play(broadcast);
        }
        msg.reply("Playing " + song)
    }
})




var facts = ["Kirill", "pp", "Zolotuskiy", "James", "Mother", "Eiríkur", "Stefán", "Borgar", "Gummi", "Snær"];
var fact = Math.floor(Math.random() * facts.length);


var bananas = ["Hinn heilaga Gumma guð", "Hinn heilaga Gumma sund", "Hinn heilaga prest Snæ", "Hinn heilaga Teit flugsunds eingil", "Hinn heilaga Gumma Krist"];
var banana = Math.floor(Math.random() * bananas.length);

bot.on('message', msg=>{
    if(msg.content === "Ó góði botti hvern eigum við að biðja í dag?"){
        var banana = Math.floor(Math.random() * bananas.length);
        msg.reply(bananas[banana])
        

    }else if(msg.content === "!facts"){
        var fact = Math.floor(Math.random() * facts.length);
        msg.reply(facts[fact] + " " + facts[Math.floor(Math.random() * facts.length)])
    }else if(msg.content === "kirill spírill"){
        exports.run = async (bot, message, args, tools) => {

            if (!args[0]) return message.channel.send('***Please specify some text!***');
    
            let res = await urban(args.join(' ')).catch(e => {
                return message.channel.send('***Sorry, that word was not found!***');
            });
    
            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(res.word)
                .setURL(res.urbanURL)
                .setDescription('Definition: \n*${res.definition}*\n\nExample:\n*${res.example}*')
                .addField('Author', res.author, true)
                .addField('Rating', '**\'Upvotes: ${res.thumbsUp} | Downvotes: ${res.thumbsDown}\'**')
    
            if (res.tags.length > 0 && res.tags.join(', ').length < 1024){
                embed.addField('Tags', res.tags.join(', '), true)
            }
    
            message.channel.send(embed);
        }
    }
})

exports.run = async (bot, message, args, tools) => {

    if (!args[0]) return message.channel.send('***Please specify some text!***');

    let res = await urban(args.join(' ')).catch(e => {
        return message.channel.send('***Sorry, that word was not found!***');
    });

    const embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(res.word)
        .setURL(res.urbanURL)
        .setDescription('Definition: \n*${res.definition}*\n\nExample:\n*${res.example}*')
        .addField('Author', res.author, true)
        .addField('Rating', '**\'Upvotes: ${res.thumbsUp} | Downvotes: ${res.thumbsDown}\'**')

    if (res.tags.length > 0 && res.tags.join(', ').length < 1024){
        embed.addField('Tags', res.tags.join(', '), true)
    }

    message.channel.send(embed);
}


/**
 * 
 * @param {Discord.TextChannel} channel
 */
function PrintAll(channel){
    let stats = {good: 0, neutral: 0, bad: 0, sc: 0}
    for (let i = 1; i < EndingsList.length; i++) {
        if(EndingsList[i].Type == 0){
            stats.bad++;
        }else if(EndingsList[i].Type == 1){
            stats.neutral++;
        }else{
            stats.good++;
        }
        if(EndingsList[i].Secret){
            stats.sc++;
        }
    }

    stats.sum = stats.good + stats.bad
    let color = {red: Math.round((stats.bad / Math.max(stats.bad, stats.good)) * 255).toString(16), green: Math.round((stats.good / Math.max(stats.bad, stats.good)) * 255).toString(16)}
    if(color.red.length < 2){
        color.red = "0" * (2 - color.green.length) + color.red
    }
    if(color.green.length < 2){
        color.green = "0" * (2 - color.green.length) + color.green
    }

    
    const w = 125
    const h = 200
    const w1 = Math.floor(Math.sqrt(EndingsList.length - 1)) * 2
    const width = (w + 100) * w1
    const height = Math.ceil((EndingsList.length - 1) / w1) * (h + 100)

    const canvas = cvs.createCanvas(width, height)
    const context = canvas.getContext('2d')
    const ClippingCanvas = cvs.createCanvas(width, height)
    const ClippingContext = ClippingCanvas.getContext('2d')
    let procent = 1;
    
    Count = new Array(EndingsList.length).fill(0);
    for(let i = 0; i < sl.SundleikurinnData.userData.Endings.length; i++){
        let Endings = sl.SundleikurinnData.userData.Endings[i].Endings
        for(let j = 0; j < Endings.length; j++){
            Count[Endings[j]]++
        }
    }
    for (let i = 0; i < EndingsList.length - 1; i++) {
        
        
        procent = Count[i + 1] / sl.SundleikurinnData.userData.Endings.length;
        ClippingContext.rect((i % w1) * (w + 100) + 50, Math.floor(i / w1) * (h + 100) + h * (1 - procent) + 50, w, h * procent)
        context.fillStyle = '#000000'
        context.roundRect((i % w1) * (w + 100) + 50, Math.floor(i / w1) * (h + 100) + 50, w, h, 20)
        context.fill();

        
        if(EndingsList[i + 1].Type == 0){
            context.fillStyle = '#A00000'
        }else if(EndingsList[i + 1].Type == 1){
            context.fillStyle = '#A0A000'
        }else{
            context.fillStyle = '#00A000'
        }
        if(EndingsList[i + 1].Secret){
            context.roundRect((i % w1) * (w + 100) + 50, Math.floor(i / w1) * (h + 100) + 50, w, h, 20)
            context.fill();
            context.strokeStyle = '#000000'
            context.lineWidth = h / 20;
            context.stroke()
            context.fillStyle = '#000000'
        }
        context.font = 'bold 70pt Calibri'
        context.textBaseline = 'middle'
        context.textAlign = 'center'
        context.fillText(i + 1, (i % w1) * (w + 100) + 50 + w / 2, Math.floor(i / w1) * (h + 100) + 50 + h / 2)
    }


    // console.log('<img src="' + canvas.toBuffer() + '" />')
    ClippingContext.clip()
    ClippingContext.drawImage(canvas, 0, 0)

    fs.writeFile("img/allmap.png", ClippingCanvas.toBuffer(), () => {})

    const embeded = new Discord.MessageEmbed()
        .setColor(`#${color.red + color.green}00`)
        .setTitle("Tölfræðin alla er:")
        .setAuthor("Everyone", bot.user.avatarURL())
        .addFields([
            {name: "Góðar endingar:", value: stats.good, inline: true},
            {name: "Hlutlausar endingar:", value: stats.neutral, inline: true},
            {name: "Vondar endingar:", value: stats.bad, inline: true},
            {name: "Secret endingar:", value: stats.sc, inline: false}
        ])
        .setFooter("Takk fyrir að spila sundleikinn", bot.user.avatarURL());

    channel.send("", {
        embed: embeded.setImage("attachment://allmap.png"),
        files: [{
            attachment: 'img\\allmap.png',
            name: 'allmap.png'
        }]
    })
    return;
}

/**
 * 
 * @param {Discord.Message} msg 
 * @param {Number[]} Endings
 * @param {Discord.User} user
 * @param {Discord.Member} member
 */
function PrintStats(msg, Endings, user, member){
    let stats = {good: 0, neutral: 0, bad: 0, sc: 0}
    for (let j = 0; j < Endings.length; j++) {
        if(EndingsList[Endings[j]].Type == 0){
            stats.bad++;
        }else if(EndingsList[Endings[j]].Type == 1){
            stats.neutral++;
        }else{
            stats.good++;
        }
        if(EndingsList[Endings[j]].Secret){
            stats.sc++;
        }
    }

    stats.sum = stats.good + stats.bad
    let color = {red: Math.round((stats.bad / Math.max(stats.bad, stats.good)) * 255).toString(16), green: Math.round((stats.good / Math.max(stats.bad, stats.good)) * 255).toString(16)}
    if(color.red.length < 2){
        color.red = "0" * (2 - color.green.length) + color.red
    }
    if(color.green.length < 2){
        color.green = "0" * (2 - color.green.length) + color.green
    }

    
    const w = 125
    const h = 200
    const w1 = Math.floor(Math.sqrt(EndingsList.length - 1)) * 2
    const width = (w + 100) * w1
    const height = Math.ceil((EndingsList.length - 1) / w1) * (h + 100)

    const canvas = cvs.createCanvas(width, height)
    const context = canvas.getContext('2d')

    for (let k = 0; k < EndingsList.length - 1; k++) {
        
        context.fillStyle = '#000000'
        context.roundRect((k % w1) * (w + 100) + 50, Math.floor(k / w1) * (h + 100) + 50, w, h, 20)
        context.fill();

        
        for (let j = 0; j < Endings.length; j++) {
            if(Endings[j] == k + 1){
                if(EndingsList[Endings[j]].Type == 0){
                    context.fillStyle = '#A00000'
                }else if(EndingsList[Endings[j]].Type == 1){
                    context.fillStyle = '#A0A000'
                }else{
                    context.fillStyle = '#00A000'
                }
                if(EndingsList[Endings[j]].Secret){
                    context.roundRect((k % w1) * (w + 100) + 50, Math.floor(k / w1) * (h + 100) + 50, w, h, 20)
                    context.fill();
                    context.strokeStyle = '#000000'
                    context.lineWidth = h / 20;
                    context.stroke()
                    context.fillStyle = '#000000'
                }
            }
        }
        context.font = 'bold 70pt Calibri'
        context.textBaseline = 'middle'
        context.textAlign = 'center'
        context.fillText(k + 1, (k % w1) * (w + 100) + 50 + w / 2, Math.floor(k / w1) * (h + 100) + 50 + h / 2)
    }


    // console.log('<img src="' + canvas.toBuffer() + '" />')
    fs.writeFile("img/map.png", canvas.toBuffer(), () => {})

    
    function name(member) {
        if(member.displayName){
            return member.displayName
        }
        return member.username
    }

    const embeded = new Discord.MessageEmbed()
        .setColor(`#${color.red + color.green}00`)
        .setTitle("Tölfræðin þín er:")
        .setAuthor(name(member), user.avatarURL())
        .addFields([
            {name: "Góðar endingar:", value: stats.good, inline: true},
            {name: "Hlutlausar endingar:", value: stats.neutral, inline: true},
            {name: "Vondar endingar:", value: stats.bad, inline: true},
            {name: "Secret endingar:", value: stats.sc, inline: false}
        ])
        .setFooter("Takk fyrir að spila sundleikinn", bot.user.avatarURL());

    msg.channel.send("", {
        embed: embeded.setImage("attachment://map.png"),
        files: [{
            attachment: 'img\\map.png',
            name: 'map.png'
        }]
    })
    return;

}

bot.on('message', async msg => {
    // if(msg.author.id == '691972281840304129')return;
    if(msg.content === "!game"){
        msg.channel.send('Ertu viss um að þú viljir spila "Sundleikurinn"?');
        
        let collector = msg.channel.createMessageCollector(m => m.author == msg.author)
        collector.on('collect', m =>{
            
            
            if(m.content === 'Ja'){
                collector.stop()
                msg.channel.send('**Ok nú skulum við byrja**')

                for(let i = 0; i < sl.SundleikurinnData.userData.Endings.length; i++){
                    if(sl.SundleikurinnData.userData.Endings[i].User == msg.author){
                        sl.Sundleikurinn(msg.member, msg.channel, 3, {Endings: sl.SundleikurinnData.userData.Endings[i]})
                        return;
                    }
                }
                process.stdout.write("Adding new user to sundleykurinn".green + "-" + "[..........] 0%".red)
                
                sl.SundleikurinnData.userData.Endings.push({UserId: msg.author.id, User: msg.author, Endings: []})
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0);
                process.stdout.write("Adding new user to sundleykurinn".green + "-" + "[|||||.....] 50%".red)

                JamesBot.editFile(EndingsId, JSON.stringify(sl.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '));
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0);
                console.log("Adding new user to sundleykurinn".green + " - " + "Finished".green);

                sl.Sundleikurinn(msg.member, msg.channel, 3, {Endings: sl.SundleikurinnData.userData.Endings[sl.SundleikurinnData.userData.Endings.length - 1]})
            }
        })

    }else if(msg.content == "!stats all"){
        PrintAll(msg.channel)

    }else if(msg.content.substring(0, 6) === "!stats"){
        let user = msg.content.split(" ")
        let member;
        if(user.length > 1){
            user = user[1]
            if(user.substring(0, 2) == '<@' && user.substring(user.length - 1) == '>'){
                try{
                    user = await bot.users.fetch(user.replace(/[<@!>]/g, ''))
                }catch (e){
                    console.log(msg.content)
                    msg.channel.send("Could not find user")
                    return
                }
                
                if(msg.guild){
                    try{
                        member = await msg.guild.members.fetch(user.id);
                    }catch (e){
                        member = user;
                    }
                }
            }else{
                msg.channel.send(user + " is not a valid ping")
                return
            }
        }else{  
            member = msg.member
            if(!member){
                member = msg.author
            }
            user = msg.author
        }

        if(user == bot.user){
            PrintStats(msg, sl.SundleikurinnData.botData.Endings.Endings, user, member)
            return;
        }
        for(let i = 0; i < sl.SundleikurinnData.userData.Endings.length; i++){
            if(sl.SundleikurinnData.userData.Endings[i].User == user){
                PrintStats(msg, sl.SundleikurinnData.userData.Endings[i].Endings, user, member)
                return
            }
        }
        msg.channel.send("Þú virðist ekki hafa spilað sundleikinn")
    }
})


JamesBot = new Drive.Project("credentials.json", async JamesBot => {
    RawSundleykurinnData = await JamesBot.getFile(EndingsId)
    bot.login(token);
    process.stdout.write("Bot login".green + " - " + `[..........] 0%`.red);
})

