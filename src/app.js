const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

const app = express()
const port = process.env.PORT || 3000

//Define path for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials' )

//Set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Set up static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res)=>{
    res.render('index',{
        title: 'Weather',
        name: 'Yogesh'
    }) 
})

app.get('/about', (req, res)=>{
    res.render('about', {
        title: 'About Me',
        name: 'Yogesh'
    })
})

app.get('/help', (req, res)=>{
    res.render('help',{
        helpText: 'If you need help or have any suggestions for the weather app, kindly drop me a mail at yogesh@gmail.com !',
        title: 'HELP',
        name: 'Yogesh'
    })
})

app.get('/weather', (req, res)=>{

    if(!req.query.address) {
        return res.send({
            error: 'Please provide an address'
        })
    }

    geocode( req.query.address, (error, {latitude,longitude,location}= {} )=>{
  
        if(error) {
            return res.send({
                error: error
            })
        }    
    
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({
                    error
                })
            }
            res.send({
                location,
                forecast: forecastData

            })
          })
    })

})

app.get('/products', (req, res)=>{
    if(!req.query.search) {
        return res.send({
            error: 'Please provide a search term'
        })
    }

    console.log(req.query.search)

    res.send({
        products:[]
    })
})

app.get('/help/*', (req, res)=>{
    res.render('404', {
        errorMessage: 'Help article not found',
        title: '404',
        name: 'Yogesh'
    })
})

app.get('*', (req, res)=>{
    res.render('404', {
        errorMessage: 'Page not found',
        title: '404',
        name: 'Yogesh'

    })    
})

app.listen(port, ()=>{
    console.log('Server is up on port ' + port)
})