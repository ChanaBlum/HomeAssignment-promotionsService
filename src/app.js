const express = require('express');
const bodyParser = require('body-parser');
const { actionDB } = require('./methods/actionDB');
const { initDB } = require('./methods/initDB');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/getPromotions', (req, res) => {
    actionDB.getPromotions(req, res);
});

app.get('/getPromotionsColumns', (req, res) => {
    actionDB.getPromotionsColumns(req, res);
});

app.post('/editPromotion', (req, res) => {
    actionDB.editPromotion(req, res);
});

app.delete('/removePromotion', (req, res) => {
    actionDB.deletePromotion(req, res);
});

app.post('/duplicatePromotion', (req, res) => {
    actionDB.duplicatePromotion(req, res);

});

app.post('/createPromotionsCollection', (req, res) => {
    initDB.createPromotionsCollection(req, res);
});

app.listen(port, () => console.log(`app listening on port ${port}!`))
