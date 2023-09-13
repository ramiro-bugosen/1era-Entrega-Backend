import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const router = Router()
const productManager = new ProductManager("./src/products.json");

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts();

        if ((limit)) {
            const limitProducts = products.slice(0, limit);
            res.json(limitProducts);
        } else {
            res.json(products);
        }
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
});

router.get("/:productId", async (req, res) => {
    try {
        const productId = parseInt(req.params.productId); 
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } 
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
});

router.post("/", async (req, res) => {
    try{
        const productInfo = req.body;
        const product = await productManager.addProducts(productInfo)
        res.send("Producto agregado")
    }
    catch(error) {
        res.json({status:"error", message:error.message});
    }
})

router.put("/:productId", async (req, res) =>{
    try{
        const productId = parseInt(req.params.productId);
        const productUpdate = req.body;
        const product = await productManager.updateProduct(productId, productUpdate)
        res.send("Producto actualizado")
    }catch (error) {
        res.json({status:"error", message:error.message});
    }
})

router.delete("/:productId", async (req, res) =>{
    try{
        const productId = parseInt(req.params.productId); 
        const product = await productManager.deleteProduct(productId);
        res.send("Producto eliminado")
    }catch (error){
        res.json({status:"error", message:error.message});
    }
})



export {router as productsRouter};