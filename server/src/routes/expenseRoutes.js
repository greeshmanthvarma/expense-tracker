import express from 'express'
import prisma from '../prismaClient.js'


const router=express.Router()

router.get('/',async(req,res)=>{
  try{
    const expenses=await prisma.expense.findMany({
      where:{
        userId:req.userId
      }
    })
    
    res.json({ expenses })
  }catch(error){
    res.status(500).json({message:"Error fetching expenses"})
  }
})

router.post('/', async (req, res) => {
  const { price, description, currency, category, createdAt } = req.body;
  try {
    let expenseCurrency = currency;
    if (!expenseCurrency) {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { currency: true }
      });
      expenseCurrency = user?.currency || 'USD';
    }

    const expense = await prisma.expense.create({
      data: {
        price,
        description,
        currency: expenseCurrency,
        category,
        createdAt, 
        userId: req.userId
      }
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error); 
    res.status(500).json({ message: "Error creating expense" });
  }
});

router.put('/:id',async(req,res)=>{
  const {price,description,currency,category,createdAt}=req.body
  const {id}=req.params
  try{
    let expenseCurrency = currency;
    if (!expenseCurrency) {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { currency: true }
      });
      expenseCurrency = user?.currency || 'USD';
    }

    const updatedExpense= await prisma.expense.update({
      where:{
        id: parseInt(id),
        userId:req.userId
      },
      data:{
        price,
        description,
        currency: expenseCurrency,
        category,
        createdAt
      }
    })
    console.log('Update successful:', updatedExpense) 
    res.status(200).json(updatedExpense)
  }catch(error){
    console.error('Update error:', error)
    res.status(500).json({message:"Error updating expense"})
  }
})

router.delete('/:id',async(req,res)=>{
  
  const {id}=req.params

  await prisma.expense.delete({
    where:{
      id:parseInt(id),
      userId:req.userId
    }
  })
  res.send({message:"Expense Deleted"})
})


export default router