const { Schema, default: mongoose } = require('mongoose')

// const mongoose= require('mongoose')
require('../models/database')
const user=new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const article=new Schema({
    category:{
        type:String,
        require:true
    },
    title:{
        type:String,
        require:true
    },
    content:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default: Date.now()
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    comments:[{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }]
    


} )
const comment=new Schema({
    commentText:{
        type:String
    },
    article_id:{
        type:Schema.Types.ObjectId,
        ref:'Article'
    },
    date:{
        type:Date,
        default: Date.now()
    },
    author:{
        type:String
    }

})




const User=mongoose.model('User',user)
const Comment=mongoose.model('Comment',comment)

const Article=mongoose.model('Article',article)

module.exports={Article,User,Comment}
