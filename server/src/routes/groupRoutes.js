import express from 'express'
import prisma from '../prismaClient.js'


const router=express.Router()

router.post('/', async (req, res) => {
  
  const { name, members } = req.body;
  // members is an array of userIds that were selected
  
  if (!name ) {
    return res.status(400).json({ message: 'Group name is required.' });
  }

  if(!Array.isArray(members)){
    return res.status(400).json({ message: 'Group members are required.' });
  }

  try {
    
    // Using a Set to prevent duplicate IDs if the creator is already in members.
    const allMemberIds = [...new Set([req.userId, ...members])];

    const group = await prisma.group.create({
      data: {
        name,
        members: {
          connect: allMemberIds.map(id => ({ id })),
        },
      },
      include: {
        members: {
          select: { id: true, username: true, profilephoto: true },
        },
      },
    });
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: "Error creating group" });
  }
})

router.get('/',async(req,res)=>{
  try{
    const groups=await prisma.group.findMany({
      where:{
        members:{
          some:{
            id:req.userId
          }
        }
      },
      include: {
        members: {
          select: {
            id: true,
            username: true,
            profilephoto: true
          }
        }
      },
    })
    res.json({ groups })
  }catch(error){
    console.error('Error fetching groups:', error); 
    res.status(500).json({ message: "Error fetching groups" })
  }
})
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const groupId = parseInt(id);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid group ID.' });
  }

  try {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
        members: {
          some: {
            id: req.userId,
          },
        },
      },
      include: {
        members: {
          select: { id: true, username: true, profilephoto: true },
        },
      }
  });

    if (!group) {
      return res.status(404).json({ message: 'Group not found or you are not a member.' });
    }

    res.json({ group });
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Error fetching group' });
  }
});
router.put('/:id',async(req,res)=>{
  const { id } = req.params;
  const groupId = parseInt(id);

  
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid group ID.' });
  }

  const { name, members } = req.body;


  if (name !== undefined && typeof name !== 'string') {
    return res.status(400).json({ message: 'Group name must be a string.' });
  }
  if (members !== undefined && !Array.isArray(members)) {
    return res.status(400).json({ message: '`members` must be an array of user IDs.' });
  }
  
  try{

    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        members: { some: { id: req.userId } }
      }
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found or you are not a member.' });
    }


    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data:{
        name,
        members:{
          set:members.map(id =>({id:Number(id)}))
        }
      },
      include: {
        members: { select: { id: true, username: true, profilephoto: true } },
      },
    });
    res.json(updatedGroup);
  }catch(error){
    console.error('Error updating group:', error);
    res.status(500).json({ message: "Error updating group" });
  }
})

router.delete('/:id',async(req,res)=>{
  const {id}=req.params
  try{
    await prisma.group.delete({
      where:{
        id:parseInt(id),
        members:{
          some:{
            id:req.userId
          }
        }
      }
    })
    res.json({message:"Group Deleted"})
  }
  catch(error){ 
    console.error('Error deleting group:', error);
    res.status(500).json({ message: 'Error deleting group' });
  }
})

router.post('/:id/delete-member',async(req,res)=>{

  const { id } = req.params;
  const groupId = parseInt(id)
  const { memberId } = req.body;
  if (isNaN(groupId) || isNaN(memberId)) {
    return res.status(400).json({ message: 'Invalid group or member ID.' });
  }
  try{
    await prisma.group.update({
      where: { id: groupId },
      data: { members: { disconnect: { id: memberId } } }
    })
    res.json({message:"Member deleted from group"})
  }
  catch(error){
    console.error('Error deleting member from group:', error);
    res.status(500).json({ message: 'Error deleting member from group' });
  }
})
export default router 