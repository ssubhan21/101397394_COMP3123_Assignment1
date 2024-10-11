const mongoose = require('mongoose')
const { isDate } = require('util/types')

const empSchema = mongoose.Schema({
    first_name: {type: String, maxLength:100, require: true},
    last_name: {type: String, maxLength:50, require: true},
    email: {type: String, maxLength: 50, unique: true},
    gender: {
        type: String, 
        maxLength: 25, 
        enum: ["Male", "Female", "Other"]
    },
    salary: {type: Number, require: true},
    date_of_joining: { type: Date, default: Date.now },
    department: {type: String, maxLength: 50} ,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model("employees", empSchema)