/*
!Objectives
?1) Product Catalogue
++
?2) Cart Page
?3) Product Admin Panel (Authentication)
?4) Product Creation Form (Authentication)
?5) Admin Registration
?6) Admin Login

!npm cmd
? npm run dev ---> Run nodemon with index.js

!Authentication
?Request Cookies
* 1) Browser makes request to sever
* 2) When a server responds back to the browser, they can DECIDE to attach a cookie in the request
* 3) A cookie is a small string of chars that the servers wants the browser to store
* 4) Server sends over cookies and tells browser to include this small string of char with every follow up request
++ Server referring to particular domain url, e.g google.com, airbnb.com
* 5) Browser sends request with cookies in the future
* 6) Cookie is the core of the vast majority of authentication
* 7) It is what going to allow us and many applications out there in general to identify users who are coming to an application and making
* series of request.

!Authentication Problem
*Revisit lecture 374

++Cookie Session Package
* 1) Open up page inspect, navgiate to network tab before making any REQUEST
* 2) Check set-cookie, for the encrypted format of ---->req.session.userId<----
*
*
*

!Hashing Algorithm
++ Encrypt password ito a series of string char
++ By not hashing, anyone who is able to view the DB file, will be able to milliciously not just view user credentials but use those credentials
++ and access on other platforms with it. E.g BANK Account!
?Google sha256 calculator for hashing calculator
* 1) User passwor is collected
* 2) Password is ran through hashing algorithm, 
* 3) Output from algorithm is stored in DB instead of password itself
* 4) When user login again, ENTERED password is hashed again then compared with HASH value in DB

!Rainbow table Attack
? Deciphering hash values out of common password used by user
? Day to day hackers will have a list of common password that have ran through various hash algorithm
? Upon accessing DB with hash values, can easily run a find match hashed value and easily exploit user credentials

*/

/*
*============================================================================================================================================================================
*============================================================================================================================================================================
*============================================================================================================================================================================
*============================================================================================================================================================================
*/

/*
!Project Data Store
? Working with products.json & users.json in hard drive
++ 1) Error if try to open/write same file twice at same time
++ 2) Work work if we have multiple servers running on diff machines
++ 3) Have to write to file system(FS) every time we want to update some data
!NOT FOR COMMERCIAL USAGE
?Good for pratice with class & inheritance, practicing JavaScript

?Data store will have two class to manage users & products individually
*List of user / List of Products
*User/Products Repository Class

?CRUD Methods with JS

!INDUSTRY KNOWLEDGE
?Having a class to manage Data
*2 Approach out there
++  1) Repository Approach - A single class (repository) responsible for data access. All records are sotred and used in plain JS Obj 
++  2) Active Record Approach - Every record is an instance of a 'model' class that has methods to save, update, delete this record.
?Each have their own benefits

*/

/*
*============================================================================================================================================================================
*============================================================================================================================================================================
*============================================================================================================================================================================
*============================================================================================================================================================================
*/

//! Acting bodyParser method in code
//!Signup POST Handler
//? Middleware bodyParser(Self-created)
//*V1==== app.post('/',bodyParser,(req, res)=>{
//++ bodyParser.urlencoded = Handle information coming specficially from HTML form
//*V2==== app.post('/',bodyParser.urlencoded({extended:true}),(req, res)=>{
//++ With app.use(bodyParser.urlencoded({extended:true})), above code is not needed as middleware in route
//*V3 === Middleware to validate inputs = check('username').isEmail()
//? Sanitization is done first then followed by Validation
router.post('/signup',[
    check('email')
    .trim() //* Remove leading whitespace
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")//* Error msg on signup, in obj prop
    .custom(async email =>{
     const existingUser = await usersRepo.getOneby({email}); //++ Check if user has sign up before
     if (existingUser){
         throw new Error("Email already in use");
     }
    }),
    check('password')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage("Must be between 4 to 20 characters")//* Error msg on signup, in obj prop
    ,
    check('passwordConfirmation')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage("Must be between 4 to 20 characters")//* Error msg on signup, in obj prop
    .custom(async (passwordConfirmation,{req}) =>{
     if (passwordConfirmation !== req.body.password){
         throw new Error("Password does not match");
     }
    }),
   ], async(req, res)=>{}
)
/*
const bodyParser = (req,res,next)=> {
    if(req.method==="POST"){
        ++ .on is same as using addEventListener in js 
        req.on('data', data =>{
        const parsed = data.toString("utf8").split("&");
        const formData = {};
        for (let pair of parsed){
            const [key, value] = pair.split('=');
            formData[key] = value;
        }
        * console.log(formData);
        for (let fd in formData){
            console.log(`From bodyParser ${fd}: ${formData[fd]}`);
        }
        req.body= formData;
        next();
    });
    * it will print the information is buffer format
    * Buffer is raw information
    }
    else{
        next();
    }
};
 */

/*
*============================================================================================================================================================================
*============================================================================================================================================================================
*============================================================================================================================================================================
*============================================================================================================================================================================
*/




/*

! From Sec 29 Refactoring onwards 
* To avoid a giantic file with many file to load
? 1) Routes
? 2) Repositories
? 3) Views

!Routes
* Handling routes for URL

*const authRouter = require("./routes/admin/auth"); //++ Handling routes through module.export Pt1
*app.use(authRouter); //++ Handling routes through module.export Pt2, make sure is in sequence of dependant codes

!Repositories Folder
* Hold information on handling data

!Views Folder
* Rendering websites

!HTML Templating Libraies
? 1)Pub/Jade
? 2)HAML
? 3)Mustache
? 4)EJS

!Layout File
*Serves as default layout to diff pages
? 1) Header (Html to Body)
? 2) Footer (/Body to /HTML)
++ Can have developer/admin layout & customer layout

!GO WTACH PUBLIC DIRECTORIES, FOR PUBLIC ROUTE EXPLAINATION 1.30 to 2.30 & 3.45 to 4.50
? Project/Public = Any file or any folder in public directory will be viewable through DevTools
? Is used to place JS, Fonts, CSS, Graphics to make available to public
++ Not for JS code intented to be use by server
* app.use(express.static('public')); --> Code to make folder available to browser
?Which triggers change in request
? EXPRESS will change sequence of req and lookup in public directory for match automatically EVERYTIME
? Before it lookup the req in other codes

!Form Info
?Method indicate how to transmit info
#enctype indicate how to get information out of a form and get it to be transmited
% enctype = "application/x-www-form-urlencoded" (Default)
* urlencoded = take form info and make it safe for transport inside of a URL, can be seen in network tab
? enctype="multipart/form-data"
* Transmit info in bit like E.g @$%^%%!HUY@$!%^$%!
# bodyparser only pickup url encoded request

! npm i multer (Multifrom handler)
*const upload = multer({storage: multer.memoryStorage()}); //! Fixed to come after router
? upload is a middleware
* console.log(req.file) //# prints object with multer data
* buffer is an array with raw data inside of it

!Browser & Server Communication
# 1) Browser communicating directly with Server
? Can't handle 500 000 user traffic
# 2) Browser communicating with Load Balancer then to several browsers
? Load balancer rcv incoming request, and then forward the req random to one of the diff servers, each server running the exact same code base
? Able to handle far greater number of server
? Common Web App usage

!4 Diff ways of handling img uploads (WORST TO BEST), BEST approach may sometime be overkill
# 1) Co-lcated Disk (WORST Approach)
? Most commonly mentioned method to handle img upload
? Browser -> Load Balancer -> Server HardDrive
% a) Img sent to load balancer then forward to one of the servers
% b) then img is stored in the server harddrive
++ Approach is good for browser to server directly communicating WITHOUT a load balancer and is bad for scaling, ESPECIALLY WHEN APP WILL EVER HAVE ONLY ONE SERVER
++ Bad because load balancer randomly commuicate with server, and as soon as there's more then one server. This way of storing is not advise
# 2) Database (Not Great Approach)
? Similar to Method 1 but instead of storing it, in its own harddrive, all the diff svr share the same DB
? Browser -> Load Balancer -> Server -> Database
++ Bad because, expensive to store database on DB. If server get 1,500 000 img uploads a day and each img size is 200KB
# 3) Stream Through Database (OK APPROACH)
? Instead of storing it on local DB, file is stored on a cloud server.
? E.g (Amazon S3, Digital Ocean Spaces, Google Cloud Storage)
? Browser -> Load Balancer -> Server -> Cloud Storage
? The diff server sends data to cloud server
++ Better because cheaper than storing it on local DB
# 4) Presigned URL (BEST APPROACH)
? DevOps approach which requires sign up & payment
? Browser makes inital req to server, to prompt server of incoming transmission 
? Svr sends a temporary presigned URL to server containing token, that handles only one upload
? Browser uses presigned URL to directly send data to Cloud Data Storage, without communicating with the load balancer or server as performed by earlier 3 methods
? Browser -> Server -> Presigned URL-> Browser -> Cloud Storage
++ Best because, Server doesn't handle much request on upload

!App Approach here
? Take file uploaded and converts to string to be used for storage inside products.json
? Use the string that represents the img and created a new record out of it using product repository that will store in products.json
* req.file.buffer.toString('base64'); //# Safely represent an img in string format 

!Middleware Sequence
? In index.js, bodyParser is wired up to parse the contents of post request, specifically that info
? to give us access to info inside req.body //! But because we are using a diff FORM encoding.
? bodyParser no longer applies and no longer running for our incoming req.
? So is no long parsing the contents of the post req and, in all other form submission, it usually goes through the the index.js middleware
? all post request of forms usually goes through express.static, bodyParser & cookieSession plus more
# but in post route of "/admin/products/new", req.body is not parse until the middleware //! upload.single('image'), thus not able to call middleware method to log error
? a later code of "const { title, price } = req.body;" is able to initialize cuz of //! upload.single('image')
? multer does not only take care of incoming images or files that use uploaded, it all parses all the diff text fields, thus 
? upload.single('image') give title & prices value in req.body

* Example 1
* router.post(
*    "/admin/products/new",
*    upload.single('image'),
*    [requireTitle,requirePrice]
*    ,async (req, res)=>{
*    const err = validationResult(req);
*
*    if(!err.isEmpty()){
*        res.send(productsNewTemplate({ err }));
*    }
*    // console.log(err);
*    const img = req.file.buffer.toString('base64'); 
*    // console.log(img);
*    // const img = req.file.buffer.toString('base64'); //! Safely represent an img in string format 
*    const { title, price } = req.body;

*    await productsRepo.create({ title,price,img });
*        //? productsRepo.create helps to save data into product.json
*    res.send("Submitted");
*})

? Correction for Ex 1
* router.post(
*    "/admin/products/new",
*    upload.single('image'), <-----------Reposition from below
*    [requireTitle,requirePrice]


!Edit Route
* <a href="/admin/products/${product.id}/edit"> ===> //# Always lead to get request
* <form><button class="button is-danger">Delete</button><form> //# Allow direct post route or more

!
* <input hidden value="${product.id}" name="prodId"/> //# alternative to form action /cart/products/:id, gets via req.body too. Input remains hidden

!Cart logic
? Considerations: 
? 1) For users without account to be able to order as well
? 2) For Cart Database to have a record of products & user to purchase
? 3) Promotions Consideration (Not properly implemented though)
# Coding Flow
% 1) Generate random Cart ID & store it on user cookie on add to cart event
% 2) Browser interacts with server which will look up current Product Database for Prod-ID,title, price & img
% 3) Server add new Data to CARTS db with Invoice No, Cart-ID/User-ID, Prod-ID, Quantity. (Can be better revise) 
% 4) Need to Data Model for rendering previous purchases. User to UserInvoice with Cart ID
% 
% 

// Rcv POST req to add an item to Cart
router.post("/cart/products", async (req, res)=>{
    // Figure out the cart
    let cart;   //Allows lexical scope access 
    if(!req.session.cartId) {
        //No cartID, create one
        // Store cartID on req.session.cartId property
        cart = await cartsRepo.create({ items:[] });;
        req.session.cartId = cart.id;
    } else {
        //Have cart ID, Get data from repository
        cart = await cartsRepo.getOne(req.session.cartId);
    }
    //Either increment quantity for existing prod

    //OR add new products to items array
    //console.log(req.body.prodId); //# Add to cart btn, product ID
    console.log(cart);

    res.send("Added")
})

*/