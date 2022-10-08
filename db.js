const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/scribble?directConnection=true&readPreference=primary"

// Connect To Mongo function connects backend to the database and display success message on successful connection
const connectToMongo = () => {
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected To MongoDB Successfully!\n")
    })
}

module.exports = connectToMongo;