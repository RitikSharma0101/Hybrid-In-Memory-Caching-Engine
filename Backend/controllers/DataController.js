// requirements
const DataModel = require('../models/DataModel');

// Block 1: Data Setup (POST method - DB first then cache)
exports.setData = async (req,res)=>{
    try{
        //Take data from user
        const {id,value,ttl} = req.body;

        // 1. DB FIRST POLICY: First, we will store the data in the database
        const newData = new DataModel({
            _id:id,
            value:value,
            ttl:ttl,
            createdAt:new Date()
        });
        await newData.save();

        //2. CACHE SYNC: Data will be pushed to the RAM (Cache) immediately upon successful database operation
        const expiresAt = Date.now() + (ttl * 1000); // Expiry timestamp (in milliseconds)
        global.dbstore[id] = {
            value:value,
            ttl:ttl,
            expiresAt:expiresAt,
            createdAt: new Date()
        }
        
        // 3. TTL TRIGGER: Activating the timer in the background
        // This timer will not wait for the memory to fill up, it will clear the RAM as soon as the time is up
        setTimeout(() => {
            if (global.dbstore[id]){
                delete global.dbstore[id];
                console.log(`🗑️ Cache Auto-Cleaned: Key ${id} evicted after ${ttl} seconds.`);
            }
        }, ttl * 1000);

        // Sending a success response to the frontend
        res.status(201).json({ message: "Data successfully secured in DB and Cached!" });
    }catch(error){
        // If the same ID is inserted again in MongoDB, a duplicate error will occur
        if (error.code === 11000) {
            return res.status(400).json({ error: "Duplicate Error: This ID already exists in DB!" });
        }
        res.status(500).json({ error: error.message });
    }
};

// Block 2: Live RAM Monitor Dashboard (GET Method for Polling)
exports.getActiveKeys = async (req,res)=>{
    const activeKeysList = [];
    const currentTime = Date.now();

    //Extracting the remaining live timings by iterating through the RAM (global.dbStore)
    for(const id in global.dbstore){
        const item = global.dbstore[id];
        const timeleft = Math.max(0,Math.round((item.expiresAt - currentTime)/1000));

        if(timeleft>0){
            activeKeysList.push({
                id:Number(id),
                value:item.value,
                timeLeft:timeleft
            });
        }
    }
    //Sending a live list for the frontend table
    res.status(200).json(activeKeysList);
}

// Block 3: Search Bar (Cache Hit vs. Cache Miss & 30s Auto-Repopulate)
exports.searchData = async (req,res)=>{
    try{
        const id = Number(req.params.id);
        const currentTime = Date.now();
        // Step A: First, check the RAM (cache)
        if(global.dbstore[id]){
            const item = global.dbstore[id];
            const timeLeft = Math.max(0, Math.round((item.expiresAt - currentTime) / 1000));

            //If the data is present in RAM, return it directly from there (CACHE HIT)
            return res.status(200).json({
                status: "CACHE HIT",
                id: id,
                value: item.value,
                timeLeft: timeLeft
            });
        }

        //Step B: If not found in RAM, go to the database (CACHE MISS)
        const dbData = await DataModel.findById(id);

        if (!dbData) {
            // If the data is not even in the database (or has been completely deleted)
            return res.status(404).json({
                status: "NOT FOUND",
                message: "Data Removed from Cache & Does Not Exist in DB"
            });
        }

        // Step C: If it is found in the DB, then—while calling it a 'CACHE MISS'
        // Immediately auto-repopulate the RAM with the default for 30 seconds
        const defaultTTL = 30; 
        const newExpiresAt = Date.now() + (defaultTTL * 1000);

        global.dbstore[id] = {
            value: dbData.value,
            ttl: defaultTTL,
            expiresAt: newExpiresAt,
            createdAt: new Date()
        };

        // Trigger a 30-second timer in the background for this re-populated data as well
        setTimeout(() => {
            if (global.dbstore[id]) {
                delete global.dbstore[id];
                console.log(`🗑️ Lazy-Loaded Cache Cleaned: Key ${id} evicted after default 30 seconds.`);
            }
        }, defaultTTL * 1000);
        
        // Send the data to the frontend. Remember, the status will be 'CACHE MISS'
        // But timeLeft: 30 is being sent to start displaying a 30-second live timer below!
        return res.status(200).json({
            status: "CACHE MISS",
            id: id,
            value: dbData.value,
            timeLeft: defaultTTL, // This will help the frontend start a ticking countdown
            message: "Data recovered from DB and re-populated into Cache for 30s."
        });
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}