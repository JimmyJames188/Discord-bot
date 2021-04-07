const Discord = require("discord.js")
const day = 86400000;
const hour = 3600000;
const min5 = 300000;
let client

const Options = {color: '#FFA0A0', NotificationMessage: 'Finished', StartNumber:1, number: () => {return ''}}

/**
 * 
 * @param {Discord.Client} client_ 
 */
function setClient(client_) {
    client = client_
}
exports.setClient = setClient

class Notification{

    /**
     * @param {String} name
     * @param {Date} date 
     * @param {Number} frequancy in ms
     * @param {Date} until 
     * @param {{color: String, NotificationMessage: String, StartNumber: number, number: (index: number) => String}} options
     */
    constructor(name, date, frequancy = undefined, until = undefined, options = Options){
        const keys = Object.keys(Options)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if(typeof options[key] == 'undefined'){
                options[key] = Options[key]
            }
        }

        this.name = name
        this.date = date
        this.frequancy = frequancy
        this.until = until
        this.color = options.color
        this.options = options
        this.index = options.StartNumber

        this.oneTime = !frequancy
        this.infenitly = !until
        this.nextTime = new Date(date.toString())
        while (this.nextTime < Date.now()) {
            this.nextTime = new Date(this.nextTime.getTime() + frequancy)
        }
    }

    /**
     * 
     * @param {Discord.TextChannel} channel 
     */
    async startUpdate(channel){
        this.update(await channel.send(this.createEmbed()))
    }
    
    
    getDelay(){
        const untilNextTime = this.nextTime.getTime() - Date.now()
        console.log(this.nextTime)
        console.log(untilNextTime)
        this.untilNextTime = untilNextTime;
        if(untilNextTime > day){
            this.delay = untilNextTime % day;
            this.delayStr = 'Day';
        }else if(untilNextTime > hour){
            this.delay = untilNextTime % hour;
            this.delayStr = 'Hour';
        }else if(untilNextTime > min5){
            this.delay = untilNextTime % 60000;
            this.delayStr = 'Minutes';
        }else if(untilNextTime > 5000){
            this.delay = untilNextTime % 5000;
            this.delayStr = 'Second';
        }else{
            this.delay = untilNextTime % 1000;
            this.delayStr = 'Second';
        }
        return this.delay
    }

    createEmbed(){
        const embed = new Discord.MessageEmbed()
            .setColor(this.color)
            .setTitle(this.name + this.options.number(this.index))
            .setFooter("Notification by " + client.user.username, client.user.avatarURL())
        
        switch(this.delayStr){
            case 'Day':
                embed.setDescription(`${Math.floor(this.untilNextTime/day)} day/s left`)
                break
            case 'Hour':
                embed.setDescription(`${Math.floor(this.untilNextTime/hour)} hour/s left`)
                break
            case 'Minutes':
                embed.setDescription(`${Math.floor(this.untilNextTime/60000)} min. left`)
                break
            case 'Second':
                embed.setDescription(`${Math.floor(this.untilNextTime/60000)}:${Math.floor((this.untilNextTime % 60000) / 1000)} left`)
                break
        }
        return embed
    }

    /**
     * 
     * @param {Discord.Message} message 
     */
    async update(message){
        this.getDelay()
        if(this.untilNextTime < 0) return this.End(message);
        message.edit(this.createEmbed())
        setTimeout(() => {
            this.update(message)
        }, this.delay)
    }

    /**
     * 
     * @param {Discord.Message} message 
     */
    End(message){
        const embed = this.createEmbed()
            .setDescription(`${this.options.NotificationMessage} - ${this.nextTime.toString()}`)

        message.edit(embed)
        
        if  (!this.oneTime && 
            (this.infenitly || (this.nextTime.getTime() + this.frequancy <= this.until.getTime()))){

            this.index++;
            this.nextTime = new Date(this.nextTime.getTime() + this.frequancy);
            this.startUpdate(message.channel)
        }
    }
}

exports.Notification = Notification;