module.exports = {
    getError (err,prop){
        try{
            return err.mapped()[prop].msg
            //++ err.mapped(), will turn array from log into an obj
            //++ [prop].msg, lookup appropriate properties of msg
            //* giving, email:{msg:"val"}, password:{msg:"val"}
        } catch (err){
            return "";
        }}};
