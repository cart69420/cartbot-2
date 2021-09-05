const fs = require('fs'),
    client = require('../index')

const events = fs.readdirSync('./events')

for (const file of events) {
    const event = require(`../events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`events/${event.name} | ✅`)
}