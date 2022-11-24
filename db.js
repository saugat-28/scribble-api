const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const mongoURI = process.env.ATLAS_URI;

// Connect To Mongo function connects backend to the database and display success message on successful connection
const connectToMongo = () => {
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected To MongoDB Successfully!\n")
    })
};

module.exports = connectToMongo;