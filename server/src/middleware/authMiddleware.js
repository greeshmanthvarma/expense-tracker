import jwt from 'jsonwebtoken'

function authMiddleware(req,res,next){
  
  const token = req.cookies.token
  

  if(!token){
    
    return res.status(403).json({message:"No token provided"})
  }

  jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
    if(err){
      
      return res.status(401).json({message:"Invalid Token"})
    }
    if(!decoded || !decoded.id){
      return res.status(401).json({message:"Invalid token payload"})
    }
    req.userId = decoded.id;
    next()
  })
}

export default authMiddleware