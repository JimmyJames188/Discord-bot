const Discord = require("discord.js")
const fs = require('fs')
const day = 86400000;
const hour = 3600000;
const min5 = 300000;
let client = new Discord.Client();

const Options = {color: '#FFA0A0', NotificationMessage: 'Finished', StartNumber: 1, number: () => {return ''}, fromString: false}

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
     * @param {{color: String, NotificationMessage: String, StartNumber: number, number: (index: number) => String, fromString: Boolean}} options
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
        this.message = {channel: {}}

        this.oneTime = !frequancy
        this.infenitly = !until

        if(!options.fromString){
            this.getNextTime()
        }
    }

    getNextTime(){
        if(this.infenitly || Date.now() < this.until.getTime()){
            this.nextTime = new Date(this.date.toString())
            while (this.nextTime.getTime() < Date.now()) {
                this.nextTime = new Date(this.nextTime.getTime() + this.frequancy)
                this.index++
            }
        }
    }

    /**
     * 
     * @param {Discord.TextChannel} channel 
     */
    async startUpdate(channel){
        if(!this.infenitly && (!this.nextTime || this.nextTime.getTime() > this.until.getTime())) return;
        this.message = await channel.send(this.createEmbed())
        // fs.writeFileSync('testnotific.json', this.toString())
        this.update(this.message)
    }
    
    
    getDelay(){
        const untilNextTime = this.nextTime.getTime() - Date.now()
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

    toString(){
        const object = {
            name: this.name,
            date: this.date,
            frequency: this.frequancy,
            until: this.until,
            options: JSON.parse(JSON.stringify(this.options)),
            nextTime: this.nextTime,
            message: this.message.id,
            channel: this.message.channel.id,
            FunctionNumber: 'return ' + this.options.number.toString()
        }
        object.options.StartNumber = this.index;

        return JSON.stringify(object)
    }

    /**
     * 
     * @param {String} options_
     */
    static async parse(options_){
        const object = JSON.parse(options_)
        object.date = new Date(object.date)
        object.until = new Date(object.until)
        let options = object.options
        options.fromString = true
        options.number = new Function(object.FunctionNumber)()

        const notification = new Notification(object.name, object.date, object.frequancy, object.until, options)
        if(object.nextTime){
            notification.nextTime = new Date(object.nextTime)
        }
        if(object.message){
            const channel = await client.channels.fetch(object.channel)
            notification.update(await channel.messages.fetch(object.message))
        }

        return notification;
    }
}

exports.Notification = Notification;