const Discord = require('discord.js');
json = {
    name: "gskuld",
    description: "How much do you own to the Gjöfull",
    options: [{
        "name": "user",
        "description": "User to check",
        "type": 6, 
        "required": false
    }]
}

/**
 * 
 * @param {Discord.Client} client 
 * @param {{gskuld: (data: {}, user: Discord.User) => Promise<String>}} commands
 */
function send_commands(client, commands){

    client.api.applications(client.user.id).guilds('701873712370286722').commands.post({data: json})
    client.ws.on('INTERACTION_CREATE', async interaction => { 
        if(interaction.data.name == 'gskuld'){
            if(interaction.member){
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: await commands.gskuld(interaction.data, interaction.member.user)
                    }
                }})
            }else {
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: await commands.gskuld(interaction.data, interaction.user)
                    }
                }})
            }
        }  
        // console.log(interaction.data);
        // new Discord.WebhookClient(client.user.id, interaction.token).send('hello world')
    })
}
exports.send_commands = send_commands;