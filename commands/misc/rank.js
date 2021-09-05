const db = require('simplest.db')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'rank',
    execute(msg, args, client) {
        let user
        if(!args[0]) user = msg.author
        else user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || msg.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase()).user

        const xpdb = new db({path: "./database/xp.json"})
        const udb = xpdb.get(user.id)

        var allLevels = []
        xpdb.keys.forEach((u, index) => {
            allLevels.push(`[#${index + 1}] ` + u + ' | ' + xpdb.get(u).level)
        })
        allLevels.sort((a, b) => a.split(" | ")[0] - b.split(" | ")[0])
        if(allLevels.length > 10) allLevels = allLevels.splice(0, 10)
        
        function getTop(userid) {
            let o = 0
            allLevels.forEach(u => {
                let a = u.split(" ")

                if(a[1] == userid) return o = a[0].replace('[', '').replace(']', '')
            })
            return o
        }
        const embed = new MessageEmbed()
            .setColor(user.displayHexColor)
            .setAuthor(`${user.tag}     Rank ${getTop(user.id)}  Level ${udb.level}`, user.avatarURL({ format : 'jpg', dynamic: true, size: 256 }))
            .addField(`XP: ${udb.XP}/${udb.XPrequiredForLevel}`, 'progress bar here idk not worked on yet')
        msg.reply({embeds: [embed]})
    }
}