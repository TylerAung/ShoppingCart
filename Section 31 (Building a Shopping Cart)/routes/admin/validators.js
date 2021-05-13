const { check } = require('express-validator');
const usersRepo = require ('../../repositories/user');

module.exports = {
    requireTitle:check('title')
    .trim()
    .isLength({min:5, max: 40})
    .withMessage("Min of 5 Char to Max of 40 Char"),
    
    requirePrice:check('price')
    .trim()
    .toFloat()//++ For USD currency, but age wise. use toInt() maybe if IDR or THAI, toInt avoid decimal val
    .toFloat({min: 1}) //! Error here previously, cuz use toFloat, instead of isFloat. But isCurrency Solve it
    .isCurrency()//++ Helps to verify is a number
    .withMessage("Please put a valid Cost Price"),

    requireEmail:check('email')
    .trim() //* Remove leading whitespace
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async email =>{
     const existingUser = await usersRepo.getOneby({email}); //++ Check if user has sign up before
     if (existingUser){
         throw new Error("Email already in use");
     }
    }),

    requirePassword:check('password')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage("Must be between 4 to 20 characters"),
    
    reqPasswordCon: check('passwordConfirmation')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage("Must be between 4 to 20 characters")
    .custom(async (passwordConfirmation,{req}) =>{
     if (passwordConfirmation !== req.body.password){
         throw new Error("Password does not match");
     }
    }),

    reqEmailExist:check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must provide a valid email")
    .custom(async (email)=>{
        const user = await usersRepo.getOneby({email}); 
        //++ Lookup user exist in DB AND if user exist, email & pw is parsed in
        if(!user){
            throw new Error(`Email not found`);
                } //++ Check if user exist
    }),

    reqAuthPW:check('password')
    .trim()
    .custom(async(password, {req}) =>{
            const user = await usersRepo.getOneby({email:req.body.email});
            if(!user){
                throw new Error("Password Mismatch")
            }
            const validPassword = await usersRepo.comparePasswords(
                user.password,password
            );//++ Calls hashing & salt comparison logic
            if (!validPassword){
            throw new Error("Password Mismatch")
            }//++ Handles user pw mismatch
        })
}
