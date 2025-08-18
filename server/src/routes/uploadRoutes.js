import express from 'express'
import aiGetReceiptDetails from '../aiGetReceiptDetails.js'
import aiGenearteBill from '../aiGenerateBill.js'


const router = express.Router()

router.post('/receipt', async (req, res) => {
  try {
    const data = await aiGetReceiptDetails(req.file.path);
    const aiData = JSON.parse(data);
    res.json(aiData);
    console.log(data)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to process receipt' });
  }
});

router.post('/bill', async (req, res) => {
  try {
    const data = await aiGenearteBill(req.file.path)  
    console.log('Raw AI Response:', data)
    
    
    const itemDetails = JSON.parse(data.itemDetails);
    const billDetails = JSON.parse(data.billDetails);
    
   
    if (!Array.isArray(itemDetails)) {
      throw new Error('Invalid item details format');
    }
    
    if (!billDetails.totalAmount || !billDetails.description) {
      throw new Error('Missing required bill details');
    }
    
    
    res.json({
      itemDetails,
      billDetails
    });
    
  } catch (err) {
    console.log('Error processing bill:', err)
    res.status(500).json({ error: 'Failed to process bill: ' + err.message })
  }
})

export default router