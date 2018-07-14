const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require("body-parser");
const path = require('path')

exports.init = (TOKEN, client) => {

    var app = express()

    app.engine('hbs', hbs({
        extname: 'hbs',
        defaultLayout: 'layout',
        layoutsDir: __dirname + '/layouts'
    }))
    app.set('views', path.join(__dirname, 'views'))
    app.set('view engine', 'hbs')
    app.use(express.static(path.join(__dirname, 'public')))
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        var _token = req.query.token
        if (_token == TOKEN) {

            var chans = []
            client.guilds.first().channels
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

    app.post('/sendMessage', (req, res) => {
        var _token = req.body.token
        var channelid = req.body.channelid
        var text = req.body.text

        if (_token != TOKEN)
            return

        var chan = client.guilds.first().channels.get(channelid)

        if (chan) {
            chan.send(text)
        }
    })

    var server = app.listen(5665, () => {
        console.log("Websocket API set up at port " + server.address().port)
    })

    exports.app = app
    exports.server = server
}