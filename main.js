const { Client } = require('discord.js')
const WS = require('./ws/ws')

// Create Discord Bot Client
var client = new Client()
// Create Websocket instance with token '123456',
// port 5665 and passing the discord client instance
var ws = new WS('123456', 5665, client)

// If the bot is ready, this event will be fired
client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`)
})

// Logging in Discord Bot at the API
client.login('MzI4NTc5NjU2MzIyMjUyODAx.Dizeag.kEOBSvgBOl7eukVR5Mc0jTugq3E')