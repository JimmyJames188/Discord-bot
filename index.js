const Discord = require("discord.js");



const {google} = require('googleapis');

// const {Notification} = require('./commands/notification.js')

var crypto = require('crypto');

const Drive = require('./Storage/Drive.js')

const slash_com = require('./commands/slash_com/slash-com.js')

const slash_com2 = require('./commands/slash_com/slash_com2.js')

const Feistel_Cipher = require('./commands/Feistel_Cipher.js')

const readline = require('readline');

const urban = require("relevant-urban")

const ffmpeg = require('ffmpeg');

const DisTube = require('distube');

const { error } = require("console");

const ytdl = require("ytdl-core");

const ytSearch = require('yt-search');

const Playjs = require("./commands/Play.js")

const bot = new Discord.Client();

const PREFIX = '!';

var version = '1.2';

var servers = {};

const fs = require('fs');

let token;

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








//  Event
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

const { DiscordBattleShip } = require("discord-battleship");
const { executionAsyncResource } = require("async_hooks");

const BattleShip = new DiscordBattleShip({ 
    embedColor: "RED",
    prefix: "?",
});

bot.on("message", async (message) => {
    if (message.content.toLowerCase().startsWith("?battleship"))
        await BattleShip.createGame(message);
});

const fun = (index) => index === 1

bot.on('ready', () => {
    // slash_com.send_commands_guild(bot, '701873712370286722');
    // slash_com.send_commands_all(bot);
    // slash_com.delete_commands_all(bot);
    // slash_com.delete_commands_guild(bot, '701873712370286722')
    slash_com2.command_reply()

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
            console.log("The file changed, updating local database:")
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
    var duDe = member.guild.roles.resolve("");

    member.roles.add(role);
 
})


bot.on('ready',() => {
    bot.user.setActivity("slash commands")
})


bot.on('message', async msg=> {
    // console.log(msg)
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
   
    }else if(msg.content === "Lights out!"){
        var botping = Math.round(bot.ws.ping)
        msg.reply(`And away we go! \nI had a reaction time of ${botping}ms.`);
   
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

    }else if (msg.content === `I forgot the server name!`) {
	msg.channel.send(`Aha! James's good advice bot is here to save the day! This server's name is: **${msg.guild.name}**`);
    
    }else if(msg.content.toUpperCase() === "YES"){
         msg.reply('YES YES YES YES YES YES YES YES');
   
    }else if(msg.content === "Kirill hakkaði tölvuna mína! Hvað á ég að gera!?"){
        msg.reply('https://www.youtube.com/watch?v=Nt2246e0f6I');
    
    }else if(msg.content === "Ég fékk heimavinnu í dag hvað á ég að gera?"){
        msg.reply('Kveiktu í landakotsskóla!');
    
    }else if(msg.content === "Hey besti botti ertu vakandi?"){
        msg.reply("Nei");
    
    }else if(msg.content === "🅱️ruh"){
        msg.reply("Bruh");
    
    }else if(msg.content === "Hvaða botti ætlar barasta ekki að læra að reikna?"){
        msg.reply("Ég!");

    }else if (msg.content.startsWith("!delete")) {
        msg.delete(); 
    
    }else if(msg.content === "HVER ER BIG SMORT HÉR?"){
        msg.reply('NEI!!!!! @JimmyJames ER BIG SMORT HÉR!!!');
    
    }else if(msg.content === "Bruh"){
        msg.reply('Bruh');
    
    }else if(msg.content === "bruh"){
        msg.reply('bruh');

    }else if(msg.content === "Mamman þín"){
        msg.reply('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOooooOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');

    }else if(msg.content.startsWith("Hot topic:")){
        const jam = bot.emojis.cache.find(emoji => emoji.name === `pleaseendmysuffering`)

        const emojis = ['👎','👍', '🤷‍♂️', '🤡', jam]

        const randomEmoji = emojis[Math.floor(Math.random() * (emojis.length - 0.1))];

        msg.react(randomEmoji)
    

    }else if(msg.content.startsWith('Ó góði botti, hvaða einkunn fékk ')){
        var input = msg.content.split('<')
        if(input.length != 2){
            msg.channel.send('Error')
        }

        input = input[1].split('>')
        input[0] = input[0].replace(/[<@!>]/g, '')

        if(input.length != 2){
            msg.channel.send('Error')
        }

        msg.channel.send(Math.round(Math.abs(crypto.createHash('sha256').update(input[0] + input[1]).digest().readInt8() * 2 / 255 * 100)).toString() + ' af 100')
        // console.log(crypto.createHash('sha256').update(input[0] + input[1]).digest())
        // console.log(crypto.createHash('sha256').update(input[0] + input[1]).digest().readInt8())
    }
})

bot.on('message', msg=>{
    if (msg.content.includes('changeNick')) {
        if (!msg.guild.me.hasPermission('MANAGE_NICKNAMES')) return msg.channel.send('I don\'t have permission to change your nickname!');
        msg.member.setNickname(msg.content.replace('changeNick ', ''));
    }else if(msg.content === "G"){
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
    let args = msg.content.substring(PREFIX.length).split(" ");
    
    switch(args[0]) {
        case 'H':
            const name = msg.author.username;
            const embed = new Discord.MessageEmbed()
                .setAuthor('How long you got left in the void', )
                .addField("Who you askin about", msg.author.username)
                .addField("Hvenær þessi skilaboð voru send", msg.author.createdAt);

            msg.channel.send({embed});
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


});




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
                    console.log("bot joined the voice channel");
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




var bananas = ["Hinn heilaga Gumma guð", "Hinn heilaga Gumma sund", "Hinn heilaga prest Snæ", "Hinn heilaga Teit flugsunds eingil", "Hinn heilaga Gumma Krist"];

bot.on('message', msg=>{
    if(msg.content === "Ó góði botti hvern eigum við að biðja í dag?"){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '/' + mm + '/' + yyyy;
        const banana = Math.abs(crypto.createHash('sha256').update(today).digest().readInt8() % bananas.length);   
        console.log(banana)
        msg.reply(`\nÍ dag þann __${today}__ ætlum við að biðja til **${ bananas[banana] }**`)
        

    }else if(msg.content.startsWith("Ó góði botti hvern eigum við að biðja þann")){

        today = msg.content.substring(43).replace('?',"").replace(' ',"");
        const banana = Math.abs(crypto.createHash('sha256').update(today).digest().readInt8() % bananas.length);   
        console.log(banana)
        msg.reply(`\nÞann __${today}__ ætlum við að biðja til **${ bananas[banana] }**`)
        

    }else if(msg.content === "kirill spírill"){

            const spirill = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Kirill Spírill')
                .attachFiles(["https://media.giphy.com/media/w6KndnBTp3iIIPo5qY/giphy.gif"]);
    
    
            msg.channel.send(spirill);

    }else if(msg.content === "k mad"){

        const spirill = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Kirill is very mad')
            .attachFiles(["https://media.giphy.com/media/k0KY1jRlccXLIpjaZF/giphy.gif"]);


        msg.channel.send(spirill);
        }
    }
)


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





JamesBot = new Drive.Project("credentials.json", async JamesBot => {
    RawSundleykurinnData = await JamesBot.getFile(EndingsId)
    try{
        slash_com2.getVariables(bot, JamesBot, EndingsList)
        token = JSON.parse(fs.readFileSync("bot_Token.json"));
        bot.login(token);
        process.stdout.write("Bot login".green + " - " + `[..........] 0%`.red);
    }catch(e){
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the bot token: ', (Token_) => {
            rl.close();
            token = Token_;
            fs.writeFileSync('bot_Token.json', JSON.stringify(token));
            bot.login(token);
            process.stdout.write("Bot login".green + " - " + `[..........] 0%`.red);
        });
    }
})




bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}


/* bot.on('message', message => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'clear') {
        Playjs.execute(message, args);
    } else if (command === 'play') {
        Playjs.execute(message, args);
    } else if (command === 'leave') {
        Playjs.execute(message, args);
    }
}); */




bot.on('message', message => {
    if (message.content.toLowerCase().startsWith('bot_stats')){
        if(message.author.bot) return;
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
        message.channel.send(exampleEmbed);
    }
})





const distube = new DisTube(bot, { searchSongs: true, emitNewSongOnly: true });

bot.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const command = args.shift();

    if (command == "play")
        distube.play(message, args.join(" "));

    if (["repeat", "loop"].includes(command))
        distube.setRepeatMode(message, parseInt(args[0]));

    if (command == "stop") {
        distube.stop(message);
        message.channel.send("Stopped the music!");
    }

    if (command == "skip")
        distube.skip(message);

    if (command == "volume")
        distube.setVolume(message, args[0]);

    if (command == "queue") {
        let queue = distube.getQueue(message);
        message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n"));
    }

    if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
        let filter = distube.setFilter(message, command);
        message.channel.send("Current queue filter: " + (filter || "Off"));
    }
});

// Queue status template
const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

// DisTube event listeners, more in the documentation page
distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send(
        `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
    ))
    .on("addList", (message, queue, playlist) => message.channel.send(
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
    ))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("An error encountered: " + e);
    });