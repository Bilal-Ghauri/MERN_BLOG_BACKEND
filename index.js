require('dotenv').config()
const express = require("express")
const cors = require('cors')
const app = express()
require('./db')
app.use(cors())
app.use(express.json())

app.use('/user', require('./routes/user/user'))
app.use('/blog', require('./routes/blog/blog'))

app.get('/', (req, res) => {
    res.send("Home route ")
})

app.listen(process.env.PORT, () => {
    console.log("App is running on port", 'http://localhost:' + process.env.PORT);
})