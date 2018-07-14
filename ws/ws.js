const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require("body-parser");
const path = require('path')


class WebSocket {

    constructor(token, port, client) {
        this.token = token
        this.client = client
        this.app = express()

        this.app.engine('hbs', hbs({
            extname: 'hbs',
            defaultLayout: 'layout',
            layoutsDir: __dirname + '/layouts'
        }))
        this.app.set('views', path.join(__dirname, 'views'))
        this.app.set('view engine', 'hbs')
        this.app.use(express.static(path.join(__dirname, 'public')))
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());

        this.app.get('/', (req, res) => {
            var _token = req.query.token
            if (!this.checkToken(_token)) {
    
                var chans = []
                this.client.guilds.first().channels
                    .filter(c => c.type == 'text')
                    .forEach(c => {
                        chans.push({id: c.id, name: c.name})
                    })
    
                res.render('index', { 
                    title: "SECRET INTERFACE", 
                    token: _token, 
                    chans 
                })
            }
            else
                res.render('error', { title: "ERROR" })
        })
    
        this.app.post('/sendMessage', (req, res) => {
            var _token = req.body.token
            var channelid = req.body.channelid
            var text = req.body.text
    
            if (!this.checkToken(_token))
                return
    
            var chan = this.client.guilds.first().channels.get(channelid)
    
            if (chan) {
                chan.send(text)
            }
        })

        this.server = this.app.listen(port, () => {
            console.log("Websocket API set up at port " + this.server.address().port)
        })
    }

    checkToken(_token) {
        return (_token == this.token)
    }

}

module.exports = WebSocket
