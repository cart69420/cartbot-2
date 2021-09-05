const Database = require('simplest.db')

module.exports = {
    name: 'messageCreate',
    async execute(msg, client) {
        if(msg.author.bot || msg.author == client.user) return;

        const xpdb = await new Database({path: "./database/xp.json"})
        const xpu = await xpdb.get(msg.author.id)


        if(!client.xpCooldowns.has(msg.author.id)) {
            let xpAdd = +Math.floor(Math.random() * (25 - 15 + 1)) + 15

            xpdb.set(msg.author.id, {
                totalXP: xpu.totalXP + xpAdd,
                XP: xpu.XP + xpAdd,
                XPrequiredForLevel: 500 * (xpu.level + 1),
                level: xpu.level
            })
            await client.xpCooldowns.set(msg.author.id, true)

            setTimeout(() => {
                client.xpCooldowns.delete(msg.author.id)
            }, 60000);
        }

        if(!xpdb.keys.includes(msg.author.id)) {
            xpdb.set(msg.author.id, {
                totalXP: 0,
                XP: 0,
                XPrequiredForLevel: 500,
                level: 0
            })
        } else if(xpu.XP >= xpu.XPrequiredForLevel) {
            xpdb.set(msg.author.id, {
                totalXP: xpu.totalXP,
                XP: xpu.XP - xpu.XPrequiredForLevel,
                XPrequiredForLevel: 500 * (xpu.level + 1),
                level: xpu.level + 1
            })
            console.log('moment')
        }

        let dataPrefix = new Database({path: "./database/prefix.json"}).get(msg.author.id);

        const prefix = dataPrefix || client.prefix || require(`../database/guilds/${msg.guild.id}/settings.json`).prefix


        if (msg.content == `<@!${client.user.id}>` && !msg.author.bot) 
            return msg.reply({embeds: [{
                color: "#FF1493",
                description: `Prefix của bạn là **${prefix}**`
            }]})
        
        if(!msg.content.startsWith(prefix)) return;

        let uid = msg.author.id
        const args = msg.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        if(!client.commands.has(command) && !client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))) return

        let commands = client.commands.get(command) 
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))
            
        let cddata = `${uid} | ${commands.name}`

        if(!client.config.admin.includes(msg.author.id)) {
            if(commands.disabled == true) 
                return msg.reply({embeds: [{
                    color: client.config.embed_colors.error,
                    description: 'Lệnh **' + command + '** đã bị tắt!'
                }]})

            if(commands.admin == true)
                return msg.reply({embeds: [{
                    color: client.config.embed_colors.warning,
                    description: 'Lệnh **' + command + '** chỉ dành cho Admin!'
                }]})

            if((!commands.blacklist_access && client.blacklist.keys.includes(msg.author.id)) == true)
                return msg.reply({embeds: [{
                    color: client.config.embed_colors.blacklist,
                    description: 'Lệnh **' + command + '** không dành cho người bị blacklist!'
                }]})

            if(client.cooldowns.has(cddata))
                return msg.reply({embeds: [{
                    color: client.config.embed_colors.warning,
                    description: `Bạn phải chờ **${(client.cooldowns.get(cddata)/1000).toFixed(2)} giây** để tiếp tục sử dụng lệnh này.`
                }]})
        }

        console.log(`[${new Date(Date.now()).toUTCString()}] (${msg.guild.name} || #${msg.channel.name}) << ${msg.author.tag} || ${msg.author.id} >> ${msg.content}`)

        try {
            if(commands.cooldown && client.cooldowns.has(cddata) == false) {
                await client.cooldowns.set(cddata, commands.cooldown * 1000);


                for(let t = 1; t <= client.cooldowns.get(cddata); t++) {
                    setTimeout(() => {
                        let cd = client.cooldowns.get(cddata)
                        if(cd <= 0) return;

                        cd = cd - 1
                        client.cooldowns.set(cddata, cd)
                    }, t)
                }

                setTimeout(() => {
                    client.cooldowns.delete(cddata)
                }, client.cooldowns.get(cddata))

            }

            commands.execute(msg, args, client);
        } catch (error) {
            console.error(error);
            msg.reply({embeds: [{
                color: client.config.embed_colors.error,
                description: `Đã xảy ra lỗi khi đang sử dụng lệnh **${command}**`
            }]});
        }
    }
}