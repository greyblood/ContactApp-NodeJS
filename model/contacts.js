const fs = require('fs');


// Create directory (if unexist)
const dirPath = './data';
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

const mongoose = require('mongoose');
//Schema
const Contact = mongoose.model('Contact', {
    nama: {
        type: String,
        required: true,
    },
    email: {
        type: String,

    },
    phone: {
        type: String,
        required: true,
    },
});

module.exports = Contact;