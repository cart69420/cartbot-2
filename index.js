require('dotenv').config({path: './.env'})

const { Client, Collection, Intents } = require('discord.js'),
    fs = require('fs'),
    config = require('./config.json'),
    Database = require('simplest.db'),
    blacklist = new Database({path: './database/blacklist.json'})

const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS", "GUILD_VOICE_STATES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"], allowedMentions: { parse: ['users', 'roles'], repliedUser: false }})
module.exports = client

client.commands = new Collection()
client.aliases = new Collection()
client.cooldowns = new Map()
client.xpCooldowns = new Map()
client.blacklist = blacklist
client.prefix = config.prefix
client.config = config

fs.readdirSync('modules').forEach(m => require('./modules/' + m.split('.')[0]))

client.login(process.env.TOKEN, e => {console.error(e)})