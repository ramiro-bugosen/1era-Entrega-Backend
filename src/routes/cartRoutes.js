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
    }catch (error) {
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

/* router.post("/:cartId/products/:productId", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cartId);
        const productId = parseInt(req.params.productId);
        const product = await productManager.getProductById(productId);
        if (!product) {
            throw new Error("Producto no encontrado.");
        }
        await cartManager.addProductToCart(cartId, productId, 1);

        res.json({ message: "Producto agregado al carrito correctamente" });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
}); */

router.post("/:cartId/products/:productId", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cartId);
        const productId = parseInt(req.params.productId);
        const product = await productManager.getProductById(productId);
        if (!product) {
            throw new Error("Producto no encontrado.");
        }
        const carts = await cartManager.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex !== -1) {
            const cart = carts[cartIndex];
            const productIndex = cart.products.findIndex(product => product.id === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ id: productId, quantity: 1 });
            }
            await cartManager.saveCarts(carts);
            console.log("Producto agregado al carrito.");
        } else {
            throw new Error("Carrito no encontrado.");
        }
        res.json({ message: "Producto agregado al carrito correctamente" });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

export {router as cartRouter}