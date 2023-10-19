const express = require('express')
const cors=require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5003;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//middleware
app.use(cors());
app.use(express.json());




//const uri = "mongodb+srv://<username>:<password>@cluster0.wv2vf1c.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wv2vf1c.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
console.log(uri);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection=client.db('productDB').collection('products')
    const addCartCollection=client.db('productDB').collection('addtocart')
    const brandCollection=client.db('productDB').collection('brandcard')

    app.get('/brandcard',async(req,res)=>{
      const cursor=brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })


    app.get('/products',async(req,res)=>{
      const cursor=productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

  app.post('/products',async(req,res)=>{
    const newProduct=req.body;
    console.log(newProduct); 

   const result=await productCollection.insertOne(newProduct);
   res.send(result)
   
 })
//  add to cart

app.get('/addtocart',async(req,res)=>{
 
  const cursor=addCartCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})
app.post('/addtocart',async(req,res)=>{
  const addtocart=req.body;
  console.log(addtocart); 

 const result=await addCartCollection.insertOne(addtocart);
 res.send(result)
 
})

app.delete('/addtocart/:id', async(req,res)=>{
  const id =req.params.id;
  console.log(id);
  const query={_id:new ObjectId(id)}
  const result = await addCartCollection.deleteOne(query);
  res.send(result);
})
//get bran name
app.get('/productsbybrand/:brand_name',async(req,res)=>{
  const brand_name = req.params.brand_name;
  query={brand_name: brand_name }
    const result = await productCollection.find(query).toArray();
  res.send(result);
})
// get operation for update products
app.get('/products/:id',async(req,res)=>{
  const id= req.params.id;
  const query ={_id: new ObjectId(id)}
 
  const result = await productCollection.findOne(query);
  res.send(result);
})

app.put('/products/:id',async(req,res)=>{
  const id =req.params.id;
  console.log(id);
  const filter={_id:new ObjectId(id)}
  const options={upsert:true};
  const updatedproduct=req.body;
  const product={
    $set:{
      name:updatedproduct.name,
      photo:updatedproduct.photo,
      upselectedOption:updatedproduct.upselectedOption,
      brand_name:updatedproduct.brandselectedOption,
      price:updatedproduct.price,
      rating:updatedproduct.rating,
      desp:updatedproduct.desp,
     
    }
  }
  const result = await productCollection.updateOne(filter,product,options);
  res.send(result)
})
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Brand crud running...')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  //brandshop
  //Bn4sUHN5uNlZQH2H