const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'ping',
    blacklist_access: true,
    execute(msg, client) {
        msg.reply({embeds: [{
            color: 'GREEN',
            description: 'Calculating...'
        }]}).then(m => {
			var ping = m.createdTimestamp - msg.createdTimestamp

            m.edit({embeds: [{
                color: "GREEN",
                fields: [
                    {name: "Latency", value: ping + "ms"},
                    {name: "API Latency", value: msg.client.ws.ping + "ms"}
                ]
            }]})
		})
    }
}