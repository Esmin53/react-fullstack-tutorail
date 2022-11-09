require ("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')

const app = express()

app.use(express.json())
app.use(express.urlencoded())

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Full stack express server Home Page')
})

app.post('/name', (req, res) => {
    if(req.body.name) {
        return res.json({name: req.body.name})
    } else {
        return res.status(400).json({error: 'No name provided'})
    }
})

app.use('/api/auth', authRoute)

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to database')
    
    app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`)
})
}).catch((error) => {
    console.log(error)
})

