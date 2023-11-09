const mongoose = require('mongoose')

const citySchema = new mongoose.Schema({
    city:{
        type:String,
        required:true,
        trim:true,
    },
    country: {
        type: String,
        required:true,
        trim: true,
    },
    region: {
        type: String,
        required:true,
        trim: true,
    }
})

citySchema.pre('save', function (next) {
    // capitalize
    this.city.charAt(0).toUpperCase() + this.city.slice(1);
    next();
  });



const City = mongoose.model('City', citySchema)

module.exports = City