import express from 'express'
import prisma from '../prismaClient.js'


const router = express.Router()


router.post('/', async (req, res) => {

  const { groupId, title, totalAmount, paidById, splits, currency } = req.body;
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

  const sumOfSplits = splits.reduce((sum, split) => sum + parseFloat(split.amount || 0), 0);
  if (Math.abs(sumOfSplits - parsedTotalAmount) > 0.01) {
    return res.status(400).json({ message: `The sum of splits (${sumOfSplits.toFixed(2)}) does not match the total amount (${parsedTotalAmount.toFixed(2)}).` });
  }

  try {

    const newExpense = await prisma.$transaction(async (tx) => {
      const group = await tx.group.findFirst({
        where: {
          id: parsedGroupId,
          members: {
            some: {
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
          paidById: parsedPaidById,
          currency
        }
      });


      await tx.expenseSplit.createMany({
        data: splits.map(split => ({
          userId: split.memberId,
          amountOwed: parseFloat(split.amount),
          share: parseInt(split.share),
          percent: parseInt(split.percent),
          groupExpenseId: groupExpense.id
        }))
      });


      return tx.groupExpense.findUnique({
        where: { id: groupExpense.id },
        include: {
          expenseSplit: true,
          paidBy: {
            select: { id: true, username: true, profilephoto: true }
          }
        }
      });
    });

    res.status(201).json({ newExpense });
  } catch (error) {
    console.error('Error creating group expense:', error);
    if (error.message.includes('Group not found') || error.message.includes('not part of this group')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'An unexpected error occurred while creating the expense.' });
  }
});


router.get('/:id', async (req, res) => {
  const groupId = req.params.id
  try {
    const groupExpenses = await prisma.groupExpense.findMany({
      where: {
        groupId: parseInt(groupId)
      },
      include: {
        expenseSplit: true,
        paidBy: {
          select: { id: true, username: true, profilephoto: true }
        }
      }
    })
    res.json({ groupExpenses })
  } catch (error) {
    console.error('Error fetching group expenses:', error)
    res.status(500).json({ message: 'Failed to fetch group expenses' })
  }
})

//Bill routes

router.post('/bill', async (req, res) => {
  const { groupId, description, totalAmount, payerId, expenseItems } = req.body;
  const parsedGroupId = parseInt(groupId);
  const parsedTotalAmount = parseFloat(totalAmount);
  const parsedPayerId = parseInt(payerId);


  if (!description || !groupId || !totalAmount || !payerId) {
    return res.status(400).json({ message: 'Missing required fields: groupId, title, totalAmount, payerId.' });
  }

  if (isNaN(parsedGroupId) || isNaN(parsedTotalAmount) || isNaN(parsedPayerId)) {
    return res.status(400).json({ message: 'Invalid data types for groupId, totalAmount.' });
  }

  if (!expenseItems || !Array.isArray(expenseItems) || expenseItems.length === 0) {
    return res.status(400).json({ message: 'Splits array is required and must not be empty.' });
  }

  const sumOfItems = expenseItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
  if (Math.abs(sumOfItems - parsedTotalAmount) > 0.01) {
    return res.status(400).json({ message: `The sum of items (${sumOfItems.toFixed(2)}) does not match the total amount (${parsedTotalAmount.toFixed(2)}).` });
  }

  try {

    const newBill = await prisma.$transaction(async (tx) => {
      const group = await tx.group.findFirst({
        where: {
          id: parsedGroupId,
          members: {
            some: {
              id: req.userId
            }
          }
        },
        include: { members: { select: { id: true } } }
      });

      if (!group) {
        throw new Error('Group not found or you are not a member.');
      }

      const bill = await tx.bill.create({
        data: {
          groupId: parsedGroupId,
          description: description,
          totalAmount: parsedTotalAmount,
          payerId: parsedPayerId,
          creatorId: req.userId
        }
      });


      
      for (const item of expenseItems) {
        await tx.expenseItem.create({
          data: {
            price: item.price,
            description: item.description,
            billId: bill.id,
            owers: {
              connect: item.owers.map(owerId => ({ id: owerId }))
            }
          }
        });
      }


      return tx.bill.findUnique({
        where: { id: bill.id },
        include: {
          items: true,
        }
      });
    });

    res.status(201).json({ newBill });
  } catch (error) {
    console.error('Error creating group Bill:', error);
    if (error.message.includes('Group not found') || error.message.includes('not part of this group')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'An unexpected error occurred while creating the bill.' });
  }
})

router.get('/bill/:id', async (req, res) => {
  const groupId = req.params.id
  try {
    const groupBills = await prisma.bill.findMany({
      where: {
        groupId: parseInt(groupId)
      },
      include: {
        items: {
          include: {
            owers: {
              select: { id: true }
            }
          }
        },
        payer: {
          select: { id: true, username: true, profilephoto: true }
        },
        creator: {
          select: { id: true, username: true, profilephoto: true }
        }
      }
    })
    res.json({ groupBills })
  } catch (error) {
    console.error('Error fetching group Bills:', error)
    res.status(500).json({ message: 'Failed to fetch group Bills' })
  }
})

export default router