const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')

// Connect to database
connectToMongo();

// Keep Server Port as 5000
const app = express()
const port = 5000

// Middle Ware required for parsing JSON recieved in requests
app.use(express.json())
// App Uses CORS to allow API Calls from browsers 
app.use(cors())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// Display the following on Default localhost page on server Port
app.get('/', (req, res) => {
  res.send('---Welcome To The Server Page of Scribble---')
})

// Start Server to Listen on Localhost's Port
app.listen(port, () => {
  console.log(`Scribble-Server is listening on port ${port}`)
})