const fs = require('fs');
const crypto = require("crypto");

module.exports = class Repository {
    constructor(filename) {
        if(!filename){
            throw new Error("Creating a repo requires a filename");
        }

        this.filename = filename;
        try{
        fs.accessSync(this.filename);
        }
        catch(err){
            fs.writeFileSync(this.filename,'[]');//Create new users.json file with empty array
            console.log(err);
        }
    }

    //! Handling All Creation route, but overwritten in user.js by same name
    async create(attrs){
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs)
        await this.writeAll(records);

        return attrs;
    }

    //!Retrieve All User Data
    async getAll(){
        return JSON.parse(
            await fs.promises.readFile(this.filename,{
            encoding: "utf8"
            })
        );
    }
    
    //! Create new user
    async writeAll(records){
        await fs.promises.writeFile(
            this.filename, 
            JSON.stringify(records,null, 4));
            //?Overwrite file in reporsitory with updated collection
            //?Null is where you can put method to evaluate data, 2 = indentation of string
    }
    //! Creating unique primary key
    randomId(){ 
        //* crypto.randomBytes(4) = Create 4 random bytes of crypto data
        return crypto.randomBytes(4).toString('hex'); //? Create new crypto & convert to string format
    }
    //! Find User by ID, okay to not throw error when not found
    async getOne(id){
        const records = await this.getAll();
        return records.find(record => record.id === id);
        
    }
    //! Delete record by ID
    async delete(id){
        const records = await this.getAll();
        //++ console.log(`Filter: ${records.filter(record => record.id !== id)}`); filter delete specify record
        const filteredRecords = records.filter(record => record.id !== id)
        await this.writeAll(filteredRecords);
    }
    //! Update a user, not acceptable to add in ID when input doesn't match, thus throw err
    async update(id, attrs){
        const records = await this.getAll();
        const record = records.find(record=> record.id === id); //++ records is reference, not using spread to copy, so record points rather then copies
        if (!record){
            throw new Error(`Record ${record} not found`);
        }
        Object.assign(record, attrs);   //++Takes everything from attrs and pass to record
        await this.writeAll(records);

        /*
        !const record  is a reference to a field inside the records array. 
        !So modifying record is modifying the field inside the records array.
        */
    }
    async getOneby(filters){
        const records = await this.getAll();
        for (let record of records){
            let found = true; //++ To help control the logic of looking up match, so if not found. Doesn't execute code
             for (let key in filters){
                 if (record[key] !== filters[key]){
                    found = false;
                 }
             }
             if (found) {
                 return record;
             }
        }
    }

}