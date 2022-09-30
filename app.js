const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');

const {body, validationResult, check} = require('express-validator');
const methodOverride = require('method-override');
const session = require('express-session');
const parser = require('cookie-parser');
const flash = require('connect-flash');
require('./utils/db');
const Contact = require('./model/contacts');
const cookieParser = require('cookie-parser');
const e = require('connect-flash');

const app = express();
const port = 3000;

//Override Setup
app.use(methodOverride('_method'));

// EJS Setup
app.set('view engine','ejs');
app.use(expressEjsLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));

//flash configuration
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: {maxAge: 6000},
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

//Contact Page
app.get('/contact', async(req, res) =>{
    // Contact.find().then((contact) => {
    //     res.send(contact);
    // });

    const contacts = await Contact.find();

    res.render('contact', {
        title: 'Contact',
        layout: 'layout/main-layout',
        contacts,
        msg: req.flash('msg'),
    })
});

//Add contact
app.get('/contact/add', (req ,res) => {
    res.render('add-contact', {
        title: "Add New Contact",
        layout: 'layout/main-layout',
    });
} );

//Add contact process
app.post(
    '/contact',
    [
        body('nama').custom(async (value) => {
            const duplicate = await Contact.findOne({nama: value});
            if (duplicate){
                throw new Error('Name has been used');
            }
            return true;
        }),
        check('email', 'Invalid Email').isEmail(),
        check('phone', 'Invalid number').isMobilePhone('id-ID'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('add-contact',{
                title: 'Add New Contact',
                layout: 'layout/main-layout',
                errors: errors.array(),
            });
        }
        else{
            Contact.insertMany(req.body, (error, result) => {
             // Send flash message
             req.flash('msg', 'Contact Added Successfully');
             res.redirect('/contact');
           })
        }
    }
)
// //Delete contact
// app.get('/contact/delete:nama', async(req, res) => {
//     const contact = await Contact.findOne({nama: req.params.nama});
//     //res.send(req.body); to check parameter
//     if(!contact) {
//         res.status(404);
//         res.send('<h1>404</h1>');
//     }
//     else{
//         //Conctact.deleteOne({nama: req.params.nama});
//         Contact.deleteOne({ _id: contact._id}).then((result) => {
//             req.flash('msg', 'Contact Deleted'),
//             res.redirect('/contact');
//         })
//     }
// })

app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama}).then((result) => {
        req.flash('msg', 'Contact Deleted'),
        res.redirect('/contact');
    });
    // res.send(req.body);
});

//Edit data
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama});

    res.render('edit-contact', {
        title: "Edit Contact Data",
        layout: "layout/main-layout",
        contact,
    })
})

//Edit data process
app.put(
    '/contact',
    [
        body('nama').custom(async (value, {req}) => {
            const duplicate = await Contact.findOne({nama: value});
            if(value != req.body.oldNama && duplicate){
                throw new Error('Name has been used!');
            }
            return true;
        }),
        check('email', 'Invalid Email').isEmail(),
        check('phone', 'Invalid number').isMobilePhone('id-ID'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('edit-contact', {
                title: 'Edit Data',
                layout: 'layout/main-layout',
                errors: errors.array(),
                contact: req.body,

            });
        }
        else{
            Contact.updateOne(
                { _id: req.body._id },
                {
                    $set: {
                        nama: req.body.nama,
                        email: req.body.email,
                        phone: req.body.phone,
                    },
                }
            ).then((result) => {
                req.flash('msg', 'Contact Updated!');
                res.redirect('/contact');
            })
        }
    });

// Detail contact
app.get('/contact/:nama', async (req, res) => {
    //const contact = findContact(req.params.nama);
    const contact = await Contact.findOne({nama: req.params.nama});

    res.render('detail',{
        title: 'Contact Detail',
        layout: 'layout/main-layout',
        contact,
    });
});

//Homepage
app.get('/',(req, res) => {
    const mahasiswa = [
        {
            nama: 'abcd',
            email: 'ewa',
        },
        {
            nama: 'acd',
            email: 'asbwaj',
        },

    ];
    res.render('index', {
        layout: 'layout/main-layout',
        nama: 'abc',
        mahasiswa,
        title: 'Homepage',
    });
    console.log('this is home');
    
});

// About Page
app.get('/about', (req, res) => {
    res.render('about',{
        title: 'About',
        layout: 'layout/main-layout',
    })
})

app.listen(port, () => {
    console.log(`Mongo Contact App | Listening at http://localhost:${port}`);
})

