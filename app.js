const express = require('express');
const cors = require("cors")
const bodyParser = require('body-parser');
// const fileupload = require("express-fileupload");
const userRouter = require("./routes/userRoutes");
const superAdminRouter = require("./routes/superAdminRoutes")

const app = express();
const connectToMongo = require("./db");
const port = process.env.PORT || 5000;

connectToMongo();
// app.use(fileupload());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(cors());
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use('/photos', express.static('photos'));
app.use('/excel', express.static('excel'));

app.get("/", (req,res)=>{
    res.send('Yuva-SMV Backend')
})

app.use(userRouter);
app.use(superAdminRouter);


app.listen(port, () => {
    console.log("Listening on port ", port)
});
