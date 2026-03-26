const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const adminExists = await User.findOne({ email: 'admin@mmps.com' });
    if(adminExists) {
        console.log("Admin already exists!");
        process.exit(0);
    }
    
    const adminId = new mongoose.Types.ObjectId();
    
    await User.create({
        email: 'admin@mmps.com',
        password: 'password123',
        role: 'Admin',
        referenceId: adminId
    });
    
    console.log("Admin created! Email: admin@mmps.com, Password: password123");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
