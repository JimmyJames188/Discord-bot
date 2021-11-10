const fs = require('fs');
const Discord = require("discord.js");
const Drive = require("..\\Storage\\Drive.js")
const cvs = require('canvas')


const delay = 1000
const EndingsId = '1CxeqpkqA238s1WYz83n88NK-GdwgIgtU';

let JamesBot = new Drive.Project("credentials.json", async JamesBot => {
})

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


exports.SundleikurinnData = {
    userData: {
        Endings: undefined
    },
    botData: {
        Endings: undefined
    },
    updatedDrive: false
}

/**
 * 
 * @param {Number} ending 
 * @param {'#A00000' | '#A0A000' | '#00A000'} color 
 * @param {Boolean} secret
 */
function create_ending_img(ending, color, secret = false){
    const folder = "img/ending.png"
    const width = 500;
    const height = 800;
    const lineWidth = height / 20
    const canvas = cvs.createCanvas(width + lineWidth, height + lineWidth)
    const context = canvas.getContext('2d')
    
    context.roundRect(lineWidth / 2, lineWidth / 2, width, height, 20)
    if(secret){
        context.fillStyle = color;
        context.fill()
        context.fillStyle = '#000000'
    }else{
        context.fillStyle = '#000000';
        context.fill()
        context.fillStyle = color
    }
    context.strokeStyle = '#000000'
    context.lineWidth = lineWidth;
    context.stroke()
    context.font = `bold ${70 * height / 200}pt Calibri`
    context.textBaseline = 'middle'
    context.textAlign = 'center'
    context.fillText(ending, (width + lineWidth) / 2, (height + lineWidth) / 2)
    fs.writeFileSync(folder, canvas.toBuffer())
    return folder
}

function name(member) {
    if(member.displayName){
        return member.displayName
    }
    return member.username
}

/**
 * @param {Discord.GuildMember} player
 * @param {Discord.Client} client
 * @param {Number} ending 
 * @param {'#A00000' | '#A0A000' | '#00A000'} color 
 * @param {Boolean} secret
 */
function ending_embed(player, client, ending, color, secret = false){
    let user = player;
    if(player.guild){
        user = player.user
    }
    const embededMSG = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(`Tilhamingju með að klára endingu n. ${ending} í fyrsta skipti`)
        .setAuthor(name(player), user.avatarURL())
        .setFooter("Takk fyrir að spila sundleikinn", client.user.avatarURL())
        .setImage('attachment://ending.png');

    return {
        embed: embededMSG,
        files: [{
            attachment: create_ending_img(ending, color, secret),
            name: 'ending.png'
        }]
    }
}


/**
 * 
 * @param {Discord.GuildMember} player 
 * @param {Discord.TextChannel} channel
 * @param {number} id
 * @param {{Endings: {UserId: String, User: Discord.User, Endings: Number[]}}} PlayerData
 * @param {number} Armn
 */
function Sundleikurinn(player, channel, id, PlayerData, Armn = 30){
    let collector = channel.createMessageCollector(m => m.author.id == player.id)
    switch(id){
        case 3:
            setTimeout(() => {
                channel.send("**Æfing er klukkan 17:30 í laugardalslauginni. Hvenær leggurðu af stað?** \n 1. 17:30 \n 2. 17:00 \n 3. 16:30 \n 4. Fara bara ekki")
                
                collector.on('collect', m =>{
                    
                    switch(m.content){
                        case '1':
                            collector.stop()
                            exports.Sundleikurinn(m.author, m.channel, 4, PlayerData)
                            break;
                        
                        case '2':
                            collector.stop()
                            exports.Sundleikurinn(m.author, m.channel, 10, PlayerData)
                            break;
                            
                        case '3':
                            collector.stop()
                            break;
                            
                        case '4':
                            collector.stop()
                            break;

                        default:
                            channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 4__`)

                    }

                })
            }, delay);
            break;
        
        case 4:
            channel.send("**Þú kemur of seint…**")
            setTimeout(() => {
                channel.send('**Bíbí er brjáluð! Hún lætur þig synda kílómetra flugsund með einni hendi. \nHvað viltu gera?** \n 1. Synda \n 2. Neita að synda')
                
                collector.on('collect', m =>{
                    switch(m.content){
                        case '1':
                            collector.stop()
                            exports.Sundleikurinn(m.author, m.channel, 6, PlayerData)
                            break;
                        
                        case '2':
                            collector.stop()
                            exports.Sundleikurinn(m.author, m.channel, 5, PlayerData)
                            break;
                            

                        default:
                            channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 2__`)
                    }
                })
                
            }, delay);
            break;
            
        case 5:
            channel.send("**Bíbí ræðst á þig og drekkir þig í sundlauginni - Endir (1)**")
            if(PlayerData.Endings.Endings.length == 0){
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")

                PlayerData.Endings.Endings.push(1)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                return;

            }else{

                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                    if(PlayerData.Endings.Endings[i] == 1){
                        return;
                    }
                }

                PlayerData.Endings.Endings.push(1)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")

                channel.send("", ending_embed(player, channel.client, 1, "#A00000", false))

            }
            break;
            
        case 6:
            channel.send('**Það er svo mikið álag á hendinni að hún dettur af! Þú sekkur á botninn á lauginni. Einmitt þegar þú hefur sætt þig við dauðann stingur Snær sér ofaní lauginna og blæs á þig svo að þú flýgur upp úr lauginni! Hann tekur þig svo upp með litlu tánni sinni og endurlífgar þig með… Hvað á hann að nota til þess að bjarga þér?** \n 1. Lysi \n 2. CPR \n 3. Syngur fyrir þig KR lagið')
            collector.on('collect', m =>{
                switch(m.content){
                    case '1':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 7, PlayerData)
                        break;
                    
                    case '2':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 8, PlayerData)
                        break;

                    case '3':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 9, PlayerData)
                        break;
                            
                    case '4':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 31, PlayerData)
                        break;

                    default:
                        channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 4__`)
                }
            })

            break;

            case 7:
                channel.send('**Hann gefur þér afbragðs lýsi frá Siglufirði þannig að þú finnur krafta þína streyma um líkamann og þú grærð nýja hendi! Heilinn þinn stækkar fimmfalt og þú verður Íslandsmestari í sundi - Endir (2)**')
                if(PlayerData.Endings.Endings.length == 0){

                    PlayerData.Endings.Endings.push(2)
                    JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                    console.log("New ending has been added to user");
                    console.log("Updated player data")
                    channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                    return;
    
                }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                        if(PlayerData.Endings.Endings[i] == 2){
                            return;
                        }
                    }
    
                    PlayerData.Endings.Endings.push(2)
                    JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                    console.log("New ending has been added to user");
                    console.log("Updated player data")
                    channel.send("", ending_embed(player, channel.client, 2, "#00A000", false))
    
                }
    
                break;

            case 8:
                channel.send('**Snær gerir það of fast og hendin hans fer í gegnum þig - Endir (3)**')
                
                if(PlayerData.Endings.Endings.length == 0){

                    PlayerData.Endings.Endings.push(3)
                    JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                    console.log("New ending has been added to user");
                    console.log("Updated player data")
                    channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                    return;
    
                }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                        if(PlayerData.Endings.Endings[i] == 3){
                            return;
                        }
                    }
    
                    PlayerData.Endings.Endings.push(3)
                    JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                    console.log("New ending has been added to user");
                    console.log("Updated player data")
                    channel.send("", ending_embed(player, channel.client, 3, "#A00000", false))
    
                }
        
                break;



            case 9:
                channel.send('**Hann syngur fyrir þér og þú fyllist af ást fyrir KR og grærð hendina til baka. Þú færð lagið á heilann restina af æfingunni - Endir (4)**')

                if(PlayerData.Endings.Endings.length == 0){

                    PlayerData.Endings.Endings.push(4)
                    JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                    console.log("New ending has been added to user");
                    console.log("Updated player data")
                    channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                    return;
    
                }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                        if(PlayerData.Endings.Endings[i] == 4){
                            return;
                        }
                    }
    
                    PlayerData.Endings.Endings.push(4)
                    JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                    console.log("New ending has been added to user");
                    console.log("Updated player data")
                    channel.send("", ending_embed(player, channel.client, 4, "#A0A000", false))
    
                }
            
                break;



        case 10:
            channel.send("**Þú kemur á réttum tíma og Bíbí er glöð!**")
            setTimeout(() => {
                channel.send("**Eftir langa og góða æfingu spyr sundfélaginn þinn þig hvort þú viljir koma í pottinn. \nViltu fara með honum?** \n 1. Fara í pottinn \n 2. Afþakka boðið")
                
                collector.on('collect', m =>{
                    
                    switch(m.content){
                        case '1':
                            collector.stop()
                            exports.Sundleikurinn(m.author, m.channel, 11, PlayerData)
                            break;
                        
                        case '2':
                            collector.stop()
                            exports.Sundleikurinn(m.author, m.channel, 13, PlayerData)
                            break;

                        default:
                            channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 2__`)

                    }

                })
            }, delay);
            break;

        case 11:
            channel.send("**Þú ferð í pottinn en það eru minnst 30 ármenningar í pottinum! Hvað viltu gera?** \n 1. Bíða eftir að þeir fari úr pottinum  \n 2. Fara bara heim \n 3. Biðja þá um að fara úr pottinum")
            
            collector.on('collect', m =>{
                
                switch(m.content){
                    case '1':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 12, PlayerData)
                        break;
                    
                    case '2':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 13, PlayerData)
                        break;
                    
                    case '3':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 14, PlayerData)
                        break;

                    default:
                        channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 3__`)

                }

            })
            break;
        
        case 12:
            channel.send("**Vinur þinn nennir ekki að bíða og hann fer en þú neitar að fara. Þú bíður og bíður og bíður þangað til að lokum þú sveltur í hel - Endir (5)**")
            if(PlayerData.Endings.Endings.length == 0){

                PlayerData.Endings.Endings.push(5)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;

            }else{

                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                    if(PlayerData.Endings.Endings[i] == 5){
                        return;
                    }
                }

                PlayerData.Endings.Endings.push(5)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 5, "#A00000", false))

            }
            break;
        
        case 13:
            channel.send("**Þú ferð heim og ekkert sérstakt gerist - Endir (6)**")
            if(PlayerData.Endings.Endings.length == 0){

                PlayerData.Endings.Endings.push(6)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;

            }else{
    
                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                    if(PlayerData.Endings.Endings[i] == 6){
                        return;
                    }
                }
    
                PlayerData.Endings.Endings.push(6)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 6, "#A0A000", false))
            }
            break;

        case 14:
            channel.send("**Þú biður þá um að fara. Oh oh! Þeir eru ekki ánægðir! Hvað viltu gera?** \n 1. Fara í slag til þess að vinna pottinn  \n 2. Hlaupa í burtu \n 3. Reyna að róa þá \n 4. Reyna að fá þá út úr pottinum til þess að ýta þeim ofaní sundlauginna")
            
            collector.on('collect', m =>{
                
                switch(m.content){
                    case '1':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 15, PlayerData)
                        break;
                    
                    case '2':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 32, PlayerData)
                        break;
                    
                    case '3':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 37, PlayerData)
                        break;
                    
                    case '4':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 40, PlayerData)
                        break;

                    default:
                        channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 4__`)

                }

            })
            break;

        case 15:
            channel.send("**Hvernig viltu berjast?** \n 1. Fá lýsi frá Snæ  \n 2. Láta sundfélagann þinn berjast fyrir þig \n 3. Skora á þá alla í boðsun \n 4. Skora á þá í rússneska rúllettu")
            
            collector.on('collect', m =>{
                
                switch(m.content){
                    case '1':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 23, PlayerData)
                        break;
                    
                    case '2':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 24, PlayerData)
                        break;
                    
                    case '3':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 25, PlayerData)
                        break;
                    
                    case '4':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 16, PlayerData)
                        break;

                    default:
                        channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 4__`)

                }

            })
            break;

        case 16:
            channel.send("**Þið semjið um að allir gera einu sinni og liðið með flesta leikmenn miðað við liðsfjöldann á lífi vinnur. Ef það er jafntefli fær árman að halda pottin því að þeir mættu fyrst.**")
            setTimeout(() => {
                if(Math.floor(Math.random() * 6) == 0){
                    if(Math.floor(Math.random() * 6) == 0){
                        exports.Sundleikurinn(player, channel, 17, PlayerData)
                    }else{
                        exports.Sundleikurinn(player, channel, 20, PlayerData)
                    }
                }else{
                    for (let i = 0; i <= 30; i++) {
                        if(Math.floor(Math.random() * 6) == 0){
                            Armn--;
                        }
                    }
                    if(Math.floor(Math.random() * 6) == 0){
                        if(Armn < 15){
                            exports.Sundleikurinn(player, channel, 18, PlayerData)
                        }else{
                            exports.Sundleikurinn(player, channel, 19, PlayerData)
                        }
                    }else{
                        if(Armn == 30){
                            exports.Sundleikurinn(player, channel, 22, PlayerData)
                        }else{
                            exports.Sundleikurinn(player, channel, 21, PlayerData, Armn)
                        }
                    }
                }
            }, delay);
            break;
    
        case 17:
            channel.send("**Þú og vinur þinn báðir deyið og þið fáið aldrei að vita hversu margir dóu hjá Ármenningunum - Endir (7)**")
            if(PlayerData.Endings.Endings.length == 0){

                PlayerData.Endings.Endings.push(7)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;

            }else{

                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                    if(PlayerData.Endings.Endings[i] == 7){
                        return;
                    }
                }

                PlayerData.Endings.Endings.push(7)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 7, "#A00000", true))

            }
            break;
    
        case 18:
            channel.send("**Sundfélaginn þinn deyr en þú vinnur. Þú fékkst pottinn en æfingarnar verða aldrei eins - Endir (8)**", {
                files: [{
                    attachment: 'img\\IHWBWC.jpg',
                    name: 'IHWBWC.jpg'
                }]
            })
            if(PlayerData.Endings.Endings.length == 0){

                PlayerData.Endings.Endings.push(8)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;

            }else{

                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                    if(PlayerData.Endings.Endings[i] == 8){
                        return;
                    }
                }

                PlayerData.Endings.Endings.push(8)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 8, "#A0A000", true))

            }
            break;
    
        case 19:
            channel.send("**Sundfélaginn þinn deyr og þið tapið. Þú ferð heim og fellur í þunglyndi og byrjar að drekka. Að lokum fremurðu sjálfsmorð - Endir (9)**")
            if(PlayerData.Endings.Endings.length == 0){

                PlayerData.Endings.Endings.push(9)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;

            }else{

                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                    if(PlayerData.Endings.Endings[i] == 9){
                        return;
                    }
                }

                PlayerData.Endings.Endings.push(9)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 9, "#A00000", false))

            }
            break;
    
        case 20:
            channel.send("**Þú deyrð og færð aldrei að vita hvað gerist næst - Endir (10)**")
            if(PlayerData.Endings.Endings.length == 0){

                PlayerData.Endings.Endings.push(10)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;

            }else{

                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                    if(PlayerData.Endings.Endings[i] == 10){
                        return;
                    }
                }

                PlayerData.Endings.Endings.push(10)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 10, "#A00000", false))

            }
            break;
    
        case 21:
            channel.send("**Hvorugur ykkar deyr en " + (30 - Armn) + " ármenningar/ur deyja/deyr þannig að þið vinnið. Þið komist í pottinn og slakið á. Þið íhugið lífið ykkar og talið um hvað þið ætlið að fá ykkur í kvöldmat - Endir (11)**")
            if(PlayerData.Endings.Endings.length == 0){

                PlayerData.Endings.Endings.push(11)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;

            }else{

                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                    if(PlayerData.Endings.Endings[i] == 11){
                        return;
                    }
                }

                PlayerData.Endings.Endings.push(11)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 11, "#00A000", false))

            }
            break;
    
        case 22:
            channel.send("**Engin deyr og ármeningar fá að halda pottin. Þið farið bara heim vonsviknir og í smávegis í áfalli - Endir (12)**")
            if(PlayerData.Endings.Endings.length == 0){

                PlayerData.Endings.Endings.push(12)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;

            }else{

                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                    if(PlayerData.Endings.Endings[i] == 12){
                        return;
                    }
                }

                PlayerData.Endings.Endings.push(12)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 12, "#A0A000", true))

            }
            break;
        
            case 23:
            channel.send("**Þú kallar á Snæ og hann kemur fljúgandi með lýsi í hendi! Þú rétt svo snertir hvern og einn og þeir skjótast upp í loftið og festast í þakinu. Þið fáið pottinn! - Endir (13)**")
            if(PlayerData.Endings.Endings.length == 0){

                PlayerData.Endings.Endings.push(13)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;

            }else{

                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                    if(PlayerData.Endings.Endings[i] == 13){
                        return;
                    }
                }

                PlayerData.Endings.Endings.push(13)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 13, "#00A000", false))

            }
            break;

        case 24:
            channel.send("**Þú ýtir sundfélaganum þínum í pottinn og segir honum að berja þá. Ármenningarnir stökkva allir ofan á hann og það sést ekkert í hann í heila mínútu. Svo fara þeir allir frá og þú sérð að það eina eftir af vini þínum er bara eyra. Ármenningarnir horfa allir á þig og stökkva… - Endir (14)**")
            if(PlayerData.Endings.Endings.length == 0){
    
                PlayerData.Endings.Endings.push(14)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;
    
            }else{
    
                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                       if(PlayerData.Endings.Endings[i] == 14){
                         return;
                    }
                }
    
                PlayerData.Endings.Endings.push(14)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 14, "#A00000", false))
    
            }
            break;

        case 25:
            channel.send("**Þið skorið á þá í skólabaksunds boðsundi. Þið ákvarðið að hver ármenningur fari 25 metra sem þýðir það að þú og vinur þinn skiptið á milli ykkar samtals 750 metra. Þið ákvarðið að synda bara allt í einu og þú byrjar.**")

            setTimeout(() => {
                channel.send("**Þú tekur góða stungu og byrjar vel. Það líða tveir klukkutímar og þú ert á loka 50 metrunum! Þú byrjar að spretta og klárar! Sundfélaginn þinn stekkur ofaní með glæsilegan snúning í loftinu! Þú bíður í tvo klukkutíma eftir að vinur þinn klári. Hann er á loka metrunum!**")

                setTimeout(() => {
                    channel.send("**Þið vinnið!**")                    
                    
                    setTimeout(() => {
                        channel.send("**Oh oh! Klukkan er orðin rosa margt! Sundlaugin er lokuð! Hvað viltu gera?** \n 1. Reyna að brjótast út  \n 2. Reyna að finna stað til þess að hanga þangað til að laugin opnar um morguninn")
                        
                        collector.on('collect', m =>{
                            
                            switch(m.content){
                                case '1':
                                    collector.stop()
                                    exports.Sundleikurinn(m.author, m.channel, 26, PlayerData)
                                    break;
                                
                                case '2':
                                    collector.stop()
                                    exports.Sundleikurinn(m.author, m.channel, 30, PlayerData)
                                    break;

                                default:
                                    channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 2__`)

                            }

                        })
                    }, delay/2)
                }, delay)
            }, delay)
            break;

        case 26:
            channel.send("**Þið reynið að brjóta öll gler í laugardalslauginni til þess að komast út en ekkert þeirra brotnar! Þið finnið takkann í tæknibúrinu sem opnar þakið. ⁷Þið opnið það og klifrið út. Æ æ! Fólk í nágrenninu hefur hringt í lögregluna! Lögreglan heldur að þið séuð að brjótast inn í laugina. Hvað viltu gera?** \n 1. Hoppa ofan í laugina og reyna að finna felustað  \n 2. Gefast upp \n 3. Hlaupa upp á Hrafnistu og fela þig þar")
            
            collector.on('collect', m =>{
                
                switch(m.content){
                    case '1':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 28, PlayerData)
                        break;
                    
                    case '2':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 29, PlayerData)
                        break;
                    
                    case '3':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 27, PlayerData)
                        break;

                    default:
                        channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 3__`)

                }

            })
            break;

        case 27:
            channel.send("**Þið hoppið niður af laugardalslauginni og lendið í runna fyrir aftan laugina. Þið hlaupið! Þið felið ykkur á Hrafnistu í tvo daga og farið svo heim - Endir (15)**")
            if(PlayerData.Endings.Endings.length == 0){
    
                PlayerData.Endings.Endings.push(15)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;
    
            }else{
    
                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                       if(PlayerData.Endings.Endings[i] == 15){
                         return;
                    }
                }
    
                PlayerData.Endings.Endings.push(15)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 15, "#A0A000", false))
    
            }
            break;

        case 28:
            channel.send("**Þið hoppið ofaní laugina og ætlið að synda upp að bakkanum en þið takið eftir hlera á botninum í lauginni! Þið opnið hann og farið inn. Inni er falið herbergi þar sem það er heill stafli af gulli og peningum! Þetta er eins og að koma inn í peningageyminn hans Jóakims Aðalandar! Þú skiptir ágóðanum með félaganum þínum og þið verðið rosalega ríkir! - Endir (16)**")
            if(PlayerData.Endings.Endings.length == 0){
    
                PlayerData.Endings.Endings.push(16)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;
    
            }else{
    
                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                       if(PlayerData.Endings.Endings[i] == 16){
                         return;
                    }
                }
    
                PlayerData.Endings.Endings.push(16)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 16, "#00A000", false))
    
            }
            break;

        case 29:
            channel.send("**Þið gefist upp og farið í fangelsi í tvö ár - Endir (17)**")
            if(PlayerData.Endings.Endings.length == 0){
    
                PlayerData.Endings.Endings.push(17)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;
    
            }else{
    
                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                       if(PlayerData.Endings.Endings[i] == 17){
                         return;
                    }
                }
    
                PlayerData.Endings.Endings.push(17)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 17, "#A00000", false))
    
            }
            break;

        case 30:
            channel.send("**Þið ákvarðið að bíða til morguns með að reyna að komast út því að þið vitið að allar útidyrahurðir séu lokaðar. Þið farið niður í þreksalinn til þess að ná í dýnurnar þar og farið með þær undir áhorfendapallana. Þið sofið þar. Þið vaknið við óhljóðin í hana! Þú fattar að þú sért niðurkomin/n í miðjan húsdýragarðinn! Starfsfólkið neitar að hleypa þér út þannig að þú lifir restina af lífinu þínu hjá selunum - Endir (18)**")
            if(PlayerData.Endings.Endings.length == 0){
        
                PlayerData.Endings.Endings.push(18)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;
    
            }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                       if(PlayerData.Endings.Endings[i] == 18){
                         return;
                    }
                }
        
                PlayerData.Endings.Endings.push(18)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 18, "#A00000", false))
    
            }
            break;

        case 31:
            channel.send("**Snær reynir að bjarga þér en er allt of seinn. Þegar allir halda að þetta sé búið birtist Gummi Guð. Honum fynnst ekki sanngjarn að þú náðir ekki að klára refsinguna og semur við Gjöfullin að hann leifi þér að koma aftur til Jarðar en þú munt þurfa að stofna kult og forna 100 túristum og hann mun gefa þér öfl til að hjálpa þér**")
            
            setTimeout(() => {
                channel.send("**Þú gerir eins og hann segir og fórnar 100 túristum með því að nota öldur til að drekkja þá í Vík og lifir svo sem ódauðlegur maður með yfirnáttúrulega krafta - Endir (19)**")
                if(PlayerData.Endings.Endings.length == 0){
        
                    PlayerData.Endings.Endings.push(19)
                    JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                    console.log("New ending has been added to user");
                    console.log("Updated player data")
                    channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                    return;
        
                }else{
        
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                        if(PlayerData.Endings.Endings[i] == 19){
                            return;
                        }
                    }
        
                    PlayerData.Endings.Endings.push(19)
                    JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                    console.log("New ending has been added to user");
                    console.log("Updated player data")
                    channel.send("", ending_embed(player, channel.client, 19, "#00A000", true))
        
                }
            }, delay)
            break;

        case 32:
            channel.send("**Þú snýrð þér við og hleypur! Vinurinn þinn gerir hið sama. Hvað viltu gera?** \n 1. Hlaupa út um innganginn \n 2. Reyna fela þig eitthvernsstaðar")
            
            collector.on('collect', m =>{
                
                switch(m.content){
                    case '1':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 33, PlayerData)
                        break;
                    
                    case '2':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 34, PlayerData)
                        break;
                    

                    default:
                        channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 2__`)

                }

            })
            break;

        case 33:
            channel.send("**Þú reynir að hlaupa út um innganginn en hrasar og klessir á vegg. Birgir (með g) fyrir óþekktar ástæður er einmitt á leiðinni út og bjargar þér og vini þínum - Endir (20)**")
            if(PlayerData.Endings.Endings.length == 0){
        
                PlayerData.Endings.Endings.push(20)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;
    
            }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                       if(PlayerData.Endings.Endings[i] == 20){
                         return;
                    }
                }
        
                PlayerData.Endings.Endings.push(20)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 20, "#00A000", false))
    
            }
            break;

        case 34:
            channel.send("**Hvar viltu fela þig?** \n 1. Í tæknibúrinu \n 2. Í skáp niðri í klefanu")
            
            collector.on('collect', m =>{
                
                switch(m.content){
                    case '1':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 35, PlayerData)
                        break;
                    
                    case '2':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 36, PlayerData)
                        break;
                    

                    default:
                        channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 3__`)

                }

            })
            break;

        case 35:
            channel.send("**Þú hleypur inn í tæknibúrið! Oh oh! Þú rakst í takkann sem kveikir á eldflaugunum undir lauginni sem sendir laugardalslaugina til mars! - Endir (21)**")
            if(PlayerData.Endings.Endings.length == 0){
        
                PlayerData.Endings.Endings.push(21)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;
    
            }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                       if(PlayerData.Endings.Endings[i] == 21){
                         return;
                    }
                }
        
                PlayerData.Endings.Endings.push(21)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 21, "#00A000", false))
    
            }
            break;

        case 36:
            channel.send("**Þú hleypur inn í klefann og finnur stóran skáp. Þú kemur þér fyrir og lokar skápnum! Oh oh! Ármenningarnir læstu skápnum! Þeir fara síðan með lykilinn í pottinn og hanga þar. Þú sveltur í hel - Endir (22)**")
            if(PlayerData.Endings.Endings.length == 0){
        
                PlayerData.Endings.Endings.push(22)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;
    
            }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                       if(PlayerData.Endings.Endings[i] == 22){
                         return;
                    }
                }
        
                PlayerData.Endings.Endings.push(22)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 22, "#A00000", false))
            }
            break;

        case 37:
            channel.send("**Hvernig viltu róa þá?** \n 1. Gefa þeim róandi töflur \n 2. Syngja islenska þjóðsönginn")
            
            collector.on('collect', m =>{
                
                switch(m.content){
                    case '1':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 38, PlayerData)
                        break;
                    
                    case '2':
                        collector.stop()
                        exports.Sundleikurinn(m.author, m.channel, 39, PlayerData)
                        break;
                    

                    default:
                        channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 2__`)

                }

            })
            break;

        case 38:
            channel.send("**Þú dregur út róandi töflurnar sem þú ert með í vasanum (ekki spyrja) og kastar þeim í munnana þeirra allra. Þeir róast samstundis og leyfa þér að sitja hjá sér í pottinum - Endir (23)**")
            if(PlayerData.Endings.Endings.length == 0){
        
                PlayerData.Endings.Endings.push(23)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;
    
            }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                       if(PlayerData.Endings.Endings[i] == 23){
                         return;
                    }
                }
        
                PlayerData.Endings.Endings.push(23)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 23, "#00A000", false))
    
            }
            break;

        case 39:
            channel.send("**Þú byrjar að syngja íslenska þjóðsönginn en þeir festa límband fyrir munninn á þér! Æ æ þú manst allt í einu það sem þér var kennt í leikskóla! Ármenningar eru allir danskir og því hata íslenska þjóðsönginn vegna þess að það minnir þá á að þeir réðu einu sinni yfir okkur! - Endir (24)**")
            if(PlayerData.Endings.Endings.length == 0){
        
                PlayerData.Endings.Endings.push(24)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;
    
            }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                       if(PlayerData.Endings.Endings[i] == 24){
                         return;
                    }
                }
        
                PlayerData.Endings.Endings.push(24)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 24, "#A00000", false))
    
            }
            break;

        case 40:
            channel.send("**Þú lokkar þá úr pottinum með gull hatti! Þeir hoppa allir út úr pottinum og glápa á hattinn. Þegar þeir eru allir komnir við hliðina á lauginni flýgur Snær inn og slær þá alla í sundlaugina! Þeir drukkna allir því að þeir kunna ekki að synda - Endir (25)**")
            if(PlayerData.Endings.Endings.length == 0){
        
                PlayerData.Endings.Endings.push(25)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;
    
            }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                       if(PlayerData.Endings.Endings[i] == 25){
                         return;
                    }
                }
        
                PlayerData.Endings.Endings.push(25)
                JamesBot.editFile(EndingsId, JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '))

                console.log("New ending has been added to user");
                console.log("Updated player data")
                channel.send("", ending_embed(player, channel.client, 25, "#00A000", false))
    
            }
            break;

        
    }
}
exports.Sundleikurinn = Sundleikurinn;