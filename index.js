const express = require("express");
const app = express();
const path = require("path");
const mongoose = require ("mongoose");

const ejsMate = require("ejs-mate");
app.engine("ejs" , ejsMate);
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"views"));
app.use (express.static("public"));
app.use(express.static(path.join(__dirname , "public")));
const methodOverride= require("method-override");
app.use(methodOverride('_method'));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

main()
.then (()=>{
    console.log("connected")
})
.catch((err)=>{
    console.log(err);
})

const Review = require ("./models/review.js")
const listing = require("./models/listing");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require ("./utils/ExpressError");
const {listingSchema} = require("./schema.js")
const{reviewSchema} = require("./schema.js");


const validateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    console.log(result)
    if(result.error){
        throw new ExpressError(400,result.error)
    }
    else {
        next()
    }
}
// const validateReview = (req,res,next)=>{
//     let result = reviewSchema.validate(req.body);
//     console.log(result)
//     if(result.error){
//         throw new ExpressError(400,result.error)
//     }
//     else {
//         next()
//     }
// }


app.listen(8080,()=>{

    console.log("Listening");
})

app.get("/",(req,res)=>{
    res.send("Working root")
})

app.get("/testlisting", (async (req,res,next)=>{
    try{
        let sampleListing = new listing ({
            title : "My new Vila",
            description : "BY the beach",
            price : 1200,
            location : "South Goa",
            country : "India"
        })
    
        await sampleListing.save();
        console.log("sample saved")
        res.send("Successful")
    }catch(err){
        next(err)
    }
    
}))


app.get("/listings", async (req,res,next)=>{
    try{
        let allListings = await listing.find({})
        res.render("./listing/index.ejs" , {allListings});
    }catch(err){
        next(err)
    }


        
    
    

})



app.get("/listings/:id", (async (req,res,next)=>{
    try{
        let {id} = req.params;
    let seeListing = await listing.findById(id).populate("reviews");
    console.log(seeListing)
    res.render("./listing/show.ejs" , {seeListing})
    }catch(err){
        next(err);
    }
    

}))



app.get("/add" ,  (req,res)=>{

    res.render("./listing/new.ejs")

})

app.post("/listings" , validateListing, (async (req,res,next)=>{
    try{
       
       
        let title = req.body.title;
        let description = req.body.description;
        let image = req.body.image;
        let price = req.body.price;
        let location = req.body.location;
        let country = req.body.country;
        let newList =  new listing({
            title : `${title}`,
            description : `${description}`,
            image :`${image}`,
            price : `${price}`,
            location : `${location}`,
            country : `${country}`
        })
        
        await newList.save();
        // let result = listingSchema.validate(req.body)
        // console.log(result)
        res.redirect("http://localhost:8080/listings");
    } catch(err){
        next(err)
    }


    
    
}))

app.delete ("/listings/:id" ,async (req,res,next)=>{
    try{
        let {id}= req.params;
    await listing.findByIdAndDelete(`${id}`)
    res.redirect("http://localhost:8080/listings")
    }catch(err){
        next(err)
    }
    
})

app.get("/edit/:id",  async(req,res,next)=>{
    try{
        let {id} = req.params;
        let seeListing = await listing.findById(`${id}`)
        res.render("./listing/edit.ejs" , {seeListing});
    }catch(err){
        next(err)
    }
   
})

app.put("/listings/:id" , validateListing , async (req,res,next)=>{
    try{
        let {id}= req.params;
    let title = req.body.title;
    let description = req.body.description;
    let image = req.body.image;
    let price = req.body.price;
    let location = req.body.location;
    let country = req.body.country;
    await listing.findByIdAndUpdate(id,
        {title : `${title}`},
       
    )
    await listing.findByIdAndUpdate(id,
        {description : `${description}`},
       
    )
    await listing.findByIdAndUpdate(id,
        {image: `${image}`},
       
    )
    await listing.findByIdAndUpdate(id,
        {price: `${price}`},
       
    )
    await listing.findByIdAndUpdate(id,
        {location : `${location}`},
       
    )
    await listing.findByIdAndUpdate(id,
        {country : `${country}`},
       
    )
    res.redirect(`http://localhost:8080/listings/${id}`)
    } catch(err){
        next(err)
    }
    

    

})

app.post("/listings/:id/reviews" , async(req,res,next)=>{
    try{
        let Listing =await listing.findById(req.params.id)
        let newReview = new Review (req.body.review)
    
        Listing.reviews.push(newReview);
        await newReview.save();
        await Listing.save();
        res.redirect(`/listings/${Listing._id}`)
    }catch(err){
        next(err);
    }
   
})


app.all("*", (req,res,next)=>{
    next (new ExpressError(404,"page not found!"))
})

app.use((err,req,res,next)=>{
    
    
    let {status=500 , message="Something went wrong"}= err;
    
    res.status(status).render("error.ejs" ,{ message})
})