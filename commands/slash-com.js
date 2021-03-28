const Discord = require('discord.js');
json = {
    name: "gskuld",
    description: "Get or edit permissions for a user or a role",
    options: []
}

/**
 * 
 * @param {Discord.Client} client 
 * @param {{gskuld: (data: {}, user: Discord.User, member: Discord.GuildMember) => Promise<String>}} commands
 */
function send_commands(client, commands){

    client.api.applications(client.user.id).guilds('701873712370286722').commands.post({data: json})
    client.ws.on('INTERACTION_CREATE', async interaction => { 
        if(interaction.data.name == 'gskuld'){
            if(interaction.member){
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: await commands.gskuld(interaction.data, interaction.member.user, interaction.member)
                    }
                }})
            }else {
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: await commands.gskuld(interaction.data, interaction.user, undefined)
                    }
                }})
            }
        }  
        // console.log(interaction);
        // new Discord.WebhookClient(client.user.id, interaction.token).send('hello world')
    })
}
exports.send_commands = send_commands;