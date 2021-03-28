json = {
    name: "gskuld",
    description: "Get or edit permissions for a user or a role",
    options: []
}

function send_commands(client){

    client.api.applications(client.user.id).guilds('701873712370286722').commands.patch({data: json})
    client.ws.on('INTERACTION_CREATE', async interaction => { 
        client.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
                content: 'hello world!'
            }
        }})
        new Discord.WebhookClient(client.user.id, interaction.token).send('hello world')
    })
}
exports.send_commands = send_commands;