module.exports = {
    name: 'ban',
    description: 'Bans user from server',
    usage: '<user> [reason]',
    admin: true,
    execute(msg, args) {
        args[1] = args[1] ? "Banned." : args[1]
        let ban = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || msg.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        ban.ban()
        msg.channel.send({embed: {
            color: 'RED',
            title: 'User Banned!',
            description: `${ban.user.tag} (${ban.user.id})\n**Reason:** ${args[1]}`
        }})
        ban.user.send(`Bạn đã bị ban khỏi **${msg.guild.name}** với lí do **${args[1]}**`)
    }
}