import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'
import {OAuth2Client} from 'google-auth-library'


const router= express.Router()
const clientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);
  


router.post('/register',async (req,res)=>{
  const{username,email,password}=req.body
  const hashedPassword= bcrypt.hashSync(password,8)
  
  try{
      const user= await prisma.user.create({
        data: 
        {
          username,
          email,
          password:hashedPassword
        }
      })
      res.status(201).json({ message: 'User registered successfully' })
   }catch(err){
    console.log(err.message)
    res.sendStatus(503)
   }
})

router.post('/login', async(req,res)=>{
  const{email,password}= req.body

  try{
    const user= await prisma.user.findUnique({
      where: { email },
      
    })
    if(!user){
      return res.status(403).send({message:'user not found'})
    }
    
    const passwordValid= bcrypt.compareSync(password,user.password)

    if(!passwordValid){
      return res.status(403).send({message:'wrong password'})
    }

    const token=jwt.sign({id: user.id, userphoto:user.profilephoto},process.env.JWT_SECRET,{expiresIn:'24h'})
    
    res.cookie('token',token,{
      httpOnly:true,
      secure:true,
      sameSite:'lax',
      maxAge:24 *60 *60*1000
    })
    res.status(200).json({user})
  }catch(err){
    console.log(err.message)
    res.sendStatus(504)
  }
  
})

router.post('/google', async(req,res)=>{
  const {token}= req.body
  
  try{
   
    const ticket= await client.verifyIdToken({
      idToken:token,
      audience:clientId
    })
    const {name,email,picture}=ticket.getPayload()
    let user = await prisma.user.findUnique({
      where:{
        email
      }
    })

    if(!user){
      user= await prisma.user.create({
        data:{
          username:name,
          email,
          profilephoto:picture
        }
      })
    }
    const jwtToken=jwt.sign({id: user.id, userphoto:user.profilephoto},process.env.JWT_SECRET,{expiresIn:'24h'})
    res.cookie('token',jwtToken,{
      httpOnly:true,
      secure:true,
      sameSite:'lax',
      maxAge:24 *60 *60*1000
    })
    res.status(200).json({user})

  }catch(err){
    console.log(err.message)
    res.sendStatus(504)
  }
})

router.post('/logout',(req,res)=>{
    res.clearCookie('token')
  res.sendStatus(200)

  })


export default router