const { Client } = require('discord.js')
const WS = require('./ws/ws')

// load config.json
const config = require('./config.json')

// Create Discord Bot Client
var client = new Client()
// inject config into client instance object
client.config = config

// Create Websocket instance with token '123456',
// port 5665 and passing the discord client instance
var ws = new WS(config.ws.token, config.ws.port, client)

// If the bot is ready, this event will be fired
client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`)
})

// Logging in Discord Bot at the API
client.login(config.token)
