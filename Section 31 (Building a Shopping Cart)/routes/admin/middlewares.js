const { validationResult } = require('express-validator');

module.exports = {
    handleErrors(templateFunc, dataCb){
         return async (req,res,next) =>{
             const err = validationResult(req);
             if(!err.isEmpty()){
                 let data = {}; //# Help prevent undefinied if Prod ID ain't found, preventing error on templateFunc({ err, ...data })
                 if (dataCb){
                     data = await dataCb(req);
                 }
                 return res.send(templateFunc({ err, ...data }));
             }

             next();
             //# next was used because in the past, middleware had no promise
         }
    },
    requireAuth(req, res, next){
        if(!req.session.userId){
            return res.redirect('/signin')
        }
        next();
    }
}
//% Handles errors in validation
