const socketClient = io();
const productList = document.getElementById("productList");
const createProductForm = document.getElementById("createProductForm");

createProductForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const formData = new FormData(createProductForm);
    const jsonData = {};
    for(const [key,value] of formData.entries()){
        jsonData[key]=value
    };
    jsonData.price = parseInt(jsonData.price);
    jsonData.stock = parseInt(jsonData.stock)
    console.log(jsonData);
    socketClient.emit("addProduct",jsonData);
    createProductForm.reset();
});

socketClient.on("productsArray", (dataProducts)=>{
    console.log(dataProducts);
    let productsElms="";
    dataProducts.forEach(product=>{
        productsElms +=
        `<li style= "padding: 30px";>
            <p>Nombre: ${product.title}</p><button onclick="deleteProduct(${product.id})">Eliminar producto</button>
        </li>`
    });
    productList.innerHTML=productsElms;
});


const deleteProduct = (productId)=>{
    socketClient.emit("deleteProduct", productId);
};