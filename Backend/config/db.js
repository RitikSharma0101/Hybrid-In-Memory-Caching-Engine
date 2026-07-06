//requirements
const mongoose = require('mongoose');

//Connection to the database (arrow function)
const connectdb = async ()=>{
    //Handle the error
    try{
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log(`DB connected Successfully: ${db.connection.host}`);
    }catch(error){
        console.log(`DB Connection Failed: ${error.message}`);
        //Stop the server because an error is occurring
        process.exit(1);
    }
}

module.exports = connectdb;