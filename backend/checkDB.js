const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const users = await User.find({});
    console.log("Total users found:", users.length);
    if(users.length > 0) {
        console.log("First user:", { email: users[0].email, role: users[0].role, isActive: users[0].isActive });
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
