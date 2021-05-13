const express = require("express");
// const { validationResult } = require('express-validator'); 
//# (TOP) removed due to handleErrors requiring it instead
const multer = require('multer');

const { requireAuth ,handleErrors } = require('./middlewares');
const productsRepo = require ('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTempalte = require("../../views/admin/products/index");
const prodEditTemplate = require("../../views/admin/products/edit");
const {requireTitle, requirePrice} = require("./validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });//! Fixed to come after router

router.get("/admin/products",requireAuth, async (req, res)=>{
    const products = await productsRepo.getAll();
    res.send(productsIndexTempalte({ products }));
})

router.get("/admin/products/new",requireAuth, (req, res)=>{
    res.send(productsNewTemplate({}));
})

router.post(
    "/admin/products/new",
    requireAuth, //! Position here to prevent any upload transmission. (e.g postman)
    upload.single('image'),
    [requireTitle,requirePrice],
    handleErrors(productsNewTemplate)
    ,async (req, res)=>{
    // console.log(err);
    const img = req.file.buffer.toString('base64'); 
    // console.log(img);
    // const img = req.file.buffer.toString('base64'); //! Safely represent an img in string format 
    const { title, price } = req.body;
    await productsRepo.create({ title,price,img });
        //? productsRepo.create helps to save data into product.json
    res.redirect("/admin/products");//% Redirect on successful creation
})

router.get("/admin/products/:id/edit",requireAuth, async (req,res)=>{
    // res.redirect("/admin/products");//% Redirect on edit
    // console.log(req.params.id) //# :id = products ID = params.id
    const product = await productsRepo.getOne(req.params.id);
    console.log(product)
    if(!product){
        return res.send("Product not Found");
    }
    res.send(prodEditTemplate({ product }));
})

router.post("/admin/products/:id/edit",
            requireAuth, 
            upload.single('image'),
            [requireTitle,requirePrice],
            handleErrors(prodEditTemplate, async req=>{
                const product = await productsRepo.getOne(req.params.id);
                return {product };
            })
            ,async (req, res)=>{
        const changes = req.body;
            if(req.file){
                changes.img = req.file.buffer.toString("base64");
            }

            try{
        await productsRepo.update(req.params.id,changes)
                }
                catch(err){
                    console.log(err)
                    return res.send("Could not find Item")
                }

                res.redirect("/admin/products")
    }
)

router.post("/admin/products/:id/delete", requireAuth, async (req, res)=>{
        await productsRepo.delete(req.params.id)
        res.redirect("/admin/products")
    }
)

module.exports = router;
/*
? productsRepo.create helps to save data into product.json
*/
