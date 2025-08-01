const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Router = require("./apps/config/routes")
const app = express();
const logger = require("morgan");
require('dotenv').config();
const port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ limit: '5000mb', extended: false }));
app.use(bodyParser.json({ limit: '5000mb' }));
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(logger('dev'));

app.get('/health', (req, res) => {
    res.send("Welcome");
});


app.use('/uploads', express.static('./uploads'));
app.use('/api/admin', Router);

app.get('/api/ping', (req, res) => {
  res.status(200).send('pong');
});



app.use((req, res) => {
    res.status(404).json({
        message: 'Invalid Url',
        error: true,
        success: false,
        status: '0',
    });

});


app.listen(port,()=>{
    console.log(`server is running at ${port}`)
});


