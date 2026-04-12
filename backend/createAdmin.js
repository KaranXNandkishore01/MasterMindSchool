const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const adminExists = await User.findOne({ managementId: 'mastersagar_mgt' });
    if(adminExists) {
        console.log("Management user already exists!");
        process.exit(0);
    }
    
    await User.create({
        managementId: 'mastersagar_mgt',
        password: 'Madam28$$',
        role: 'Management'
    });
    
    console.log("Management created! managementId: mastersagar_mgt, Password: Madam28$$");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
