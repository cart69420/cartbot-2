const Database = require('simplest.db');
const moment = require('moment')
const db = new Database({
    path: './database/blacklist.json'
})
module.exports = {
	name: 'blacklist',
	aliases: ['b', 'bl'],
    description: 'Blacklist utilities.',
    usage: '<option> [user]',
    admin: true,
	execute(msg, args, client) {
		function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000)
				
            return days + (days == 1 ? " day" : " days") + " ago";
        }


		let types = ['add', 'remove', 'list', 'info']
		if(!args[0] || !types.includes(args[0].toLowerCase())) return msg.reply(`**Please input a valid option:** \`add\` \`remove\` \`list\``)
		let type = args[0].toLowerCase()
		let user
		if(args[1]) {
    		user = args[1].replace('<@!', '').replace('>', '')
		} else if(!args[1] && type != 'list') return msg.reply("Please mention a user to blacklist, unblacklist or view infos on their blacklist.")
		const already = Object.keys(db.get('users.blacklisted')).includes(user)

	

		const checkifBlacklisted = (userid) => {
			let check = Object.keys(db.get('users.blacklisted')).includes(userid)
			let tag = client.users.cache.find(user => user.id == userid).tag
			switch(check) {
				case true:
					return tag + " You are blacklisted."
					break;
				case false:
					return tag + " You are not blacklisted."
					break;
				default:
					return tag + " Unable to tell that you are blacklisted or not."
			}
		}

		switch(type) {
			case 'add':
				if(already) {
					return msg.reply('This user has already been blacklisted.')
				} else {
					msg.reply({embeds: [{
                        title: "User Blacklisted!",
                        color: client.config.embed_colors.blacklist,
                        description: `<@!${user}> (${user})\n**Reason**: ${args[2] ? args.splice(2).join(' ') : "Blacklisted."}`,
                        timestamp: new Date()
                    }]})
    				db.set(`users.blacklisted.${user}`, {
						reason: args[2] ? args.splice(2).join(' ') : "Blacklisted.",
						time: Date.now()
					})
				}
				break;
			case 'remove':
				if(!already) {
					return msg.reply('This user hasn\'t got their name on the blacklist.')
				} else {
					msg.reply({embeds: [{
                        title: "User Unblacklisted!",
                        color: "WHITE",
                        description: `<@!${user}> (${user}) has been unblacklisted.`,
                        timestamp: new Date()
                    }]})
    				db.delete(`users.blacklisted.${user}`)
				}
				break;
			case 'list':
				let cc = ''
				let count = 0
				cc = '\`' + Object.keys(db.get('users.blacklisted')).join('\` \`') + '\`'
        		Object.keys(db.get('users.blacklisted')).forEach(key => {
					count++
				})
        		msg.reply({embeds: [{
					color: 'BLACK',
					title: 'List of blacklisted users by IDs [' + count + ']',
					description: cc ? cc.replace(/undefined/g, '') : "No blacklisted users",
					footer: { text: checkifBlacklisted(msg.author.id) }
				}]})
				break;
			case 'info':
				if(!already)
					return msg.reply('User not blacklisted.')
				var bl = db.get(`users.blacklisted.${user}`)
				msg.reply({embeds: [{
					color: 'RED',
					title: client.users.cache.find(u => u.id == user).tag,
					description: `ID: ${user}\nReason: ${bl.reason}\nBlacklisted at: ${new Date(bl.time).toUTCString()} (${moment(new Date(bl.time)).fromNow()})`
				}]})
                
		}
	}
}