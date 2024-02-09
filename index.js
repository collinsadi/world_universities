const express = require("express");
const app = express();
const universities = require("./world_universities.json");
const port = process.env.PORT || 3000;




app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get("/get/all", (req, res)=>{

  res.json(universities);

})



app.listen(port, ()=>{
  console.log(`Server Running on port ${port}`);
})