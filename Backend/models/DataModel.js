// Mongoose Schema Layout, It defines the structure of the data to be saved in the DB
//requirements
const mongoose = require('mongoose');

//Defined the structure of the data as called Schema Layout
const DataSchema = new mongoose.Schema({
    //1. Custom number ID, We will replace the default ObjectId and keep it as a pure number type, as you decided
    _id:{
        type: Number,
        required: [true,'Unique Numeric ID is required']
    },
    //2. The JSON Value, By using the 'Mixed type' MongoDB will handle the entire JSON object within it
    value:{
        type: mongoose.Schema.Types.Mixed,
        required: [true,'Value Object data is required']
    },
    //3. Time-to-Live in seconds, The seconds passed by the user from the frontend will be stored here
    ttl:{
        type: Number,
        required: [true, 'TTL duration in seconds is required']
    },
    //4.Timestamp, When the data was created, so that we can calculate the remaining time in the event of a 'Cache Miss'
    createdAt:{
        type: Date,
        default: Date.now
    }
},{
    // This will remove MongoDB default __v (version key) so that the data looks clean
    versionKey: false
})

// create a Model
// The first argument is the name of the collection, which will then be saved in the database
// The second argument provides the schema structure, which is used to save this data format into the database
const DataModel = mongoose.model('DataStore',DataSchema);

// Exporting the model so that we can perform CRUD operations in the controller
module.exports = DataModel;