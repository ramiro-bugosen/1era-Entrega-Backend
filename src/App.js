import express from "express";
import { productsRouter } from "./routes/productsRoutes.js";
import { cartRouter } from "./routes/cartRoutes.js";
import path from "path";
import { __dirname } from "./utils.js";
import {engine} from "express-handlebars";
import {Server} from "socket.io";
import { viewsRouter } from "./routes/viewRoutes.js";
import { ProductManager } from "./ProductManager.js";

const port = 8080;
const app = express();

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());

const productManager = new ProductManager("./src/products.json");
const httpServer = app.listen(port,()=>console.log("Servidor en linea"));
const io = new Server(httpServer);

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

app.use(viewsRouter);
app.use("/api/products",productsRouter);
app.use("/api/carts", cartRouter);

io.on("connection", async(socket)=>{
    console.log("cliente conectado");
    const products = await productManager.getProducts();
    socket.emit("productsArray", products);

    socket.on("addProduct",async(productData)=>{
        const result = await productManager.addProducts(productData);
        const products = await productManager.getProducts();
        io.emit("productsArray", products);
    });

    socket.on("deleteProduct", async (productId) => {
        await productManager.deleteProduct(productId);
        const products = await productManager.getProducts();
        io.emit("productsArray", products);
    });
});