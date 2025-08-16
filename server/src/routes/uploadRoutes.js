import express from 'express'
import aiGetReceiptDetails from '../aiGetReceiptDetails.js'
import aiGenearteBill from '../aiGenerateBill.js'


const router=express.Router()

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

router.post('/bill',async(req,res)=>{
  try{
    const data= await aiGenearteBill(req.file.path)
    const aiData= JSON.parse(data)
    res.json(aiData)
    console.log(data)
  }catch(err){
    console.log(err)
    res.status(500).json({error:'Failed to process bill'})
  }
})

export default router