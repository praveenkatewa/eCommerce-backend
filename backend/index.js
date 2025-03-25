const express =require('express');
const app = express();
const mongoose = require('mongoose');
const cors=require('cors');

const router=require('./Router/UserRouter');

const supplierRouter = require('./Router/SupplierRouter')

require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

const PORT = process.env.PORT || 5000;

const mongoUrl=process.env.MONGO_URL;
mongoose.connect(mongoUrl).then(()=>{
  console.log('connected to database');
}
).catch((err)=>{
  console.log('error:',err);
});
app.use('/ecom',router);

app.use('/supplier',supplierRouter)

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})