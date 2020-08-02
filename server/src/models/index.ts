const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const liquidSchema = new Schema({
    name: {
       type: String,
       required: true
    }
}, {
    timestamps: true
});

const topingSchema = new Schema({
    name: {
       type: String,
       required: true
    }
}, {
    timestamps: true
});

const userSchema = new Schema({
    email: {
       type: String,
       required: true
    },
    password: {
       type: String,
       required: true
    }
}, {
    timestamps: true
});

const drinkSchema = new Schema({
    name: {
       type: String,
       required: true
    },
    topingId: {
       type: String,
       required: true
    },
    liquidId: {
       type: String,
       required: true
    },
    options: {
       type: String,
       enum:['LESS_ICE', 'NO_ICE', 'NO_SUGAR'],
       required: true
    }
}, {
    timestamps: true
});

var Users = mongoose.model('users', userSchema);
var Liquids = mongoose.model('liquids', liquidSchema);
var Topings = mongoose.model('topings', topingSchema);
var Drinks = mongoose.model('drinks', drinkSchema);
module.exports = {Liquids, liquidSchema, Topings, topingSchema, Drinks, drinkSchema, Users, userSchema};