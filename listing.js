const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title: 
     {type :String,
        required : true,
    },
    description :String,
    image : {
        type : String,
        default : "https://images.unsplash.com/photo-1533497702244-ec8fa36d7e10?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v ==="" ? "https://images.unsplash.com/photo-1533497702244-ec8fa36d7e10?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
        }
    ]

})

const listing = mongoose.model ("listing", listingSchema) 
module.exports = listing ;