const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 4500;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zta4c.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const items = client.db("buyValley").collection("items");
  const orders = client.db("buyValley").collection("orders");

  /*----------- (Admin add product) ------------*/
  app.post("/addProducts", (req, res) => {
    const item = req.body;
    items.insertOne(item).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  /*------------ (Load all product in home page) --------*/
  app.get("/items", (req, res) => {
    items.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  /*------------- (Load data By user email) ----------------*/
  app.get("/order", (req, res) => {
    console.log(req.query.email);
    orders.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  /*----------------- (Check order add on database) -----------*/
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    orders.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  /*----------------- (Show single product which product user click) -----------*/
  app.get("/checkout/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    console.log(id);
    items.find({ _id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  /*----------------- (Admin delete item ) -----------*/
  app.delete("/deleteItem/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    items.deleteOne({ _id: id }).then((result) => console.log(result));
  });
});

app.listen(process.env.PORT || port);
