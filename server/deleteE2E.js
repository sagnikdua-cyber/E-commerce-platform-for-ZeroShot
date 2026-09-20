const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async () => { 
  const res = await mongoose.connection.collection('products').deleteMany({ name: { $regex: 'E2E Test', $options: 'i' } }); 
  console.log('Deleted:', res.deletedCount); 
  process.exit(0); 
});
