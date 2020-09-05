const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        path: "/products",
        PageTitle: "All Products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  //Approach to find using Where Query
  Product.findAll({ where: { id: productId } })
    .then((products) => {
      res.render("shop/product-detail", {
        PageTitle: products[0].title,
        product: products[0],
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
  //Approach to find using Primary key
  Product.findByPk(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        PageTitle: product.title,
        product: product,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndexPage = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      console.log(products);
      res.render("shop/index", {
        prods: products,
        path: "/",
        PageTitle: "Shop",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll()
      .then(([rows, fieldData]) => {
        const cartProducts = [];
        for (product of rows) {
          const cartProductData = cart.products.find(
            (prod) => prod.id === product.id
          );
          if (cartProductData) {
            cartProducts.push({
              productData: product,
              qty: cartProductData.qty,
            });
          }
        }
        res.render("shop/cart", {
          path: "/cart",
          PageTitle: "Your Cart",
          products: cartProducts,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then(([row, fieldData]) => {
      Cart.addProduct(productId, product.price);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", { path: "/orders", PageTitle: "Your Orders" });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { path: "/checkout", PageTitle: "Checkout" });
};