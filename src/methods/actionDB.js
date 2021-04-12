const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017/";
const dbName = 'MoonActiveDB'; 
const dbCollectionName = 'Promotions'

const getPromotions = (req, res)=>{
    try {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            const dbo = db.db(dbName);
            const startPromotionId = parseInt(req.query.startPromotionId);
            const promiseData = dbo.collection(dbCollectionName).find().skip(startPromotionId).limit(30).toArray();
            promiseData.then((data) => 
            {
                res.json(data);
                res.statusCode = 200;
            });
            db.close();
        });  
    } catch(error) {
        res.statusCode = 500;
        res.error = {
            msg: error.message,
        }
    }
}

const getPromotionsColumns = (req, res)=>{
    try {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            const dbo = db.db(dbName);
            const promiseData = dbo.collection(dbCollectionName).findOne();
            promiseData.then((data) => {
                const columnsData = data? Object.keys(data): [];
                res.json(columnsData);
                res.statusCode = 200;
            });
            db.close();
        });  
    } catch(error) {
        res.statusCode = 400;
        res.error = {
            msg: error.message,
        }
    }
}

const deletePromotion = (req, res)=> {
    try {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            const dbo = db.db(dbName);
            const promotionId = req.query.promotionId; 
            const query = { "id": parseInt(promotionId) };
            dbo.collection(dbCollectionName).deleteOne(query, function (err, obj) {
                if (err) throw err;
                console.log("1 document deleted. id: " + promotionId);
                db.close();
                res.statusCode = 200
                res.json({ data: { status: "Success", id: promotionId } });
            });
        });
    } catch {
        res.statusCode = 500;
        res.error = {
            msg: error.message,
        }
    }
}

function getRandomID() {
    return Math.floor(Math.random() * (1000 - 100)) + 100;
  }

const duplicatePromotion=(req, res)=> {
    try {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            const dbo = db.db(dbName);
            const promotionId = req.body.params.promotionId;
            const query = { id: parseInt(promotionId)};
            const promotionPromise = dbo.collection(dbCollectionName).findOne(query);
            promotionPromise.then(pro => {
                const newPromotion={ ...pro, id: getRandomID() };
                delete newPromotion._id;
                const duplicatePromotion = dbo.collection(dbCollectionName).insertOne(newPromotion);
                duplicatePromotion.then(newPro => {
                    res.statusCode = 200;
                    res.json({ status: "Success", newPromotion: newPro.ops[0] })
                })
            })
        });
    } catch {
        res.statusCode = 500;
        res.error = {
            msg: error.message,
        }
    }
}

const editPromotion=(req, res) => {
    try {
        const promotion = req.body.params.promotion;
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            const dbo = db.db(dbName);
            const query = { id: parseInt(promotion.id) };
            const promotionEdit = dbo.collection(dbCollectionName).replaceOne(
                query,
                promotion
            );
            promotionEdit.then(pro => {
                res.statusCode = 200;
                res.json({ status: "Success", id: promotion.id })
            })
        });
    } catch {
        res.statusCode = 500;
        res.error = {
            msg: error.message,
        }
    }
}

module.exports.actionDB = { getPromotions, getPromotionsColumns, deletePromotion, duplicatePromotion, editPromotion };