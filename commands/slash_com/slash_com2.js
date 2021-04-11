const Discord = require("discord.js");

const Feistel_Cipher = require('./../Feistel_Cipher.js')

const Gskuld = '1JxSZiunPLPOJdZCMLtHxuhpu2Wh7ohwBfW9aq0Pq6hw';

const Drive = require('./../../Storage/Drive.js')

const Notification = require('./../notification.js')

const cvs = require('canvas')

const fs = require('fs');

const sl = require('./../Sundleikurinn.js')

const request = require('request');

const readline = require('readline');

const cheerio = require('cheerio');

const slash_com = require('./slash-com.js')

let bot = new Discord.Client();

let JamesBot;

let EndingsList;


/**
 * 
 * @param {Discord.Client} bot_ 
 * @param {Drive.Project} Jamesbot_ 
 * @param {[]} EndingsList_ 
 */
function getVariables(bot_, Jamesbot_, EndingsList_){
    bot = bot_
    JamesBot = Jamesbot_
    EndingsList = EndingsList_
    Notification.setClient(bot_, Jamesbot_)
}
exports.getVariables = getVariables

/**
 * 
 */
function command_reply(){
    slash_com.command_reply(bot, {gskuld, encrypt, decrypt, help, sundleikurinn_com, image, kick_com, bot_stats, user_info, notification})
}
exports.command_reply = command_reply











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










// Export Comands
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

async function gskuld(data, user){
    let userfound = false;
    if(data.options){
        for (let i = 0; i < data.options.length; i++) {
            const option = data.options[i];
            if(option.name == 'user'){
                user = await bot.users.fetch(option.value);
                userfound = true;
            }
        }
    }
    if(!userfound){
        user = await bot.users.fetch(user.id)
    }



    let gskuld = await JamesBot.exportFile(Gskuld, 'text/csv')
    gskuld = gskuld.split('\r\n')
    gskuld.forEach((v, i) => {gskuld[i] = v.split(",")});
    let skuldugur = true;

    let skuld = ""
    for (let i = 3; i < gskuld.length; i++) {
        const element = gskuld[i];
        if(element[0] == user.id){
            skuld += user.toString() + element[1].replace('/skuld', element[2]).replace('/bab', element[3]).replace('/af', element[4]) + '\n'
            skuldugur = false;
        }
    }
    if(skuldugur){
        return "Engin skuld fanst hjá " + user.toString()
    }else{
        return skuld
    }
}

/**
 * 
 * @param {{options: {value:String, name: String, type: number}[]}} data 
 */
function encrypt(data){
    let key;
    let content;
    for (let i = 0; i < data.options.length; i++) {
        const option = data.options[i];
        if(option.name == 'key'){
            key = option.value;
        }else if(option.name == 'message'){
            content = option.value;
        }
    }
    if(key.length < 10){
        return "The key needs to be at least 10 characters"
    }else{
        return Feistel_Cipher.encrypt(content, key)
    }
}

/**
 * 
 * @param {{options: {value:String, name: String, type: number}[]}} data 
 */
function decrypt(data){
    let key;
    let content;
    for (let i = 0; i < data.options.length; i++) {
        const option = data.options[i];
        if(option.name == 'key'){
            key = option.value;
        }else if(option.name == 'message'){
            content = option.value;
        }
    }
    if(key.length < 10){
        return "The key needs to be at least 10 characters"
    }else{
        return Feistel_Cipher.decrypt(content, key)
    }
}




/**
 * 
 * @param {{options: {value:String, name: String, type: number}[]}} data 
 * @param {String} channel_
 */
async function help(data, channel_){
    const channel = await bot.channels.fetch(channel_);
    //msg.reply("\nUseful commands: \n \n!events \nHey besti botti ertu vakandi? \n!commands \n \n \nFun stuff: \n!image = finds a image  \nÉg fékk heimavinnu í dag hvað á ég að gera? \nKirill hakkaði botinn minn! Hvað á ég að gera!? \nKirill hakkaði tölvuna mína! Hvað á ég að gera!? \nÉg fékk heimavinnu í dag hvað á ég að gera?  \nStefán er dauður!  \n@James's Good Advice Bot#8745 Stefán vill spila. Á ég að spila með honum? \nJæja þá skulum við fara með bæn  \nSnær er ekki skemtilegur  \nÓ góði ráðgjafar-botti lof mér að fá þær upplýsingar um hver er besti bottinn á þessari discord rás ");
    fs.readFile('README.md', async (err, readme) => {
        const embeded = [];

        let rightSpace = false;
        readme = readme.toString().split('\r\n')
        let command = [];
        let reaction = [];
        let type = "";
        let n = 0;
        let description = "This are commands for this bot.\nHere is list for chapters:";
        
        //v1 - https://github.com/JimmyJames188/Discord-bot/commit/5931ae3ef640eadcd02287e81f3d80f4374d4abe
        //v2 - current version
        for (let i = 0; i < readme.length; i++) {
            let line = readme[i];
            if(rightSpace){
                if(line.startsWith("<!-- END OF COMMANDS -->")){
                    rightSpace = false
                }else if(line.startsWith('###') || (n == 8 && line != '')){
                    if(type == " Reactions"){
                        for (let j = 0; j < reaction.length; j++) {
                            embeded[embeded.length - 1].addField(
                                reaction[j], command[j], true
                            )
                        }
                    }
                    if(line.startsWith('###')){
                        type = line.substring(3)
                        description = description + "\n" + (embeded.length + 1) + " - " + type;
                    }
                    embeded.push(new Discord.MessageEmbed()
                        .setColor('#CC0000')
                        .setTitle(type)
                        .setAuthor(bot.user.username, bot.user.avatarURL())
                        .setURL('https://github.com/JimmyJames188/Discord-bot#commands')
                        .setFooter("Page " + (embeded.length + 1), bot.user.avatarURL()))
                

                    if(n = 8){
                        if(line != '' && !line.startsWith('<!-- break -->') && !line.startsWith('###')){
                            embeded[embeded.length - 1].addFields([
                                {name: "\u200B", value: "\u200B", inline: false},
                                {name: "command", value: readme[i].split(' => ')[0].substring(1).replace("||", "\\|\\|"), inline: true},
                                {name: "info", value: readme[i].split(' => ')[1], inline: true}
                            ])
                            n = 1;
                        }else{
                            n = 0
                        }
                    }
                }else if(type == " Reactions"){
                    if(readme[i - 1].startsWith('###')){
                        line = line.split("|")
                        for (let j = 1; j < line.length - 1; j++) {
                            reaction.push(line[j].replace(" ", ""))
                        }
                        command = new Array(line.length - 2).fill("")
                    }else if(!line.includes("-")){ 
                        line = line.split("|")
                        for (let j = 1; j < line.length - 1; j++) {
                            command[j - 1] = command[j - 1] + line[j] + '\n'
                        }
                    }

                }else if(line != '' && !line.startsWith('<!-- break -->')){
                    embeded[embeded.length - 1].addFields([
                        {name: "\u200B", value: "\u200B", inline: false},
                        {name: "command", value: readme[i].split(' => ')[0].substring(1).replace("||", "\\|\\|"), inline: true},
                        {name: "info", value: readme[i].split(' => ')[1], inline: true}
                    ])
                    n++
                }

            }else if(line.startsWith("## Commands")){
                rightSpace = true
                type = readme[i + 1].substring(3)
            }
            
        }
        
        description = description + "\n\nTo open chapter you can send command **/help `the number of the page`**"
        for (let i = 0; i < embeded.length; i++) {
            embeded[i].setDescription(description)
        }

        let message;
        let page;
        if(data.options){
            data.options.forEach(opt => {
                if(opt.name == "page"){
                    page = opt.value;
                }
            });
            if(page > 0 && page <= embeded.length){
                message = await channel.send(embeded[page - 1])
            }else{
                channel.send("Invalid number")
                return
            }
        }else{
            message = await channel.send(embeded[0])
            page = 1;
        }

        if(page != 1){
            message.react("◀")
        }
        if(page != embeded.length){
            message.react("▶")
        }

        let reaction_collector = message.createReactionCollector((r, user) => (r.emoji.name == "◀" || r.emoji.name == "▶") && !user.bot)
        reaction_collector.on('collect', async (r, user) => {
            if(r.emoji.name == "◀" && page != 1){
                page--;
                message.edit(embeded[page - 1])

                if(page == 1){
                    r.users.remove(bot.user)
                }else if(page == embeded.length - 1){
                    message.react("▶")
                }
            }else if(r.emoji.name == "▶" && page != embeded.length){
                page++;
                message.edit(embeded[page - 1])

                if(page == 2){
                    await r.users.remove(user)
                    await r.users.remove(bot.user)
                    message.react("◀")
                    message.react("▶")
                    return
                }else if(page == embeded.length){
                    r.users.remove(bot.user)
                }
            }
            r.users.remove(user)
        })

        let collector = message.channel.createMessageCollector(m => m.content == '-help-')
        collector.on('collect', () => {
            message.delete()
            collector.stop()
        })
    })
}











/**
 * 
 * @param {Discord.TextChannel} channel
 */
 async function PrintAll(channel){
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

    fs.writeFileSync("img/allmap.png", ClippingCanvas.toBuffer())

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
 * @param {Discord.TextChannel} channel 
 * @param {Number[]} Endings
 * @param {Discord.User} user
 * @param {Discord.Member} member
 */
function PrintStats(channel, Endings, user, member){
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
    fs.writeFileSync("img/map.png", canvas.toBuffer())

    
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

    channel.send("", {
        embed: embeded.setImage("attachment://map.png"),
        files: [{
            attachment: 'img\\map.png',
            name: 'map.png'
        }]
    })
    return;

}


/**
 * 
 * @param {String} channel_id
 * @param {Discord.User} user
 * @param {Discord.GuildMember | Discord.User} member
 */
async function sundl_play(channel_id, user, member){
    const channel = await bot.channels.fetch(channel_id)
    let collector = channel.createMessageCollector(m => m.author == user)
    collector.on('collect', m =>{
        
        
        if(m.content.toLowerCase() === 'ja' || m.content.toLowerCase() === 'já'){
            collector.stop()
            channel.send('**Ok nú skulum við byrja**')

            for(let i = 0; i < sl.SundleikurinnData.userData.Endings.length; i++){
                if(sl.SundleikurinnData.userData.Endings[i].User == user){
                    sl.Sundleikurinn(member, channel, 3, {Endings: sl.SundleikurinnData.userData.Endings[i]})
                    return;
                }
            }
            process.stdout.write("Adding new user to sundleykurinn".green + "-" + "[..........] 0%".red)
            
            sl.SundleikurinnData.userData.Endings.push({UserId: user.id, User: user, Endings: []})
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0);
            process.stdout.write("Adding new user to sundleykurinn".green + "-" + "[|||||.....] 50%".red)

            JamesBot.editFile(EndingsId, JSON.stringify(sl.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '));
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0);
            console.log("Adding new user to sundleykurinn".green + " - " + "Finished".green);

            sl.Sundleikurinn(member, channel, 3, {Endings: sl.SundleikurinnData.userData.Endings[sl.SundleikurinnData.userData.Endings.length - 1]})
        }else if(m.content.toLowerCase() === 'nei'){
            collector.stop()
        }
    })
}
/**
 * 
 * @param   {{options: [
 *              {name: "play", type: 1} | 
 *              {name: "stats", type: 2, options: [
 *                  {name: "player", type: 1, options?: [
 *                      {value:String, name: "player", type: 6}
 *                  ]} | 
 *                  {name: "all", type: 1}
 *              ]}
 *          ]}} data 
 * @param {String} channel_id
 * @param {String} guild_id
 * @param {Discord.User} user
 * @param {Discord.GuildMember | Discord.User} member
 */
async function sundleikurinn_com(data, channel_id, guild_id, user, member = user){
    user = await bot.users.fetch(user.id)
    if(guild_id){
        member = await (await bot.guilds.fetch(guild_id)).members.fetch(user)
    }else{
        member = user
    }
    if(data.options[0].name === "play"){
        sundl_play(channel_id, user, member)
        return 'Ertu viss um að þú viljir spila "Sundleikurinn"? (Já / Nei)';

    }else if(data.options[0].name == "stats"){
        if(data.options[0].options[0].name == "all"){
            PrintAll(await bot.channels.fetch(channel_id))
            return "-stats-"

        }else if(data.options[0].options[0].name === "player"){
            if(data.options[0].options[0].options){
                user = await bot.users.fetch(data.options[0].options[0].options[0].value)
                if(member.guild){
                    member = await member.guild.members.fetch(user.id);
                }else{
                    member = user;
                }
            }

            if(user == bot.user){
                PrintStats(await bot.channels.fetch(channel_id), sl.SundleikurinnData.botData.Endings.Endings, user, member)
                return "-stats-";
            }
            for(let i = 0; i < sl.SundleikurinnData.userData.Endings.length; i++){
                if(sl.SundleikurinnData.userData.Endings[i].User.id == user.id){
                    PrintStats(await bot.channels.fetch(channel_id), sl.SundleikurinnData.userData.Endings[i].Endings, user, member)
                    return "-stats-";
                }
            }
            return "Þú virðist ekki hafa spilað sundleikinn"
        }
    }
}




/**
 * 
 * @param {(image: string) => any} callback 
 */
async function image(callback){
    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + "Attack on titan meme",
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
        callback(urls[Math.floor(Math.random() * urls.length)]);
    });
}






/**
 * 
 * @param {{options: [{value: String}]}} data 
 * @param {String} guild_id 
 * @param {Discord.GuildMember} the_member 
 */
async function kick_com(data, guild_id = undefined, the_member = undefined){
    if(!guild_id){
        return "You are not in a server."
    }
    const permissions = new Discord.Permissions(parseInt(the_member.permissions))

    if(!permissions.has('KICK_MEMBERS')){
        return "You don't have permission to kick someone."
    }
    const member = await (await bot.guilds.fetch(guild_id)).members.fetch(data.options[0].value)
    if (!member.kickable) {
        return `I can't kick this user. Sorry!`
    }
    await member.kick()
    return `${member.user.tag} was thrown down a tree.`
}

function bot_stats(){  
    let days = Math.floor(bot.uptime / 86400000);
    let hours = Math.floor(bot.uptime / 3600000) % 24;
    let minutes = Math.floor(bot.uptime / 60000) % 60;
    let seconds = Math.floor(bot.uptime / 1000) % 60;
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle("Bot's Stats")
        .addField(" \u200B ", "**Servers** : ` " + `${bot.guilds.cache.size}` + " `")
        .addField(" \u200B ", "**Total channels** : ` " + `${bot.channels.cache.size}` + " `")
        .addField( "\u200B ", `**__Uptime:__** :`  + `\n${days}d ${hours}h ${minutes}m ${seconds}s` + " ")
    return exampleEmbed
}




/**
 * 
 * @param {{options: [{value: String}]}} data 
 * @param {Discord.GuildMember} member 
 * @param {String} channel_id 
 */
async function user_info(data, member, channel_id) {
    const channel = await bot.channels.fetch(channel_id)
    const guild = channel.guild
    const msg_member = await channel.guild.members.fetch(member.user.id)

    if(data.options) {
        member = await guild.members.fetch(data.options[0].value)

    }else {
        member = msg_member
    }

    const user = member.user

    const embed = new Discord.MessageEmbed()
        .setAuthor(`${member.displayName}'s info`, user.avatarURL())
        .addFields(
            {
                name: 'Nick',
                value: member.nickname || 'None'
            },
            {
                name: 'User tag',
                value: user.tag
            },
            {
                name: 'Is bot',
                value: user.bot
            },
            {
                name: "User is bannable",
                value: member.bannable
            },
            {
                name: 'When the user joined the server',
                value: member.joinedAt
            }
        )
        .setFooter("User info", bot.user.avatarURL())

    channel.send(embed)
}

function romanize (num) {
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return ' - ' + Array(+digits.join("") + 1).join("M") + roman;
}

/**
 * 
 * @param {{
 *          resolved: {channels: 
 *                  {[key: string]: {name: String, id: String, type: number, permissions: String}}
 *              },
 *          options: [
 *              {name: 'create', type: 1, options: [
 *                  {name: 'name',          type: 3, value: String},
 *                  {name: 'date',          type: 3, value: String},
 *                  {name: 'counting_type', type: 3, value: 'Function_none' | 'Function_roman' | 'Function_arabic'},
 *                  {name: 'channel',       type: 7, value: String},
 *                  {name: 'color',         type: 3, value: String},
 *                  {name: 'frequancy',     type: 4, value: number},
 *                  {name: 'until',         type: 3, value: String},
 *                  {name: 'start_number',  type: 4, value: number}
 *              ]}
 *        ]}} data 
 */
function notification(data){
    if(data.resolved.channels[data.options[0].options[3].value].type != 0){
        return 'Channel not compateble'
    }

    const name = data.options[0].options[0].value
    const date = new Date(data.options[0].options[1].value)
    const channel = bot.channels.cache.get(data.options[0].options[3].value)

    let FunctionNumber;
    switch(data.options[0].options[2].value){
        case 'Function_none':
            FunctionNumber = undefined;
            break;
        
        case 'Function_arabic':
            FunctionNumber = (i) => {return ' - ' + i};
            break;

        case 'Function_roman':
            FunctionNumber = romanize;
            break

        case 'Function_ep_arabic':
            FunctionNumber = (i) => {return ' Episode ' + i};
            break;
    }

    const options = {number: FunctionNumber};
    let frequancy, until;
    for (let i = 4; i < data.options[0].options.length; i++) {
        const option = data.options[0].options[i];
        switch(option.name){
            case 'color':
                options.color = option.value;
                break;
            
            case 'frequancy':
                frequancy = option.value;
                break;

            case 'until':
                until = new Date(option.value);
                break;

            case 'start_number':
                options.StartNumber = option.value;
                break;
        }
    }

    console.log({name, date, frequancy, until, options})
    const notification = new Notification.Notification(name, date, frequancy, until, options)
    notification.startUpdate(channel)

    return `Notificaton ${name} successfully created`;
}