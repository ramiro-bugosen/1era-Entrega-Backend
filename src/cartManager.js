import fs from "fs";

export class CartManager {
    constructor(path) {
        this.filePath = path;
        this.carts = [];
    }

    async loadCarts() {
        try {
          if (this.fileExist()) {
            const contenidoString = await fs.promises.readFile(this.filePath, "utf-8");
            return JSON.parse(contenidoString);
          } else {
            return [];
          }
        } catch (error) {
          console.log(error.message);
          throw error;
        }
      }
    
      async saveCarts(carts) {
        try {
          await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, "\t"));
        } catch (error) {
          console.log(error.message);
          throw error;
        }
      }

    fileExist() {
        return fs.existsSync(this.filePath);
    }

    async GenerateId() {
        try {
          const carts = await this.loadCarts();
          return carts.length + 1;
        } catch (error) {
          console.log(error.message);
          throw error;
        }
      }

    async getCarts() {
        try {
            if (this.fileExist()) {
                const contenidoString = await fs.promises.readFile(this.filePath, "utf-8");
                this.carts = JSON.parse(contenidoString);
            }
            return this.carts;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cartId);
            return cart;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async createCart() {
        try {
          const carts = await this.loadCarts();
          const newCartId = await this.GenerateId();
          const newCart = {
            id: newCartId,
            products: [],
          };
          carts.push(newCart);
          await this.saveCarts(carts);
          console.log("Carrito creado");
        } catch (error) {
          console.log(error.message);
          throw error;
        }
      }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart.id === cartId);
            if (cartIndex !== -1) {
                const cart = carts[cartIndex];
                const productIndex = cart.products.findIndex(product => product.id === productId);
                if (productIndex !== -1) {
                    cart.products[productIndex].quantity += quantity;
                } else {
                    cart.products.push({ id: productId, quantity });
                }
                await this.saveCarts();
                console.log("Producto agregado al carrito.");
            } else {
                throw new Error("Carrito no encontrado.");
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
}