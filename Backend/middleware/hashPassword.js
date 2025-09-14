const bcrypt = require('bcryptjs');

let hashPassword = async function(next){

    if(!this.isModified('password')) 
        return next();

    const salt = await bcrypt.genSalt(12);
    this.password  =await bcrypt.hash(this.password,salt);
    next();

    

};

module.exports =  hashPassword ;