const product = require("../models/product");
const Product = require("../models/product");

const fileHelper = require("../util/file");

const ITEMS_PER_PAGE = 6;

exports.renderAdminProducts = (req, res, next) => {

    const page = +req.query.page || 1;
    let totalItems;

    product.find().countDocuments().then(numProducts => {
        
        totalItems = numProducts;
        return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
    }).then(products => {
            res.render("admin/products", {
                pageTitle: "products",
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

exports.renderAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.discription;

    const imgurl = image.path;

    const product = new Product({
        title: title,
        price: price,
        discription: description,
        imgurl: imgurl
    });
    product.save()
    
    .then(result => {
      console.log("successfully created");
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.adminEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        res.redirect("/");
    }
    const prodId = req.params.prodId;

    Product.findById(prodId)
      .then(product => {
        if(!product){
            return res.redirect("/");
        }

        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            product: product,
            path: "admin/edit-product",
            editing: editMode
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.adminUpdateProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImg = req.file;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.discription;

    Product.findById(prodId)
    .then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        if(updatedImg) {
            fileHelper.deleteFile(product.imgurl);
            product.imgurl = updatedImg.path;
        }
        product.discription = updatedDescription;
        return product.save();
    })
    .then(result => {
        console.log("updated successfully");
        res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.adminDeleteProduct = (req, res, next) => {
    const prodId = req.body.prodId;

    product.findById(prodId).then(prod => {
        if(!prod) {
            return next(new Error("Product not found."));
        }

        fileHelper.deleteFile(prod.imgurl);
        return Product.findByIdAndRemove(prodId, { useFindAndModify: false });
    }).then(() => {
        console.log("successfully Deleted");
        res.redirect("/admin/products")
    })
    .catch(err => console.log(err));
    
};