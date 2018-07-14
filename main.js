const { Client } = require('discord.js')
const config = require('./config.json')
const WS = require('./ws/ws')

var client = new Client()
client.config = config

var ws = new WS('123456', 5665, client)

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`)
})

client.login(config.token)