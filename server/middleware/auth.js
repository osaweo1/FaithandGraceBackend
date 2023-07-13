
const jwt =require('jsonwebtoken')

exports.authMiddleware=async(req,res,next)=>{

    const token=req.cookies.token
   
    
    if(token){
         jwt.verify(token,process.env.JWT_SECRET,(err,userInfo)=>{
             if(userInfo){
                 next()
             }else{
                 console.log(err)
             }
         })
    }
 
        
        

   

}


