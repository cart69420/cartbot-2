module.exports = {
    name: 'resetnick',
    aliases: ['rsnick', 'rs-nick', 'resetnickname', 'rsnickname', 'rs-nickname', 'rsname', 'rs-name'],
    description: 'Resets user\'s nickname if it\'s un-pingable or has illegal characters',
    usage: '<user>',
    admin: true,
    execute(msg, args) {
        let user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || msg.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());

        var check = str => {
            let format = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 \`!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?~")

            for (var i = 0; i < str.length; i++) {
                if (format.has(str.charAt(i))) {
                    return true;
                }
            }
            return false;
        }
        console.log(check(user.displayName))

        if((check(user.displayName == null ? user.user.username : user.displayName) && check(user.user.username)) == false)
            user.setNickname(`Reset ${Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)}`)
        else if(check(user.displayName) == false)
            user.setNickname(user.user.username)
        else if((check(user.displayName == null ? user.user.username : user.displayName)) == true) msg.reply('User\'s nickname is normal.')
            

    }
}