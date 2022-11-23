const mongoose = require('mongoose');
// const LOCAL_URI = "mongodb://localhost:27017/scribble?directConnection=true&readPreference=primary";
const ATLAS_URI = "mongodb+srv://saugat:saugat28@cluster0.0my9t1x.mongodb.net/scribble?retryWrites=true&w=majority"
const mongoURI = ATLAS_URI;

// Connect To Mongo function connects backend to the database and display success message on successful connection
const connectToMongo = () => {
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected To MongoDB Successfully!\n")
    })
};

module.exports = connectToMongo;