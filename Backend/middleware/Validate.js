// Security & Sanitization Gateway
const validateInput = async (req,res,next)=>{
    // We will check whether the request is a POST request (for submitting data) or a GET request (for searching)
    if (req.method === 'POST'){
        const { id, value, ttl } = req.body;

        // 1. ID Sanitization (must be numeric only, no alphabets!)
        // Number.isInteger() checks whether the data is a pure number or not
        if (id === undefined || id === null || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({ 
                error: "Security Alert: Invalid ID format! ID must be a positive number only." 
            });
        }

        // 2. Value Sanitization (must be a complete JSON object)
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return res.status(400).json({ 
                error: "Validation Error: Value must be a valid JSON Object layout." 
            });
        }

        //3. TTL Sanitization (must be positive seconds)
        if (ttl === undefined || ttl === null || isNaN(ttl) || Number(ttl) <= 0) {
            return res.status(400).json({ 
                error: "Validation Error: TTL must be a valid positive number of seconds." 
            });
        }

        // If everything is perfectly clear and correct, we will convert the data into a number and override it in req.body
        req.body.id = Number(id);
        req.body.ttl = Number(ttl);
    }else if (req.method === 'GET'){
        // This will work for Search Bar, where the ID will be received in the URL request parameters (req.params)
        const { id } = req.params;

        // Check whether the ID submitted in the search bar consists only of numbers
        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({ 
                error: "Security Alert: Search ID must be a numeric value only!" 
            });
        }

        // If all the data is sanitized, 'next()' will pass it on to the next controller logic
        next();
    }
}

module.exports = validateInput;