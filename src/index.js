require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Papa = require("papaparse");
const fs = require("fs");
const app = express();
const { validateProduct } = require("./validateProduct");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;


const upload = multer({ dest: 'uploads/' })

app.get("/products",async (req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const total = await prisma.product.count();
    const skip = (page - 1) * limit;
    const data = await prisma.product.findMany({
            skip:skip,
            take: limit,
            orderBy: { sku: "asc" }, // optional sorting
        });
    const totalPages = Math.ceil(total / limit);
    console.log(data);
    return res.json({
        pageNumber: page, 
        totalRecords:total,
        limitOnSinglePage: limit,
        totalPages,
        data:data
    })
})

app.post("/uploads", upload.single("file"),async (req,res)=>{
    console.log(req.file);
    if(!req.file){
        return res.status(400).json({error:"file not uploaded"});
    }
    const filePath = req.file.path;

    const store = [];
    const failed = [];
      fs.readFile(filePath,'utf-8',async (err,data) =>{
        if(err){
            console.error("error in file reading: ",err);
            return ;
        }
        const result = Papa.parse(data,{
            header:true,
            skipEmptyLines:true
        })

        const products = result.data;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const validationErrors = validateProduct(product);
            if (validationErrors.length > 0) {
                failed.push({
                    row: i + 1,
                    errors: validationErrors
                });
                continue;
            }
            try {
                const dbproduct = await prisma.product.create({
                    data: {
                        sku: product.sku,
                        name: product.name,
                        brand: product.brand,
                        color: product.color,
                        size: product.size,
                        mrp: parseInt(product.mrp),
                        price: parseInt(product.price),
                        quantity: parseInt(product.quantity),
                    },
                })
                store.push(i);
                console.log(i);
            } catch (dbErr) {
                console.log(dbErr);
                failed.push({
                    row: i + 1,
                    errors: [dbErr.message],
                });
            }
        }


        fs.unlinkSync(filePath);
        console.log(store.length);
        const len = store.length;
        return res.json({
            stored: len,
            failed: failed
        })


    });

})

app.get("/products/search",async (req,res)=>{
   const { brand, color, minPrice, maxPrice } = req.query;

const data = await prisma.product.findMany({
    where:{
        brand:{
            contains:brand,
            mode:"insensitive"
        },
        color:{
            contains:color,
            mode:"insensitive"
        },
        price:{
            gte:minPrice,
            lte:maxPrice
        }
    }
 });
 return res.json({
    data
 })
} )

app.listen(PORT, ()=>{
    console.log("server started",PORT);
});