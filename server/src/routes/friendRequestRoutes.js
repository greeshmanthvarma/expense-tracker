import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router()

// Fetch sent friend requests
router.get('/sentfriendrequests', async (req, res) => {
    try {
        const sentRequests = await prisma.friendRequest.findMany({
            where: { senderId: req.userId },
            include: {
                receiver: {
                    select: {
                        id: true,
                        username: true,
                        profilephoto: true
                    }
                }
            }
        });
        res.json({ sentRequests });
    } catch (error) {
        console.error('Error fetching sent friend requests:', error);
        res.status(500).json({ error: 'Failed to fetch sent friend requests' });
    }
});

// Fetch received friend requests
router.get('/receivedfriendrequests', async (req, res) => {
    try {
        const receivedRequests = await prisma.friendRequest.findMany({
            where: { receiverId: req.userId },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        profilephoto: true
                    }
                }
            }
        });
        res.json({ receivedRequests });
    } catch (error) {
        console.error('Error fetching received friend requests:', error);
        res.status(500).json({ error: 'Failed to fetch received friend requests' });
    }
});

router.delete('/:id', async(req,res)=>{
  const {id}=req.params
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: "Invalid request ID" })
  }
  
  try {

    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        id: parseInt(id),
        OR: [
          {senderId: req.userId},
          {receiverId: req.userId }
        ]
      }
    })
    
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" })
    }
    
    await prisma.friendRequest.delete({
      where: {
        id: parseInt(id)
      }
    })
    
    res.status(200).json({ message: "Friend request deleted successfully" })
  } catch (error) {
    console.error('Error deleting friend request:', error)
    res.status(500).json({ message: "Error deleting friend request" })
  }
})

router.post('/send', async (req , res)=>{
  let {friendId} = req.body
  friendId = parseInt(friendId)
  if (!friendId || isNaN(Number(friendId))) {
    console.warn('Bad friendId:', req.body.friendId);
    return res.status(400).json({ message: "Invalid friend ID" });
  }

  if (req.userId === friendId) {
    return res.status(400).json({ message: "You cannot send a friend request to yourself." });
  }

  try{
    
    console.log("req.userId",req.userId)
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        senderId: req.userId,
        receiverId: friendId
      }
    })

      if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" })
    }
    
    
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { friends: true }
    })
    
    const isAlreadyFriend = user.friends.some(friend => friend.id === friendId)
    if (isAlreadyFriend) {
      return res.status(400).json({ message: "Users are already friends" })
    }
     
    console.log("req.userId:", req.userId, "friendId:", friendId);
    await prisma.friendRequest.create({
      data:{
        senderId: req.userId,
        receiverId:friendId
      }
      
    })
    
    res.status(200).json({ message: "Friend request sent successfully" })
  }catch (error) {
    console.error('Error sending request:', error); 
    res.status(500).json({ message: "Error sending request" });
  }
})



export default router