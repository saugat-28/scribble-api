const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')
const Note = require('./models/Note')

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

// TEST ROUTE: Get All the Notes using: GET "/fetch". Login Required
app.get('/fetch', fetchuser, async (req, res) => {
  try {
      // Fetch all notes that have user ID matching current user and return
      const notes = await Note.find();
      res.json(notes)
  } catch (error) {
      // In case of some error log the error and return Error Message
      console.log(error.message)
      res.status(500).send("Some Error Occured!")
  }
})

// Start Server to Listen on Localhost's Port
app.listen(process.env.PORT || 3000, () => {
  console.log(`Scribble-Server is listening on port ${port}`)
})