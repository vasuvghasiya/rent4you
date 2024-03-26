const express = require("express")
const mongoose = require("mongoose")
const app = express();
// const path= require('path')
// const ejs= require('ejs')

// app.set("view engine", "ejs");
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.urlencoded({extended: true}));

main().then(() => {
    console.log("connection Establisheed");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Cardetails');
}

// const carSchema = new mongoose.Schema({
//     location: String,
//     pdate: String,
//     rdate: String,
//     img: String,
//     name: String,
//     seat: Number,
//     milage: String,
//     battery: String,
//     ac: String,
//     price: Number,
//     reviews: String,
//     day: Number
// })
// const userSchema= new mongoose.Schema({
//     name: String,
//     email:String,
//     phone:Number,
//     pan:String,
//     adhar:String
// })

// const User = mongoose.model("cars", carSchema);
// const user1=mongoose.model("userdetails",userSchema);
// const login= new mongoose.Schema({
//     fname:String,
//     email:String,
//     username:String,
//     password:String,
// })
// const logi=mongoose.model("logindetails",login)
// let s1= new logi({
//     username:"vasu",
//     password:"1010",
//     phone:9016819168,
//     email:"a@a"
// })
// s1.save()
// let us1 =  user1({
//     name:"vasu",
// })
// us1.save()
let car1 = new User({
    location: "Anand",
    pdate: "2024-04-2",
    rdate: "2024-04-4",
    img: "image/Audi_R8.jpg",
    name: "Audi R8",
    seat: 7,
    milage: "6.71 km/l",
    battery: "100%",
    ac: "AC",
    price:"17425.52",
    reviews: "25k",
    day: 2
})

car1.save().then(() => {
    console.log("insert");
}).catch((err) => {
    console.log(err);
})

// console.log(car1);

// app.get("/", (req, res) => {
//     res.render("data.ejs");
// })

// app.post("/find", async (req, res) => {
//     let {location} = req.body;
//     let result = await User.findOne({location: location})
//     res.render("show.ejs", {result})
// })
app.listen(5000, () => {
    console.log("server was start")
})