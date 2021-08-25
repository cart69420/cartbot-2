module.exports = {
    name: 'kick',
    description: 'kicks user from server',
    usage: '<user> [reason]',
    admin: true,
    execute(msg, args) {
        args[1] = args[1] ? "Kicked." : args[1]
        let kick = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || msg.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        kick.kick()
        msg.channel.send({embed: {
            color: 'RED',
            title: 'User Kicked!',
            description: `${kick.user.tag} (${kick.user.id})\n**Reason:** ${args[1]}`
        }})
        kick.user.send(`Bạn đã bị kick khỏi **${msg.guild.name}** với lí do **${args[1]}**`)
    }
}