const fs = require('fs');

const Discord = require("discord.js");


const delay = 1000


exports.SundleikurinnData = {
    userData: {
        Endings: undefined
    }
}

/**
 * 
 * @param {Discord.GuildMember} player 
 * @param {Discord.TextChannel} channel
 * @param {number} id
 * @param {{Endings: {UserId: String, User: Discord.User, Endings: Number[]}}} PlayerData
 */
function Sundleikurinn(player, channel, id, PlayerData){
    collector = channel.createMessageCollector(m => m.author == player.user)
    switch(id){
        case 3:
            setTimeout(() => {
                channel.send("**Æfing er klukkan 17:30 í laugardalslauginni. Hvenær leggurðu af stað?** \n 1. 17:30 \n 2. 17:00 \n 3. 16:30 \n 4. Fara bara ekki")
                
                collector.on('collect', m =>{
                    
                    switch(m.content){
                        case '1':
                            collector.stop()
                            exports.Sundleikurinn(m.member, m.channel, 4, PlayerData)
                            break;
                        
                        case '2':
                            collector.stop()
                            exports.Sundleikurinn(m.member, m.channel, 10, PlayerData)
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
                            exports.Sundleikurinn(m.member, m.channel, 6, PlayerData)
                            break;
                        
                        case '2':
                            collector.stop()
                            exports.Sundleikurinn(m.member, m.channel, 5, PlayerData)
                            break;
                            

                        default:
                            channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 2__`)
                    }
                })
                
            }, delay);
            break;
            
        case 5:
            channel.send("**Bíbí ræðst á þig og drekkir þig í sundlauginni - Endir**")
            if(PlayerData.Endings.Endings.length == 0){

                PlayerData.Endings.Endings.push(1)
                fs.writeFile("Storage\\Sundleikurinn\\userData\\Endings.json", JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '), function (err) {
                    if (err){console.error(err); return 0}; 
                    console.log("New ending has been added to user");
                });
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;

            }else{

                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                    if(PlayerData.Endings.Endings[i] == 1){
                        return;
                    }
                }

                PlayerData.Endings.Endings.push(1)
                fs.writeFile("Storage\\Sundleikurinn\\userData\\Endings.json", JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '), function (err) {
                    if (err){console.error(err); return 0}; 
                    console.log("New ending has been added to user");
                });
                channel.send("**Til hamingju með að klára endinguna n. 1 í fyrsta skipti!**")

            }
            break;
            
        case 6:
            channel.send('**Það er svo mikið álag á hendinni að hún dettur af! Þú sekkur á botninn á lauginni. Einmitt þegar þú hefur sætt þig við dauðann stingur Snær sér ofaní lauginna og blæs á þig svo að þú flýgur upp úr lauginni! Hann tekur þig svo upp með litlu tánni sinni og endurlífgar þig með… Hvað á hann að nota til þess að bjarga þér?** \n 1. Lysi \n 2. CPR \n 3. Syngur fyrir þig KR lagið')
            collector.on('collect', m =>{
                switch(m.content){
                    case '1':
                        collector.stop()
                        exports.Sundleikurinn(m.member, m.channel, 7, PlayerData)
                        break;
                    
                    case '2':
                        collector.stop()
                        exports.Sundleikurinn(m.member, m.channel, 8, PlayerData)
                        break;

                        case '3':
                            collector.stop()
                            exports.Sundleikurinn(m.member, m.channel, 9, PlayerData)
                            break;

                    default:
                        channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 2__`)
                }
            })

            break;

            case 7:
                channel.send('**Hann gefur þér afbragðs lýsi frá Siglufirði þannig að þú finnur krafta þína streyma um líkamann og þú grærð nýja hendi! Heilinn þinn stækkar fimmfalt og þú verður Íslandsmestari í sundi - Endir**')
                if(PlayerData.Endings.Endings.length == 0){

                    PlayerData.Endings.Endings.push(2)
                    fs.writeFile("Storage\\Sundleikurinn\\userData\\Endings.json", JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '), function (err) {
                        if (err){console.error(err); return 0}; 
                        console.log("New ending has been added to user");
                    });
                    channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                    return;
    
                }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                        if(PlayerData.Endings.Endings[i] == 2){
                            return;
                        }
                    }
    
                    PlayerData.Endings.Endings.push(2)
                    fs.writeFile("Storage\\Sundleikurinn\\userData\\Endings.json", JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '), function (err) {
                        if (err){console.error(err); return 0}; 
                        console.log("New ending has been added to user");
                    });
                    channel.send("**Til hamingju með að klára endinguna n. 2 í fyrsta skipti!**")
    
                }
    
                break;

            case 8:
                channel.send('**Snær gerir það of fast og hendin hans fer í gegnum þig - Endir**')
                
                if(PlayerData.Endings.Endings.length == 0){

                    PlayerData.Endings.Endings.push(3)
                    fs.writeFile("Storage\\Sundleikurinn\\userData\\Endings.json", JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '), function (err) {
                        if (err){console.error(err); return 0}; 
                        console.log("New ending has been added to user");
                    });
                    channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                    return;
    
                }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                        if(PlayerData.Endings.Endings[i] == 3){
                            return;
                        }
                    }
    
                    PlayerData.Endings.Endings.push(3)
                    fs.writeFile("Storage\\Sundleikurinn\\userData\\Endings.json", JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '), function (err) {
                        if (err){console.error(err); return 0}; 
                        console.log("New ending has been added to user");
                    });
                    channel.send("**Til hamingju með að klára endinguna n. 3 í fyrsta skipti!**")
    
                }
        
                break;



            case 9:
                channel.send('**Hann syngur fyrir þér og þú fyllist af ást fyrir KR og grærð hendina til baka. Þú færð lagið á heilann restina af æfingunni - Endir**')

                if(PlayerData.Endings.Endings.length == 0){

                    PlayerData.Endings.Endings.push(4)
                    fs.writeFile("Storage\\Sundleikurinn\\userData\\Endings.json", JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '), function (err) {
                        if (err){console.error(err); return 0}; 
                        console.log("New ending has been added to user");
                    });
                    channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                    return;
    
                }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                        if(PlayerData.Endings.Endings[i] == 4){
                            return;
                        }
                    }
    
                    PlayerData.Endings.Endings.push(4)
                    fs.writeFile("Storage\\Sundleikurinn\\userData\\Endings.json", JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '), function (err) {
                        if (err){console.error(err); return 0}; 
                        console.log("New ending has been added to user");
                    });
                    channel.send("**Til hamingju með að klára endinguna n. 4 í fyrsta skipti!**")
    
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
                            exports.Sundleikurinn(m.member, m.channel, 11, PlayerData)
                            break;
                        
                        case '2':
                            collector.stop()
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
                        exports.Sundleikurinn(m.member, m.channel, 12, PlayerData)
                        break;
                    
                    case '2':
                        collector.stop()
                        exports.Sundleikurinn(m.member, m.channel, 13, PlayerData)
                        break;
                    
                    case '3':
                        collector.stop()
                        exports.Sundleikurinn(m.member, m.channel, 14, PlayerData)
                        break;

                    default:
                        channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 2__`)

                }

            })
            break;
        
        case 12:
            channel.send("**Vinur þinn nennir ekki að bíða og hann fer en þú neitar að fara. Þú bíður og bíður og bíður þangað til að lokum þú sveltur í hel - Endir**")
            if(PlayerData.Endings.Endings.length == 0){

                PlayerData.Endings.Endings.push(5)
                fs.writeFile("Storage\\Sundleikurinn\\userData\\Endings.json", JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '), function (err) {
                    if (err){console.error(err); return 0}; 
                    console.log("New ending has been added to user");
                });
                channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                return;

            }else{

                for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                    if(PlayerData.Endings.Endings[i] == 5){
                        return;
                    }
                }

                PlayerData.Endings.Endings.push(5)
                fs.writeFile("Storage\\Sundleikurinn\\userData\\Endings.json", JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '), function (err) {
                    if (err){console.error(err); return 0}; 
                    console.log("New ending has been added to user");
                });
                channel.send("**Til hamingju með að klára endinguna n. 5 í fyrsta skipti!**")

            }
            break;
        
            case 13:
                channel.send("**Þú ferð heim og ekkert sérstakt gerist - Endir**")
                if(PlayerData.Endings.Endings.length == 0){
    
                    PlayerData.Endings.Endings.push(6)
                    fs.writeFile("Storage\\Sundleikurinn\\userData\\Endings.json", JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '), function (err) {
                        if (err){console.error(err); return 0}; 
                        console.log("New ending has been added to user");
                    });
                    channel.send("**Til hamingju með að klára fyrstu endinguna!**")
                    return;
    
                }else{
    
                    for (let i = 0; i < PlayerData.Endings.Endings.length; i++) {
                        if(PlayerData.Endings.Endings[i] == 6){
                            return;
                        }
                    }
    
                    PlayerData.Endings.Endings.push(6)
                    fs.writeFile("Storage\\Sundleikurinn\\userData\\Endings.json", JSON.stringify(exports.SundleikurinnData.userData.Endings, ['UserId', 'Endings'], '\t').replace(/\[\n\t\t\t/g, '[').replace(/\n\t\t\]/g, ']').replace(/,\n\t\t\t/g, ', '), function (err) {
                        if (err){console.error(err); return 0}; 
                        console.log("New ending has been added to user");
                    });
                    channel.send("**Til hamingju með að klára endinguna n. 6 í fyrsta skipti!**")
    
                }
                break;

            case 16:
                channel.send("**Þú ferð í pottinn en það eru minnst 30 ármenningar í pottinum! Hvað viltu gera?** \n 1. Bíða eftir að þeir fari úr pottinum  \n 2. Fara bara heim \n 3. Biðja þá um að fara úr pottinum")
                
                collector.on('collect', m =>{
                    
                    switch(m.content){
                        case '1':
                            collector.stop()
                            exports.Sundleikurinn(m.member, m.channel, 12, PlayerData)
                            break;
                        
                        case '2':
                            collector.stop()
                            exports.Sundleikurinn(m.member, m.channel, 13, PlayerData)
                            break;
                        
                        case '3':
                            collector.stop()
                            exports.Sundleikurinn(m.member, m.channel, 14, PlayerData)
                            break;

                        default:
                            channel.send(`__${m.content} er ekki valmöguleiki. Veldu tölu frá 1 - 2__`)

                    }

                })
                break;
    }
}
exports.Sundleikurinn = Sundleikurinn;