import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/products.json");

router.get("/", async(req,res)=>{
    const products = await productManager.getProducts();
    res.render("home", {products:products});
});

router.get("/realtimeproducts", (req,res)=>{
    res.render("realTimeProducts");
});

export {router as viewsRouter}