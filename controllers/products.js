const Product = require('../models/product')

const getAllProductsStatic = async (req,res)=>{
    // const products =await Product.find({featured:true})
    const products =await Product.find({}).sort('name').select('name price').limit(10).skip(2)
    res.status(200).json({products,amount:products.length})
}

const getAllProducts = async (req,res)=>{  
    const {featured,company,name,sort,fields,numericFilters} = req.query   // filter validation
    const queryObject = {}

    if(featured){
        queryObject.featured = featured ==='true'? true : false
    }

    if(company){
        queryObject.company = company
    }

    if(name){
        queryObject.name = {$regex: name, $options: 'i'} // $regex is used to find a partial match in a string value and option is a format. therefore we used 'i' lowercase sensitive
    }

    
    if (numericFilters){
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<=)\b/g
        let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
        // console.log(filters)
        const options = ['price','rating']
        filters = filters.split(',').forEach((item)=>{
            const [field,operator,value]=item.split('-')
            if(options.includes(field)){
                queryObject[field]={ [operator]: Number(value)}
            }
        })
    }

    console.log(queryObject);
    let result = Product.find(queryObject)

    // sort
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else{
        result = result.sort('createAt')
    }
    
    // select
    if(fields){
        const fieldsList = fields.split(',').join(" ")
        result = result.select(fieldsList)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)


    const products = await result
    res.status(200).json({products,count: products.length})
}

module.exports = {  
    getAllProductsStatic,
    getAllProducts,
}