const express=require('express')
const cookieParser = require("cookie-parser")
const router=express.Router()
router.use(cookieParser())

const blogController=require('../controller/controll')
const {authMiddleware}=require('../middleware/auth')

router.get('/blog',blogController.home)
router.get('/blog/:id',blogController.singleBlog)
router.post('/blog/article',authMiddleware,blogController.upload.single('image'),blogController.creatBlog)
router.post('/blog/newuser',blogController.reguser)
router.post('/blog/login',blogController.loginUser)
router.get('/profile',blogController.userProfile)
router.get('/logout',blogController.logoutUser)
router.delete('/blog/:id',blogController.deleteArticle)
router.post('/blog/:id/newComment',blogController.makeComment)
router.put('/blog/article',authMiddleware,blogController.editBlog)




module.exports=router