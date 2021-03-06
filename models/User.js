const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  email : {
    type : String,
    required : true,
    unique: true
  },
  password : {
    type : String,
    required : true
  }
});

UserSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')) return next;

    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err) return next(err);

        bcrypt.hash(user.password,salt,function(err,hash){
          if(err) return next(err);

          user.password = hash;
          next();
        });
    });
});

UserSchema.methods.comparePassword = function(canditatePassword,callback){
  bcrypt.compare(canditatePassword,this.password,function(err,isMatch){
    if(err) return callback(err);

    callback(null,isMatch);
  });
};

const User = mongoose.model('users',UserSchema);

module.exports = User;
