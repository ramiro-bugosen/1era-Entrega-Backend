import express from "express";
import { productsRouter } from "./routes/productsRoutes.js";
import { cartRouter } from "./routes/cartRoutes.js";
 

const port = 8080;

const app = express();

app.use(express.json());

app.listen(port,()=>console.log("Servidor en linea"));

app.use("/api/products",productsRouter)
app.use("/api/carts", cartRouter)