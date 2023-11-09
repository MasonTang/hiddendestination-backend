const mongoose = require('mongoose')
const User = require('./user')

const blogSchema = new mongoose.Schema({
    blog:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required: true
    },
    country:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    region:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required:true
    },
    date: {
        type:Date,
        default: Date.now
    }
})

blogSchema.pre('save', function (next) {
    // capitalize
    this.city.charAt(0).toUpperCase() + this.city.slice(1);
    next();
  });



const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog