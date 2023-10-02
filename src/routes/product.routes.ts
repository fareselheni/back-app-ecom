import express from "express";
import * as productController from "../controllers/product/product.controller";
// const productController = require("../controllers/product.controller")
const router = express.Router();
//import for multer file upload
import multer from 'multer'
// const multer = require("multer");
import path from "path";
import { v4 as uuidv4 } from "uuid";


// ----------------function to store file in folder--------------//
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
  cb(null, path.join(__dirname, "../public/images"));
},
  filename: function (req: any, file: any, cb: any) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});
//------------------------function to filter file type------------//
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
let upload = multer({ storage, fileFilter });
//--------------- add product-----------------------------//
router.post("/add", upload.single("image"), async (req: any, res: any) => {
  try {
    const { title, description, category } = req.body;
    
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }
    
    const image = req.file.filename;
    const product = await productController.addProduct(
      title,
      description,
      category,
      image
    );
    
    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//------------------add pricing---------------------------//
router.post("/addPricing", async (req: any, res: any) => {
  const { productId, country, price } = req.body;
  const product = await productController.addPricing(productId, country, price);
  res.json(product);
});
//-------------------- get price by country and product id-----------------//
router.get("/price", async (req: any, res: any) => {
  const { productId, country } = req.query;
  const price = await productController.getProductPriceByCountry(
    productId as string,
    country as string
  );
  res.json({ price });
});

//----------------------get all products------------------------//
router.get('/products', async (req, res) => {
  try {
    const products = await productController.getAllProducts();
    res.json({ products });
  } catch (error) {
    // Handle errors here
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get("/productById/:productId", async (req: any, res: any) => {
  try {
    const productId = req.params.productId;

    // Update the product by ID
    const Product = await productController.getOneProduct(
      productId,
    );

    res.json(Product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update product by ID
router.put("/update/:productId", upload.single("image"), async (req: any, res: any) => {
  try {
    const productId = req.params.productId;
    const updateFields: {
      title?: string;
      description?: string;
      category?: string;
      image?: string;
    } = {};

    // Check if specific fields are provided in the request
    if (req.body.title) {
      updateFields.title = req.body.title;
    }
    if (req.body.description) {
      updateFields.description = req.body.description;
    }
    if (req.body.category) {
      updateFields.category = req.body.category;
    }
    if (req.file) {
      updateFields.image = req.file.filename;
    }

    // Update the product by ID with the specified fields
    const updatedProduct = await productController.updateProduct(
      productId,
      updateFields
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete product by ID
router.delete("/delete/:productId", async (req: any, res: any) => {
  try {
    const productId = req.params.productId;

    // Delete the product and its related prices
    await productController.deleteProduct(productId);

    res.json({ message: 'Product and related prices deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//-----------------------get all countries----------------------//
router.get("/countries", async (req, res) => {
  const products = await productController.getCountryInfo();
  res.json({ products });
});

// other routes...

module.exports = router;