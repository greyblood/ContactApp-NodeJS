const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Tes',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

// //Schema
// const Contact = mongoose.model('Contact',{
//     nama: {
//         type: String,
//         required: true,
//     },
//     phone: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//     },
// })



// //Add data
// const contact1 = new Contact({
//     nama: 'ca',
//     phone: '0124593',
//     email: 'abc@gmail.com'
// });

// // save
// contact1.save().then((contact) => console.log(contact));

//Model for atlas MongoDB
// db.createCollection( "contacts",
//    { validator: { $or:
//       [
//          { phone: { $type: "string" } },
//          { email: { $regex: /@mongodb\.com$/ } },
//          { status: { $in: [ "Unknown", "Incomplete" ] } }
//       ]
//    }
// } )