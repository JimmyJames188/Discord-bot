const Discord = require('discord.js');
const fs = require('fs')
const json = JSON.parse(fs.readFileSync('commands/slash_com.json'))



/**
 * 
 * @param {Discord.Client} client 
 * @param {String} guild_id
 */
function send_commands_guild(client, guild_id){
    json.forEach(command_ => {
        client.api.applications(client.user.id).guilds(guild_id).commands.post({data: command_})
    });
}
exports.send_commands_guild = send_commands_guild;

/**
 * 
 * @param {Discord.Client} client 
 */
function send_commands_all(client){
    json.forEach(command_ => {
        client.api.applications(client.user.id).commands.post({data: command_})
    });
}
exports.send_commands_all = send_commands_all;


/**
 * 
 * @param {Discord.Client} client 
 * @param {String} guild_id
 */
async function delete_commands_guild(client, guild_id){
    const commands_ = await client.api.applications(client.user.id).guilds(guild_id).commands.get()
    commands_.forEach(command_ => {
        client.api.applications(client.user.id).guilds(guild_id).commands(command_.id).delete()
    });
}
exports.delete_commands_guild = delete_commands_guild;

/**
 * 
 * @param {Discord.Client} client 
 */
async function delete_commands_all(client){
    const commands_ = await client.api.applications(client.user.id).guilds(guild_id).commands.get()
    commands_.forEach(command_ => {
        client.api.applications(client.user.id).commands(command_.id).delete()
    });
}
exports.delete_commands_all = delete_commands_all;

/**
 * 
 * @param {Discord.Client} client 
 * @param {{gskuld:     (data: {}, user: Discord.User) => Promise<String>
 *          encrypt:    (data: {}) => String
 *          decrypt:    (data: {}) => String
 *        }} commands
 */
function command_reply(client, commands){
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
        }else if(interaction.data.name == 'encrypt'){
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: commands.encrypt(interaction.data,)
                }
            }})
        }else if(interaction.data.name == 'decrypt'){
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: commands.decrypt(interaction.data,)
                }
            }})
        } 
        // console.log(interaction.data);
        // new Discord.WebhookClient(client.user.id, interaction.token).send('hello world')
    })
}
exports.command_reply = command_reply;