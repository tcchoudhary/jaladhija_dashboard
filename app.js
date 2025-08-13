const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Router = require("./apps/config/routes")
const app = express();
const logger = require("morgan");
require('dotenv').config();
require("./apps/Cronjob/ticketCronJobs");
const port = process.env.PORT || 3000;
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

app.get('/', (req, res) => {
  res.status(200).send('hello apis is working');
});



app.use((req, res) => {
    res.status(404).json({
        message: 'Invalid Url',
        error: true,
        success: false,
        status: '0',
    });

});


app.listen(port,'127.0.0.1',()=>{
    console.log(`server is running at ${port}`)
});


