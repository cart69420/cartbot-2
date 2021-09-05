const fs = require('fs'),
    client = require('../index')

fs.readdirSync('commands').forEach(dir => {
    fs.readdirSync('commands/' + dir).forEach(file => {
        file = file.split('.')[0]
        const cmd = require(`../commands/${dir}/${file}`)

        client.commands.set(cmd.name, cmd)
        console.log(`${dir}/${file} | ✅`)
    })
})