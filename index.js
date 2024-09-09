const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Conección a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/ADS");
    console.log("Conexión a MongoDB exitosa");
  } catch (err) {
    console.error("Error al conectar a MongoDB", err);
    process.exit(1);
  }
};

connectDB();

//Esquema del modelo de productos
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
});

const Product = mongoose.model("products", productSchema);

// Consultar productos
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send("Error al obtener los productos");
  }
});

// Crear un nuevo producto
app.post("/newProduct", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).send("Error al crear el producto");
  }
});

// Actualizar un producto
app.put("/updateProduct/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).send("Error al actualizar el producto");
  }
});

// Eliminar un producto
app.post("/deleteProduct", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      id: req.body.id,
    });
    if (!deletedProduct) {
      return res.status(404).send("Producto no encontrado");
    }
    res.json(deletedProduct);
  } catch (err) {
    res.status(500).send("Error al eliminar el producto");
  }
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log("Servidor corriendo en el puerto 3001");
});
