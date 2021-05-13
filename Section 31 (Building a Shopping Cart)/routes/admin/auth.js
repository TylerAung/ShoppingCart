const express = require('express');
// const { validationResult } = require('express-validator'); //# removed due to handleErrors requiring it instead

const usersRepo = require ('../../repositories/user');
const { handleErrors } = require('./middlewares');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const { requireEmail, requirePassword, reqPasswordCon, reqEmailExist,reqAuthPW } = require('./validators');

const router = express.Router();

//! Renders Signup Form
//! req = get info, res = send info
router.get('/signup',(req, res)=>{
    res.send(signupTemplate({req})); //++ Calls function linked from module export in views
    // console.log(req.body);
});

//!Signup POST Handler
//? Middleware bodyParser(Self-created)
//*V1==== app.post('/',bodyParser,(req, res)=>{

//++ bodyParser.urlencoded = Handle information coming specficially from HTML form
//*V2==== app.post('/',bodyParser.urlencoded({extended:true}),(req, res)=>{
//++ With app.use(bodyParser.urlencoded({extended:true})), above code is not needed as middleware in route
//*V3 === Middleware to validate inputs = check('username').isEmail()
//? Sanitization is done first then followed by Validation
router.post('/signup',
            [requireEmail,requirePassword,reqPasswordCon],
            handleErrors(signupTemplate), 
            async(req, res)=>{
                const {email,password } = req.body;

                //? Create a user in our repo to represent this person
                const user = await usersRepo.create({email,password}); //*Alternative for email:email, password:password, provided same
                // console.log("This is user var: ",user);
                
                //? Store the id of that user inside the user cookie
                //* Using 3rd party cookie library, too notoriously tricky
                req.session.userId = user.id;//* Added by cookie session
                // console.log("This is req.session.userId",req.session.userId);
                res.redirect("/admin/products");//% Redirect on successful signup
            });

//! Render Signout Route
//? Ultimately remove cookie from browser
router.get("/signout", (req,res)=>{
    req.session = null;
    res.send(`YOU'RE LOGOUT`);
});

//! Renders Login Routee
router.get("/signin", (req,res)=>{
    res.send(signinTemplate({}));//* Added empty obj to deal with error
    // res.send(`YOU'RE LOGOUT`);
});

router.post("/signin",
                [reqEmailExist,reqAuthPW],
                handleErrors(signinTemplate)            
                ,async(req, res)=>{
                    // console.log(err);
                    const {email} = req.body; //++ Draws out information from session
                    const user = await usersRepo.getOneby({email});
                    req.session.userId = user.id; //* Make user authenticated with APP

                    res.redirect("/admin/products");//% Redirect on successful login
            })

module.exports = router;