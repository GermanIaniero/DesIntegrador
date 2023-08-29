import productModel from "./DAO/mongoManager/models/productModel.js";
import mongoose from "mongoose";

const uri = "mongodb+srv://gerlian:1234@clusterger.mgws5uk.mongodb.net/"

mongoose.connect(uri, {dbName: 'eccommerce'})
        .then(async () => {
            console.log('DB connected')

            //const response = await userModel.find()
            const products = await productModel.paginate({category: 'PC'}, {
                limit: 2, page: 1
            })

            console.log(products)
        })