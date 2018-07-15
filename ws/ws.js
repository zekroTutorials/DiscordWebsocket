const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require("body-parser");
const path = require('path')

/**
 * Websocket class.
 * @param {string}         token  Token to authenticate at the web interface
 * @param {number}         port   Port to access web interface
 * @param {discord.Client} client Discord client instance to access the discord bot
 */
class WebSocket {

    constructor(token, port, client) {
        this.token = token
        this.port = port
        this.client = client
        this.app = express()

        // Register Handlebars instance as view engine
        this.app.engine('hbs', hbs({
            extname: 'hbs',                     // Extension (*.hbs Files)
            defaultLayout: 'layout',            // Main layout -> layouts/layout.hbs
            layoutsDir: __dirname + '/layouts'  // Layouts directory -> layouts/
        }))
        // Set folder views/ as location for views files
        this.app.set('views', path.join(__dirname, 'views'))
        // Set hbs as view engine
        this.app.set('view engine', 'hbs')
        // Set public/ as public files root
        this.app.use(express.static(path.join(__dirname, 'public')))
        // Register bodyParser as parser for Post requests body in JSON-format
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());

        this.registerRoots()

        // Start websocket on port defined in constructors arguments
        this.server = this.app.listen(port, () => {
            console.log("Websocket API set up at port " + this.server.address().port)
        })
    }

    /**
     * Compare passed token with the token defined on
     * initialization of the websocket
     * @param {string} _token Token from request parameter 
     * @returns {boolean} True if token is the same
     */
    checkToken(_token) {
        return (_token == this.token)
    }

    /**
     * Register root pathes
     */
    registerRoots() {
        this.app.get('/', (req, res) => {
            var _token = req.query.token
            if (!this.checkToken(_token)) {
                // Render error view if token does not pass
                res.render('error', { title: "ERROR" })
                return
            }

            // Collect all text channels and put them into an
            // array as object { id, name }
            var chans = []
            this.client.guilds.first().channels
                .filter(c => c.type == 'text')
                .forEach(c => {
                    chans.push({id: c.id, name: c.name})
                })
    
            // Render index view and pass title, token
            // and channels array
            res.render('index', { 
                title: "SECRET INTERFACE", 
                token: _token, 
                chans 
            })
        })
    
        this.app.post('/sendMessage', (req, res) => {
            var _token = req.body.token
            var channelid = req.body.channelid
            var text = req.body.text

            if(!_token || !channelid || !text)
                return res.sendStatus(400);
    
            if (!this.checkToken(_token))
                return res.sendStatus(401)
    
            var chan = this.client.guilds.first().channels.get(channelid)
    
            // catch post request and if token passes,
            // send message into selected channel
            if (chan) {
                chan.send(text)
                res.sendStatus(200)
            } else
                res.sendStatus(406)
        })
    }

}

module.exports = WebSocket
