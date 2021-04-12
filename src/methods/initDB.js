const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const dbName = 'MoonActiveDB'; 
const dbCollectionName = 'Promotions'

const createPromotionsArray = () => {
    let arr = [];
    for (let i = 1; i <= 100; i++) {
        const obj = {
            id: i,
            promotionName: "promotion " + i,
            type: i % 3 ? "Basic" : i % 2 ? "Common" : "Epic",
            startDate: "02/02/2020",
            endDate: "02/02/2021",
            userGroupName: "user-group-name"
        };
        arr.push(obj);
    }
    return arr;
}

const createPromotionsCollection= (req, res)=>{
    try {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            const dbo = db.db(dbName);
            const promotionsArray = createPromotionsArray();
            const promiseInsertData = dbo.collection(dbCollectionName).insertMany(promotionsArray);
            promiseInsertData.then((data) => 
            {
                console.log(`promotions inserted`);
                res.json({ status: "Success" });
                res.statusCode = 200;
            });
            db.close();
        })
    } catch(error) {
        res.statusCode = 500;
        res.error = {
            msg: error.message,
        }
    };
}


module.exports.initDB = { createPromotionsCollection };
