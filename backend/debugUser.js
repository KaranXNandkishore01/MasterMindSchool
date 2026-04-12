const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const user = await User.findOne({ managementId: 'mastersagar_mgt' });
    if (user) {
        console.log("User found:");
        console.log("ManagementID:", user.managementId);
        console.log("Role:", user.role);
        console.log("Hashed Password:", user.password);
        
        // Test a manual match
        const bcrypt = require('bcrypt');
        const isMatch = await bcrypt.compare('Madam28$$', user.password);
        console.log("Password match test (Madam28$$):", isMatch);
    } else {
        console.log("User 'mastersagar_mgt' NOT found!");
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
