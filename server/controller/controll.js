
require('../models/database')
const multer=require('multer')
// const uuidv4 = require('uuid/v4')
const{Article,User,Comment}=require('../models/schema')
// const {parse}=require('node-html-parser')
const bcrypt=require('bcrypt')


const jwt=require('jsonwebtoken')
const { response } = require('express')


const DIR='./public/'
exports.home=async(req,res)=>{
    try{
        const response=await Article.find().sort({date:-1}).populate('createdBy',['username'])
        
        res.json(response)
    }
    catch(error){
        console.log(error)
    }
    
}

exports.singleBlog=async(req,res)=>{
    id=req.params.id
    console.log(id)
    try{
        const response=await Article.findById(id).populate('comments').populate('createdBy',['username'])
        if(response){
            console.log(response)
            res.json(response)
        }else{
            console.log('Error in populate')
        }
        

    }
    catch(error){
        console.log()
    }
}
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,DIR)
    },
    filename:(req,file,cb)=>{
        const filename=file.originalname.toLowerCase()
        cb(null,filename)
    }
})

exports.upload=multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})


exports.creatBlog=async(req,res,next)=>{
    const url = req.protocol + '://' + req.get('host')
    const {category,title,content,users}=req.body
    const pasContent=content
    // console.log(req.user)
    const token=req.cookies.token
   
    
    if(token){
         jwt.verify(token,process.env.JWT_SECRET,(err,userInfo)=>{
             if(userInfo){
                try {
                    const article=new Article({
                        category:category,
                        title:title,
                        content:pasContent,
                        createdBy:users,
                        image: url + '/public/' + req.file.filename,
                        createdBy:userInfo.id
                    })
            
                    article.save().then(
                        response=>{
                            if(response){
                                res.status(201).json({
                                    message:' blog saved successfuly'
                                })
                            }else{
                                res.status(500).json({
                                    message:'error'
                                })
                            }
                        }
                    )
                        
                        
                    
                   
                } catch (error) {
                    console.log(error)
                }
             }else{
                 console.log(err)
             }
        
    
        })
    }
}


exports.editBlog=async(req,res)=>{
    // const id=req.params.id
    const {postTitle,postContent,id}=req.body
    console.log(postTitle,id)
    try {
        // const blog=await Article.find({_id:id})
        if(id){
            const response=await Article.findOneAndUpdate({_id:id},{
                title:postTitle,
                content:postContent
            })
            if(response){
                res.send('Updated successfully')
            }else{
                res.status(401).send('Could not update')
            }
        }
    } catch (error) {
        console.log(error)
        // res.status(401).send('Error')
    }

}

exports.reguser=async(req,res)=>{
    const {userValue}=req.body
    console.log(req.body)
    console.log(userValue.username)
    const{username,password,repassword,email}=userValue
    if(username,password,repassword,email===''){
        res.status(500).send('Fields Cant be Empty')
    }
    try {
        if(password===repassword){
            let pass=bcrypt.hashSync(password,10)
            const response=await User.findOne({username:username,email:email})
            if(response){
                res.status(401).send(
                    'Username or Email Already in use'
                )
            }else{
                let newUser= new User({
                    username:username,
                    email:email,
                    password:pass
                })
                const result=await newUser.save()
                if(result){
                    res.status(201).send(
                        'User registered successfully'
                    )
                }else{
                    res.status(500).send(
                        'Could Not Register User'
                    )
                }
            }      
        }          
                
            
        
        
    } catch (error) {
        console.log(error)
    }

}

exports.loginUser=async(req,res)=>{
    console.log(req.body)
    const {username,password}=req.body
    try {
        const user=await User.findOne({username:username})
        if(!user){
            res.status(400).send({'message':'Invallid Username or Password'})
        }
        else{
            const passwordMatched=await bcrypt.compare(password,user.password)
            if(passwordMatched){
                // const username=user.username.toString()
                // const email=user.email.toString()
                // const userId=user._id.toString()
                jwt.sign({username:user.username,id:user._id},process.env.JWT_SECRET,{},(err,token)=>{
                    if(err){
                        console.log(err)
                        res.status(401).json({Error:'Error'})
                    }else{
                        console.log(token)
                        res.cookie("token",token,{ expiresIn:'10m'}).json('ok')
                        
                    }
                })
                 
                    
              
        
                
                
               
            }else{
                return res.status(400).json({Error:'Invalid Username or Password'})
            }
        }
        
    } catch (error) {
        res.status(400).json({Error:'Invalid Username or Password'})
    }
}
exports.userProfile=async(req,res)=>{
   const token=req.cookies.token
   
    
   if(token){
        jwt.verify(token,process.env.JWT_SECRET,(err,userInfo)=>{
            if(userInfo){
                console.log(userInfo)
                res.json(userInfo)
            }else{
                console.log(err)
            }
        })
   }

    
}

exports.logoutUser=async(req,res)=>{
    console.log('hello')
    res.cookie('token','',{
        maxAge:1,
    })
    res.send('successfull')
}

exports.deleteArticle=async(req,res)=>{
    id=req.params.id
   console.log((id))
   try {
        const response=await Article.deleteOne({_id:id})
        if(response){
            res.send('Deleted Successfully')
        }
        else{
            res.status(401).send('Could not delete')
        }
   } catch (error) {
        console.log(error)
   }
   

}

exports.makeComment=async(req,res)=>{
    const token=req.cookies.token
    console.log(token)
    const {comment}=req.body
    console.log(comment)
    const article_id=req.params.id
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,async(err,userInfo)=>{
            if(userInfo){

               try {
                    const newComment=new Comment({
                        commentText:comment,
                        author:userInfo.username,
                        article_id:article_id

                })
                const data=await newComment.save()
                if(data){
                    const updatecomment=await Article.updateOne({_id:article_id},
                        {
                            $push:{comments:data._id}
                        }
                        
                    )
                    if(updatecomment){
                        res.send('Comment add successfully')
                    }else{
                        console.log('error happend')
                    }

                }else{
                    res.status(401).send('Could not make comment')
                }

               } catch (error) {
                console.log(error)
                res.status(401).send('Could not make comment')
               }
                
            }
        })
    }
}