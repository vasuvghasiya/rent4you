if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const path = require('path')

const bodyParser = require('body-parser');
const session = require("express-session");

const nodemailer = require('nodemailer');

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

app.use(session({
    secret: 'your_secret_key_here', // Change this to a long random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const url = process.env.ATLASDB_URL

main().then(() => {
    console.log("connection Establisheed");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(url);
}
const carSchema = new mongoose.Schema({
    location: String,
    pdate: String,
    rdate: String,
    img: String,
    name: String,
    seat: Number,
    milage: String,
    battery: String,
    ac: String,
    price: Number,
    reviews: String,
    day: Number
})
const login = new mongoose.Schema({
    fname: String,
    email: String,
    username: String,
    password: String,
    name: String,
    bemail: String,
    phone: Number,
    bdate: String,
    pan: String,
    adhar: String,
    add: String,
    suggestoin: String,
    carid: Array
})
const User = mongoose.model("cars", carSchema);
const logi = mongoose.model("logindetails", login)

app.get("/", async (req, res) => {
    let cars = await User.find()
    res.render("index.ejs", { cars, user: req.session.user });
})
app.get("/cars", async (req, res) => {
    let cars = await User.find()
    res.render("cars", { cars, user: req.session.user });
})
app.get("/about", async (req, res) => {
    res.render("about", { user: req.session.user });
})
app.get("/contact", async (req, res) => {
    res.render("contact", { user: req.session.user });
})
app.get("/login", async (req, res) => {
    res.render("login");
})
app.get("/signup", async (req, res) => {
    res.render("signup");
})
app.get("/profile", async (req, res) => {
    let user = req.session.user
let username = user.username
    let password = user.password
    let l1 = await logi.findOne({ username, password });
    let carIds = l1.carid
    const cars = await User.find({ _id: { $in: carIds } });
    res.render("profile", { cars, l1 });
})
app.post("/location", async (req, res) => {
    let { location, pdate, rdate } = req.body;

    if (!location || !pdate || !rdate) {
        return res.send('Please provide all fields: location, pdate, and rdate.');
    }
    let results = await User.find({ location: location, pdate: pdate, rdate: rdate });
    let loct = await User.findOne({ location });
    if (results.length > 0) {
        res.render("show.ejs", { results, loct });
    } else {
        res.send(`No data found for ${location} ,${pdate}and${rdate}`);
       }
});
app.post("/login", async (req, res) => {
    let { username, password } = req.body
    let l1 = await logi.findOne({ username, password })
    if (l1) {
        req.session.user = l1;
        res.redirect("/")
    }
    else {
        res.send("invalid password or username")
    }
})
app.post("/signup", async (req, res) => {
    const { fname, Email, username, password } = req.body;
    const existingUser = await logi.findOne({ username: username });
    if (existingUser) {
        return res.status(400).send('Username already exists');
    }
    let s1 = new logi({
        fname: fname,
        email: Email,
        username: username,
        password: password,
        name: null,
        bemail: null,
        phone: null,
        bdate: null,
        pan: null,
        adhar: null,
        add: null,
        suggestoin: null,
        carid: []
    })
    await s1.save()
    req.session.user = s1;
    res.redirect("/")
})
app.get("/logout", (req, res) => {

    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect("/");
    });
});
app.get("/:id", async (req, res) => {
    try {
        const car = await User.findById(req.params.id);

        if (!car) {
            return res.status(404).send("Car not found");
        }
        if (req.session.user) {
            res.render("book", { car });
        }
        else {
            res.redirect("/login")
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.post("/:id/pays2", async (req, res) => {
    const car = await User.findById(req.params.id);
    let { nameOnCard } = req.body
    let user = req.session.user
    let username = user.username
    let password = user.password
    let l1 = await logi.findOne({ username, password });
    l1.carid.push(car._id);
    await l1.save();

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'rent4youofficial@gmail.com', // Your email address
            pass: 'qqxi qvga icrk ctes' // Your email password
        }
    });

    let imagePath = path.join(__dirname, 'views', car.img);
    // Email content
    let mailOptions = {
        from: 'rent4youofficial@gmail.com', // Sender address
        to: l1.email, // List of recipients
        subject: 'Car Booking Successfull', // Subject line
        text: `Your car: ${car.name}\nLocation: ${car.location}\nPickup Date: ${car.pdate}\nReturn Date: ${car.rdate}`,
        attachments: [
            {
                filename: 'image.jpg', // Name of the attachment
                path: imagePath // Path to the image file
            }
        ]
    };
    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred:', error);
        }
        console.log('Message sent successfully!');
    });
    // car.location=null;
    // await car.save();

    res.render("payment-done", { car, nameOnCard });
})
app.post("/:id", async (req, res) => {
    const car = await User.findById(req.params.id);
    let { name, email, phone, bdate, pan, adhar, Address, message } = req.body
    let user = req.session.user
    let username = user.username
    let password = user.password
    let l1 = await logi.findOne({ username, password });
    l1.name = name;
    l1.bemail = email;
    l1.phone = phone;
    l1.bdate = bdate;
    l1.pan = pan;
    l1.adhar = adhar;
    l1.add = Address;
    l1.suggestoin = message;
    await l1.save();
    res.render("payment", { car, l1 });
})
app.listen(3000, () => {
    console.log("server was start")
})