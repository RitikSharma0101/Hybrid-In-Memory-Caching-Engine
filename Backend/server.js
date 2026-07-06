// requirements
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

//Connect to .env
dotenv.config();

//Connect to the DB on the server
const dbcon = require('./config/db');
dbcon();

//Initialization of server RAM that can be accessed by the entire application
global.dbstore = {};

//Server initialization 
const app = express();

// (JSON support) Required to read JSON object data coming from the frontend
app.use(express.json());

//Security and Data Parsing Middlewares
app.use(helmet()); // To secure HTTP headers

// Controlled and Restricted CORS Policy (for frontend connectivity)
const corsOptions = {
    origin: process.env.FRONTEND_URL,    
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// API routes, All your project endpoints (e.g., /api/set, /api/keys) will be routed through this.
const DataRoutes = require('./routes/DataRoutes');
app.use('/api',DataRoutes);

//make api
app.get('/check',(req,res)=>{
    res.status(200).json({
        user: "ritik sharma",
        age :17
    });
})

//Server Listener Port Setup,What is the server run port number?
const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`This server run on port: ${port}`);
});