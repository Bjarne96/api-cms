import * as customerController from "./controllers/customerController";
import * as articleController from "./controllers/articleController";
import * as productController from "./controllers/productController";
import * as backboneController from "./controllers/backboneController";
import * as userController from "./controllers/userController";

import * as userService from "./services/userServices";
import * as sessionService from "./services/sessionServices";
import * as paypalServices from "./services/paypalServices";
import * as emailServices from "./services/emailServices";
import { Request, Response } from 'express';

module.exports = (app) => {
    //all needed get services without authentication
    app.get("/loadedbackbone/:id", backboneController.getLoadedBackbone);
    app.get("/articles", articleController.getAllArticles);
    app.get("/article/:id", articleController.getArticle);
    app.get("/products", productController.getAllProducts);
    app.get("/product/:id", productController.getProduct);

    //email services
    app.post("/contact", emailServices.proccessContact) //dummy proccessor
    app.post("/trigger", emailServices.sendOrderMail) //dummy payment email

    //paypal services
    app.post("/create_payment", paypalServices.createPayment) //paypal-createpayment
    app.post("/execute_payment", paypalServices.executePayment) //paypal-createpayment
    app.post("/paypalWebhook", paypalServices.webHooks) //paypal-webhooks
    // app.get("/payments", paymentController.getAllPayments);

    //activate when making a new account and comment out afterwards
    //app.put("/register", userService.register);
    //activate when removing a new account and comment out afterwards
    //app.delete("/user/:id", userController.deleteUser);

    //session services
    app.post("/login", sessionService.login) //login

    //authenticate request (req.header.authorization)
    app.all('/*', async (req: Request, res: Response, next) => {
        try {
            if (req.originalUrl == "/paypalWebhook") {
                await paypalServices.webHooks;
                return
            }
            //validates requests, refreshs token and handles next, stops when invalid request
            await sessionService.validate(req, res, next);
            return;
        } catch (error) {
            //todo error handling
            console.log("catch", error)
            return;
        }
    });

    //all data routes

    //backbone routes
    app.get("/backbones", backboneController.getAllBackbones);
    app.get("/backbone/:id", backboneController.getBackbone);
    app.put("/backbone", backboneController.addBackbone);
    app.delete("/backbone/:id", backboneController.deleteBackbone);
    app.post("/backbone/:id", backboneController.updateBackbone);

    //customer routes
    app.get("/customers", customerController.getAllCustomers);
    app.get("/customer/:id", customerController.getCustomer);
    app.put("/customer", customerController.addCustomer);
    app.delete("/customer/:id", customerController.deleteCustomer);
    app.post("/customer/:id", customerController.updateCustomer);
    app.get("/customer", customerController.getCustomerByParam);

    //article routes
    app.put("/article", articleController.addArticle);
    app.delete("/article/:id", articleController.deleteArticle);
    app.post("/article/:id", articleController.updateArticle);

    //product routes
    app.put("/product", productController.addProduct);
    app.delete("/product/:id", productController.deleteProduct);
    app.post("/product/:id", productController.updateProduct);

    //Only admins have access
    app.all('/*', async (req: Request, res: Response, next) => {
        try {
            //validates requests, refreshs token and handles next, stops when invalid request
            await sessionService.validateAdmin(req, res, next);
            return;
        } catch (error) {
            //todo error handling
            console.log("catch", error)
            return;
        }
    });

    //session services
    app.put("/register", userService.register); //register

    //user routes
    app.get("/users", userController.getAllUsers);
    app.get("/user/:id", userController.getUser);
    app.put("/user", userController.addUser);
    app.delete("/user/:id", userController.deleteUser);
    app.post("/user/:id", userController.updateUser);

}