module.exports = {
    name: "ping",
    description: "this is an embed command!",
    execute(message, lala){
        
        let lala = message.content.substring(PREFIX.length).split(" ");

    switch(lala[0]){
        case "embed":
            const Embed = new Discord.MessageEmbed()
            .setColor('#FFD700')
            .setTitle('Title')
            .setDescription('Discription')
            .addField('Text Here')
            .setImage(message.author.avatarURL())
            message.channel.send(embed)
    }
    }
}



