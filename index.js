const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const axios = require('axios');

const Details = require('./models/details');

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

const url = "mongodb://127.0.0.1:27017/coinmarketcap";
// const url = 'mongodb+srv://TejasN:<password>@cluster0.4dggq3i.mongodb.net/?retryWrites=true&w=majority'

mongoose.set('strictQuery', false);

mongoose.connect(url).then(() => {
    console.log("Connected to Database");
}).then(async () => {
    console.log('MongoDB connected')

    const API_URL = 'https://api.wazirx.com/api/v2/tickers'

    try {
        const res = await axios.get(API_URL)
        const details = res.data

        const top10 = Object.keys(details).slice(0, 10)

        top10.forEach(async (key) => {
            const detail = details[key]
            const newDetail = new Details({
                name: detail.name,
                last: detail.last,
                buy: detail.buy,
                sell: detail.sell,
                volume: detail.volume,
                base_unit: detail.base_unit
            })

            try {
                const savedDetail = await newDetail.save()
                console.log(savedDetail)
            } catch (err) {
                console.log(err)
            }
        })
    } catch (err) {
        console.log(err)
    }
}).catch(err => console.log(err));

app.get('/', async (req, res) => {
    try {
        const details = await Details.find().sort({ last: -1 }).limit(10); // retrieve top 10 details from MongoDB
        res.render('index', { details }); // pass the details as an object to the EJS template
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})