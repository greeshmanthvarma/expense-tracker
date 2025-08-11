import express from 'express'
import prisma from '../prismaClient.js'


const router=express.Router()


router.post('/', async(req,res)=>{
  
  const{groupId, title, totalAmount, paidById, splits} = req.body;
  const parsedGroupId = parseInt(groupId);
  const parsedTotalAmount = parseFloat(totalAmount);
  const parsedPaidById = parseInt(paidById);

  if (!title || !groupId || !totalAmount || !paidById) {
    return res.status(400).json({ message: 'Missing required fields: groupId, title, totalAmount, paidById.' });
  }

  if (isNaN(parsedGroupId) || isNaN(parsedTotalAmount) || isNaN(parsedPaidById)) {
    return res.status(400).json({ message: 'Invalid data types for groupId, totalAmount, or paidById.' });
  }

  if (!splits || !Array.isArray(splits) || splits.length === 0) {
    return res.status(400).json({ message: 'Splits array is required and must not be empty.' });
  }

  const sumOfSplits = splits.reduce((sum, split) => sum + parseFloat(split.amountOwed || 0), 0);
  if (Math.abs(sumOfSplits - parsedTotalAmount) > 0.01) { 
    return res.status(400).json({ message: `The sum of splits (${sumOfSplits.toFixed(2)}) does not match the total amount (${parsedTotalAmount.toFixed(2)}).` });
  }

  try{

    const newExpense = await prisma.$transaction(async(tx) => {
      const group = await tx.group.findFirst({
        where :{
          id : parsedGroupId,
          members : {
            some:{
              id: req.userId 
            }
          }
        },
        include: { members: { select: { id: true } } }
      });

      if (!group) {
        throw new Error('Group not found or you are not a member.');
      }
      const groupMemberIds = new Set(group.members.map(m => m.id));
      if (!groupMemberIds.has(parsedPaidById) || !splits.every(split => groupMemberIds.has(split.memberId))) {
        throw new Error('One or more users (payer or in splits) are not part of this group.');
      }

      const groupExpense = await tx.groupExpense.create({
        data: {
          groupId: parsedGroupId,
          title: title,
          totalAmount: parsedTotalAmount,
          paidById: parsedPaidById 
        }
      });

      
      await tx.expenseSplit.createMany({
        data: splits.map(split => ({
          userId: split.memberId,
          amountOwed: parseFloat(split.amountOwed),
          groupExpenseId: groupExpense.id
        }))
      });

      
      return tx.groupExpense.findUnique({
        where: { id: groupExpense.id },
        include: {
          expenseSplit: { 
            include: { user: { select: { id: true, username: true, profilephoto: true } } }
          },
          paidBy: { 
            select: { id: true, username: true, profilephoto: true }
          }
        }
      });
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error creating group expense:', error);
    if (error.message.includes('Group not found') || error.message.includes('not part of this group')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'An unexpected error occurred while creating the expense.' });
  }
});


router.get('/:id',async(req,res)=>{
  const groupId= req.params
  try{
    const groupExpenses= await prisma.groupExpense.findMany({
      where:{
        groupId: parseInt(groupId.id)
      }
    })
    res.json({groupExpenses})
  }catch(error){
    console.error('Error fetching group expenses:', error)

}
})
  

export default router