const { Client } = require('discord.js')

const WS = require('./ws/ws')

var client = new Client()
WS.init('123456', client)

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`)
})



client.login('MzI4NTc5NjU2MzIyMjUyODAx.DirNwQ.apwNJjUFiWbF3BLMjHkhFUz6-ZI')