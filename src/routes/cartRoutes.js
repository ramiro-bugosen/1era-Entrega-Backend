import { Router } from "express";
import { CartManager } from "../cartManager.js";
import { ProductManager } from "../ProductManager.js";

const router = Router()
const cartManager = new CartManager("./src/carts.json");
const productManager = new ProductManager("./src/products.json")


router.post("/", async (req, res) => {
    try {
      await cartManager.createCart();
      res.json({ message: "Carrito creado correctamente" });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

  router.get("/:cartId", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cartId); 
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json(cart);
        } 
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
});  

router.post("/:cartId/products/:productId", async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const product = await productManager.getProductById(productId);
        if (!product) {
            throw new Error("Producto no encontrado.");
        }
        await cartManager.addProductToCart(cartId, productId, 1);

        res.json({ message: "Producto agregado al carrito correctamente" });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

export {router as cartRouter}