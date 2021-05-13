const express = require('express');
const cartsRepo = require("../repositories/carts")
const productsRepo = require("../repositories/products")
const cartShowTemplate = require("../views/carts/show")
const router = express.Router();

// Rcv POST req to add an item to Cart
router.post("/cart/products", async (req, res)=>{
    
        // Figuring out the cart
        //Allows lexical scope access 
        let cart;   
        console.log("REQ SESSION",req.session);//! Help to solve problem with Edge on cartId been absent in cart.json
        if (!req.session.cartId) {
            //No cartID, create one
            // Store cartID on req.session.cartId property
            cart = await cartsRepo.create({ items: [] });
            req.session.cartId = cart.id;
            console.log(`IF: ${cart}`)
        } else {
            //Have cart ID, Get data from repository
            cart = await cartsRepo.getOne(req.session.cartId);
            console.log(`ELSE: ${cart}`)
        }
        console.log(`Outside: ${cart}`)
        //console.log(req.body.prodId); //# Add to cart btn event, listing product ID. prodId is HTML INPUT NAME
        //Either increment quantity for existing prod
         //OR add new products to items array
        
        //++ Checks for product ID in session
        const existingItem = cart.items.find(item => item.id === req.body.prodId);
        //++ If prod ID exist in session. Adds quantity to session
        if (existingItem){
            existingItem.quantity++;
        } else {
            //++ If prod ID does not exist in session. Add prod ID & product to session
            cart.items.push({ id: req.body.prodId, quantity: 1 });
        }
    
        await cartsRepo.update(cart.id, {
            items: cart.items
        });
    
     // console.log(cart);
        res.redirect('/cart');  //++ not good for continuing purchase

});
// Rcv a GET req to show all items in Cart
router.get("/cart", async (req, res) => {
    if(!req.session.cartId){
        return res.redirect("/");
    }
    
    const cart = await cartsRepo.getOne(req.session.cartId);

    for(let item of cart.items){
        const product = await productsRepo.getOne(item.id)
        item.product = product;
    }

    res.send(cartShowTemplate({ items: cart.items}));
});
// Rcv a POST req to delete an item from Cart
router.post("/cart/products/delete", async(req, res) => {
    // console.log(req.body.itemId);

    const { itemId } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);

    const items = cart.items.filter(item => item.id !== itemId);
    //If item doesn't match item id is product.json. Item is kept in cart, //% works in iteration for Items that is pulled up from json until match

    await cartsRepo.update(req.session.cartId, { items });
    res.redirect("/cart")
})

module.exports = router;