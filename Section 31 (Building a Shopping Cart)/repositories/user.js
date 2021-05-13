/*
! 1) Need to have a file to store our info into
! 2) Check if file exist first
! 3) async code cannot be written in constructor thus accessSync & writeFileSync is used
*Using fs.access(path,[model], callback)
*Write node ONLY in shell to write up NodeJS code in terminal, good for testing
*/
const fs = require('fs');
const crypto = require("crypto");
const util = require('util');
const Repository = require("./repository") //* Using it for Class inheritence, extending methods from share class

const scrypt = util.promisify(crypto.scrypt) //? To get scrypt via promise using NodeJS packages

class UsersRepository extends Repository{
   //!Retrieve a new user
   async create(attrs){
       //++ THIS Create function overwrites the create method from inheritence
    attrs.id = this.randomId(); //? Adds crpyto id to data id
    const salt =crypto.randomBytes(8).toString('hex');//?Generate salt for hashing
    //! Before util implementation
    // scrypt(attrs.password,salt,64,(err,buff)=>{
    //     const hashed = buff.toString('hex');
    // })
    const hashed = await scrypt(attrs.password,salt,64);//* with util implementation

    //!Before H&S Implementation
    //const records = await this.getAll();    //? Gets current list of record in json
    //records.push(attrs);    //? adds new record to collected data
    //write the updated 'records' array back to this.filename
    // console.log(`Records: ${records}`)//
    // console.log(`JSON Stringify: ${JSON.stringify(records)}`)
    //!//!After H&S Implementation
//    await this.writeAll(records); //* Changed this to add hashed & salt to dataset
    const records = await this.getAll();
    const record = {
        ...attrs,
        password: `${hashed.toString('hex')}.${salt}`
    };//++ logic behind password is indicating where hash start and where salt starts
    records.push(record);

    await this.writeAll(records);
   return record; //* Return record for user ID cookies 
    }
    //! Middleware for login, comparing with HASH & SALT Logic
    async comparePasswords(saved, supplied){
        //* saved = hashed+salt, supplied = login password
        /*
        const result= saved.split('.');
        const hashed = result[0]
        const salt = result[1]
        ++ Same as line below
        */
        const [hashed,salt] = saved.split('.');
        const hashSupplied = await scrypt(supplied,salt,64);//*64 is to be same as in create method
        return hashed === hashSupplied.toString('hex');

        //* Doesnt directly compare from here to another method, because parent function already call getOneby method
    }
}

module.exports = new UsersRepository("users.json")

// async checkForFile(){

// }
/*
const test = async () =>{
    const repo = new UsersRepository('users.json'); //Initilize new users.json file with class & its methods
    // const users = await repo.getAll() 
    // console.log(`All Users: ${users}`);
    // const user = await repo.update("cf57f56c", {xeffx: "YwfeewafY"});
    // await repo.create({email: "test@test.com", password:"password"});
    // const users = await repo.getAll() //console.log(users);
    //console.log(`Updated Collection: ${user}`);
    ?Filter
    const user = await repo.getOneby({email: "test1@test.com", password: "pass1"});
    console.log(user);
};
 */

//! Doiing export new UsersRepository("user.json") is better than new UsersRepository
//* Helps to prevent typo & additional new initialization is required files

/* Older  async getAll()
async getAll(){
     Version1
    ?Open the file called this.filename
    const contents = await fs.promises.readFile(this.filename,{
        encoding: "utf8"
    });
    ?Read its contents
    console.log(contents);
    ?parse the contents
    const data = JSON.parse(contents);
    ?Return the parsed data
    return data;
     
}

*/