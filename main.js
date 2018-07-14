const { Client } = require('discord.js')

const WS = require('./ws/ws')

var client = new Client()
var ws = new WS('123456', 5665, client)

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`)
})



client.login(':P')