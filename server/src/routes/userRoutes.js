import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router()

router.get('/me', async(req,res)=>{
  if(!req.userId){
    return res.status(401).json({ message: 'Unauthorized: User ID not found' })
  }

  try{
    const user= await prisma.user.findUnique({
      where:{
        id:req.userId
      },
      select:{
        id:true,
        username:true,
        profilephoto:true
      }
    })
    
    if(!user){
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json({user})
  }catch(error){
    console.error('Error fetching user:', error)
    res.status(500).json({ message: 'Error fetching user' })
  }
})

router.get('/search', async (req, res) => {
  if(!req.userId){
    return res.status(401).json({ message: 'Unauthorized: User ID not found' })
  }
  
  const { username } = req.query
  
  // Input validation
  if (!username || username.trim().length < 2) {
    return res.status(400).json({ 
      message: "Username must be at least 2 characters long" 
    })
  }
  
  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: username.trim(),
          mode: 'insensitive' // Case-insensitive search
        },
        id: {
          not: req.userId // Exclude current user
        }
      },
      select: {
        id: true,
        username: true,
        profilephoto: true
      },
      take: 10 // Limit results to prevent abuse
    })
    
    res.json({ users,
      count: users.length
     })
  } catch (error) {
    console.error('Error searching users:', error)
    res.status(500).json({ message: "Error searching users" })
  }
})

router.get('/friends', async (req, res) => {
  if(!req.userId){
    return res.status(401).json({ message: 'Unauthorized: User ID not found' })
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId
      },
      select: {
        username: true,
        profilephoto: true,
        friends: {
          select: {
            id: true,
            username: true,
            profilephoto: true
          }
        }
      }
    })
    
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    
    res.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ message: "Error fetching user profile" })
  }
})


router.put('/friends', async (req, res) => {
  if(!req.userId){
    return res.status(401).json({ message: 'Unauthorized: User ID not found' })
  }
  
  const { friendId } = req.body
  
  if (!friendId || typeof friendId !== 'number') {
    return res.status(400).json({ message: "friendId must be a valid number" })
  }
  
  try {
    // checking if the user exists or not
    const existingFriend = await prisma.user.findUnique({
      where: {
        id: friendId
      },
      select: { id: true }
    })
    
    if (!existingFriend) {
      return res.status(400).json({ message: "Friend ID is invalid" })
    }
    
    // Use a transaction to ensure both users are updated or neither are.
    const [user] = await prisma.$transaction([
      prisma.user.update({
        where: { id: req.userId },
        data: { friends: { connect: { id: friendId } } },
        select: {
          id: true,
          username: true,
          friends: {
            select: { id: true, username: true, profilephoto: true }
          }
        }
      }),
      prisma.user.update({
        where: { id: friendId },
        data: { friends: { connect: { id: req.userId } } },
      })
    ]);

    console.log('Friend added successfully for user:', user.username);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Update error:', error)
    res.status(500).json({ message: "Error adding friend" })
  }
})


router.delete('/friends', async (req, res) => {
  if(!req.userId){
    return res.status(401).json({ message: 'Unauthorized: User ID not found' })
  }
  
  const { friendId } = req.body
  
  if (!friendId || typeof friendId !== 'number') {
    return res.status(400).json({ message: "friendId must be a valid number" })
  }
  
  try {
    
    await prisma.$transaction([
      prisma.user.update({
        where: { id: req.userId },
        data: { friends: { disconnect: { id: friendId } } }
      }),
      prisma.user.update({
        where: { id: friendId },
        data: { friends: { disconnect: { id: req.userId } } }
      })
    ]);

    // Fetch the updated user with their new friends list to send back
    const updatedUser = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        friends: {
          select: {
            id: true,
            username: true,
            profilephoto: true
          }
        }
      }
    });
    
    console.log('Friend removed successfully:', updatedUser) 
    res.status(200).json({ user: updatedUser })
  } catch (error) {
    console.error('Remove friend error:', error)
    res.status(500).json({ message: "Error removing friend" })
  }
})

export default router