import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router= express.Router()

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
  const{username,password}= req.body

  try{
    const user= await prisma.user.findUnique({
      where: { username: username },
      select: { id: true, username: true,email: true, password: true, profilephoto: true }
    })
    if(!user){
      return res.status(403).send({message:'user not found'})
    }
    
    const passwordValid= bcrypt.compareSync(password,user.password)

    if(!passwordValid){
      return res.status(403).send({message:'wrong password'})
    }

    const token=jwt.sign({id: user.id, userphoto:user.profilephoto},process.env.JWT_SECRET,{expiresIn:'24h'})
    
    res.json({token})
  }catch(err){
    console.log(err.message)
    res.sendStatus(504)
  }
  
})

export default router