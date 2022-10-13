const express = require('express');
const cors = require("cors")
const bodyParser = require('body-parser');
const userRouter = require("./routes/userRoutes");
const superAdminRouter = require("./routes/superAdminRoutes")
const app = express();
const connectToMongo = require("./db");
// var fileupload = require("express-fileupload");

const port = process.env.PORT || 5000;

connectToMongo();
// app.use(fileupload());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.use('/photos', express.static('photos'));

app.get("/", (req,res)=>{
    res.send('Yuva-SMV Backend')
})

app.use(userRouter);
app.use(superAdminRouter);


app.listen(port, () => {
    console.log("Listening on port ", port)
});
