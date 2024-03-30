const mongoose = require("mongoose")
main().then(async () => {
  console.log("connection Establisheed");
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
  const User = mongoose.model("atlascars", carSchema);
  let cars = await User.find()
  // console.log(cars);
  await mongoose.disconnect();
  await mongoose.connect('mongodb+srv://vaghasiyavasu164:%40123vasur@cluster0.aneyuiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(async()=>{
    // console.log(cars);
    const AtlasCar = mongoose.model("cars", carSchema)
    for (let i = 0; i < cars.length; i++) {
      const carData = cars[i].toObject();
      await AtlasCar.create(carData);
      console.log(`Inserted car ${i+1}/${cars.length}`);
    }
  })
})
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Cardetails');
}