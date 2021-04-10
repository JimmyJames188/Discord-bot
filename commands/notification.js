const Discord = require("discord.js")
const Drive = require('./../Storage/Drive.js')
const day = 86400000;
const hour = 3600000;
const min5 = 300000;
let client = new Discord.Client();
const json_id = '1zzuB0gjwZggpxxMXGgYCKLD2JtMY8AQA';
let notification_array = []


const Options = {color: '#FFA0A0', NotificationMessage: 'Finished', StartNumber: 1, number: () => {return ''}, fromString: false}

var escapable = /[\\\"\x00-\x1f\x7f-\uffff]/g,
meta = {    // table of character substitutions
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"' : '\\"',
    '\\': '\\\\'
};

function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

escapable.lastIndex = 0;
return escapable.test(string) ?
    '"' + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === 'string' ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' :
    '"' + string + '"';
}

/**
 * 
 * @param {Discord.Client} client_ 
 * @param {Drive.Project} JamesBot_
 */
async function setClient(client_, JamesBot_) {
    client = client_
    JamesBot = JamesBot_
    const array = await JamesBot_.getFile(json_id)
    for (let i = 0; i < array.length; i++) {
        await Notification.parse(array[i])
    }
    save()
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

        this.array_index = notification_array.push(this) - 1
        if(!options.fromString){
            save()
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
    async startUpdate(channel, save_this = true){
        if(!this.infenitly && (!this.nextTime || this.nextTime.getTime() > this.until.getTime())) return;
        this.message = await channel.send(this.createEmbed())
        // fs.writeFileSync('testnotific.json', this.toString())
        if (save_this){ save()};
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
            
            save()

            this.index++;
            this.nextTime = new Date(this.nextTime.getTime() + this.frequancy);
            this.startUpdate(message.channel)
        }else{
            notification_array.splice(this.array_index, 1)
            save()
        }
    }

    toString(){
        const object = {
            name: quote(this.name),
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

        const notification = new Notification(JSON.parse(object.name), object.date, object.frequancy, object.until, options)
        if(object.nextTime){
            notification.nextTime = new Date(object.nextTime)
        }
        if(object.message){
            const channel = await client.channels.fetch(object.channel)
            await notification.update(await channel.messages.fetch(object.message))
        }

        return notification;
    }
}

exports.Notification = Notification;

function save() {
    let array = []
    notification_array.forEach(v => {
        array.push(v.toString())
    })
    JamesBot.editFile(json_id, JSON.stringify(array, undefined, '\t'))
}