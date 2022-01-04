
const product = require("../models/product");
const Product = require("../models/product");

const ITEMS_PER_PAGE = 6;

exports.renderProducts = (req, res, next) => {

    const page = +req.query.page || 1;
    let totalItems;

    product.find().countDocuments().then(numProducts => {
        
        totalItems = numProducts;
        return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
    }).then(products => {
            res.render("shop/index", {
                pageTitle: "Products",
                products: products,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.renderProdDetails = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(prod => {
        res.render("shop/prod-details", {
            pageTitle: "Product Details",
            products: prod
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.renderHome = (req, res, next) => {

    if(req.isAuthenticated()) {

        const page = +req.query.page || 1;
        let totalItems;

        product.find().countDocuments().then(numProducts => {
        
            totalItems = numProducts;
            return Product.find()
                    .skip((page - 1) * ITEMS_PER_PAGE)
                    .limit(ITEMS_PER_PAGE)
        }).then(products => {
                res.render("shop/product-list", {
                    pageTitle: "Home",
                    products: products,
                    currentPage: page,
                    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                    hasPreviousPage: page > 1,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                });
            })
            .catch(err => {
                console.log(err);
            });
        
    } else {
        res.redirect("/login");
    }

};