const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    let user = await User.findOne({ managementId: 'mastersagar_mgt' });
    if (user) {
        console.log("User found. Updating password to 'Madam28$$'...");
        user.password = 'Madam28$$';
        await user.save();
        console.log("Password updated and hashed.");
        
        // Verify again
        const bcrypt = require('bcrypt');
        const isMatch = await bcrypt.compare('Madam28$$', user.password);
        console.log("Password match test after reset:", isMatch);
    } else {
        console.log("User not found. Creating user...");
        await User.create({
            managementId: 'mastersagar_mgt',
            password: 'Madam28$$',
            role: 'Management'
        });
        console.log("User created with password: Madam28$$");
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
