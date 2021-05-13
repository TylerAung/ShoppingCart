const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");//++ Handling routes through module.export Pt1
const adminproductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartsRouter = require('./routes/carts')
const app = express();
app.use(express.static('public'));//! Make everything inside public library available to outside world
app.use(bodyParser.urlencoded({extended:true}));//++ Helps bypass bodyParser middleware usage in route
app.use(
    cookieSession({
    keys: ['eufheuiw123']//* Use to encrypt session (PERMANENT KEY)
    })
);
//! Express comes with bodyParser so no longer need to install as dependency



// const crypto = require("crypto");
// console.log(crypto);
/* 
? Express takes consideration of PATH ("/") & Method ("GET")
? ROUTER takes the path & method that comes from request and call the relevant function for it
? Express is able to create HTML from res.send
*/

app.use(authRouter); //++ Handling routes through module.export Pt2,make sure is in sequence of dependant codes
app.use(adminproductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

//++ Local Host, this runs HTTP request
app.listen(3000, ()=>{
    console.log("Listening");
});


