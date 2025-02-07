const express = require("express");
const router = express.Router();

router.get('/', (req,res)=>{
  
  return res.send('This is ABDM service ..');

});


module.exports = router;